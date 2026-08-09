// Storage module for persistent user data, custom subjects, SRS spacing (Anki decay intervals), statistics, Real Supabase Cloud Database sync, and Anti-Cheat Checksum auto-purge
import { DEFAULT_SUBJECTS } from './questionsData.js';
import { pushPlayerToCloud, pushProfileToCloud, fetchProfileFromCloud, mergeProfileData, mergeSubjectsData, saveFriendId, cloudSignUp, cloudSignIn, cloudResetPassword, cloudSignOut, checkCloudUpdateTimestamp } from './cloudDB.js';

const STORAGE_KEYS = {
  SUBJECTS: 'rev_game_subjects_v6',
  USER_PROFILE: 'rev_game_profile_v3',
  REVISION_ITEMS: 'rev_game_revision_items_v2',
  CARD_SRS: 'rev_game_card_srs_v2',
  SETTINGS: 'rev_game_settings_v2',
  GLOBAL_LEADERBOARD: 'remix_global_leaderboard_v1',
  PAUSED_SESSION: 'remix_paused_session_v1'
};

const CHECKSUM_SECRET = 'remix_anti_cheat_secret_sig_2026';

const DEFAULT_PROFILE = {
  id: 'default_user',
  name: 'Réviseur Pro',
  avatar: '🎓',
  level: 1,
  xp: 0,
  coins: 50,
  streak: 0,
  maxStreak: 0,
  lastLoginDate: null,
  streakDays: 0,
  dailyQuests: null,
  lastPlayedDate: null,
  theme: 'theme-cyberpunk',
  purchasedItems: ['theme-cyberpunk', 'avatar-student'],
  inventory: {
    powerup_fifty: 2,

    powerup_skip: 1
  },
  customRewards: [],
  unlockedAchievements: [],
  cloudAccount: null,
  checksumToken: null,
  stats: {
    gamesPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    skippedAnswers: 0,
    perfectGames: 0,
    duelsPlayed: 0,
    duelWins: 0,
    duelLosses: 0,
    subjectStats: {}
  }
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  volume: 0.7,
  timerDuration: 180,
  questionsPerSession: 10
};

const ANKI_INTERVAL_LADDER = [1, 3, 7, 15, 30, 90, 180, 365, 730];

async function hashPasscode(passcode) {
  if (window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(passcode + '_remix_salt_2026');
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(passcode);
}

function generateFriendId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return 'RMX-' + code;
}

function computeAntiCheatToken(profile) {
  const level = profile.level || 1;
  const xp = profile.xp || 0;
  const coins = profile.coins || 0;
  const wins = profile.stats?.duelWins || 0;
  const played = profile.stats?.duelsPlayed || 0;
  const raw = `${level}:${xp}:${coins}:${wins}:${played}:${CHECKSUM_SECRET}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `sig_${Math.abs(hash).toString(16)}`;
}

let subscribers = [];

export class StorageManager {
  static subscribe(fn) {
    subscribers.push(fn);
  }

  static notify() {
    subscribers.forEach(fn => fn());
  }

  static computeSignature(profile) {
    return computeAntiCheatToken(profile);
  }

  static verifyAntiCheatToken(profile) {
    if (!profile || !profile.checksumToken) return true;
    const expected = computeAntiCheatToken(profile);
    return profile.checksumToken === expected;
  }

  static getSubjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (!data) { return { ...DEFAULT_SUBJECTS }; }
      
      const custom = JSON.parse(data);
      const reconstructed = { ...DEFAULT_SUBJECTS };
      
      Object.keys(custom).forEach(id => {
        if (DEFAULT_SUBJECTS[id]) {
          if (custom[id].deleted) {
            delete reconstructed[id];
          } else {
            reconstructed[id] = { ...DEFAULT_SUBJECTS[id], ...custom[id], qcm: DEFAULT_SUBJECTS[id].qcm };
          }
        } else {
          reconstructed[id] = custom[id];
        }
      });
      return reconstructed;
    } catch (e) { return { ...DEFAULT_SUBJECTS }; }
  }

  static saveSubjects(subjects) {
    try {
      const optimizedSubjects = {};
      Object.keys(subjects).forEach(id => {
        if (DEFAULT_SUBJECTS[id]) {
          const optimized = { ...subjects[id] };
          delete optimized.qcm;
          optimizedSubjects[id] = optimized;
        } else {
          optimizedSubjects[id] = subjects[id];
        }
      });
      
      Object.keys(DEFAULT_SUBJECTS).forEach(id => {
        if (!subjects[id]) {
          optimizedSubjects[id] = { id: id, deleted: true };
        }
      });

      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(optimizedSubjects));
      this.autoSyncCloud();
      this.notify();
    } catch (e) {}
  }

  static addSubject(subject) {
    const subjects = this.getSubjects();
    subjects[subject.id] = subject;
    this.saveSubjects(subjects);
    return subjects;
  }

  static removeSubject(subjectId) {
    const subjects = this.getSubjects();
    if (subjects[subjectId]) { 
      delete subjects[subjectId];
      this.saveSubjects(subjects); 
    }
    return subjects;
  }

  static getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) { this.saveProfile(DEFAULT_PROFILE); return { ...DEFAULT_PROFILE }; }
      const profile = JSON.parse(data);
      if (!this.verifyAntiCheatToken(profile)) {
        console.warn('Tampered account detected! Purging...');
        this.purgeCheatedAccount(profile.name);
        return { ...DEFAULT_PROFILE };
      }
      return { ...DEFAULT_PROFILE, ...profile, stats: { ...DEFAULT_PROFILE.stats, ...(profile.stats || {}) } };
    } catch (e) { return { ...DEFAULT_PROFILE }; }
  }

  static purgeCheatedAccount(userName) {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      const existing = localStorage.getItem(STORAGE_KEYS.GLOBAL_LEADERBOARD);
      if (existing && userName) {
        let registry = JSON.parse(existing);
        registry = registry.filter(p => p.name.toLowerCase() !== userName.toLowerCase());
        localStorage.setItem(STORAGE_KEYS.GLOBAL_LEADERBOARD, JSON.stringify(registry));
      }
    } catch (e) {}
  }

  static saveProfile(profile) {
    try {
      profile.checksumToken = computeAntiCheatToken(profile);
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      this.registerGlobalPlayer(profile);
      this.autoSyncCloud();
      this.notify();
    } catch (e) {}
  }

  static registerGlobalPlayer(profile) {
    if (!profile || !profile.name) return;
    if (!this.verifyAntiCheatToken(profile)) return;
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.GLOBAL_LEADERBOARD);
      let registry = existing ? JSON.parse(existing) : [];
      const playerCard = {
        name: profile.name,
        level: profile.level || 1,
        xp: profile.xp || 0,
        coins: profile.coins || 0,
        wins: profile.stats?.duelWins || 0,
        total_duels: profile.stats?.duelsPlayed || 0,
        streak: profile.streakDays || 0,
        badges: profile.selectedBadges || (profile.unlockedAchievements ? profile.unlockedAchievements.slice(0, 3) : []),
        avatar: profile.avatar || '🎓',
        checksumToken: profile.checksumToken,
        lastActive: Date.now(),
        cloudAccount: profile.cloudAccount
      };
      const idx = registry.findIndex(p => p.name.toLowerCase() === profile.name.toLowerCase());
      if (idx >= 0) registry[idx] = playerCard;
      else registry.push(playerCard);
      localStorage.setItem(STORAGE_KEYS.GLOBAL_LEADERBOARD, JSON.stringify(registry));

      // Sync to real Supabase Cloud DB
      pushPlayerToCloud(playerCard).catch(() => {});
    } catch (e) {}
  }

  static getGlobalLeaderboardRegistry() {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.GLOBAL_LEADERBOARD);
      if (!existing) return [];
      const registry = JSON.parse(existing);
      return registry.filter(p => this.verifyAntiCheatToken(p));
    } catch (e) { return []; }
  }

  /* --- SRS Engine --- */
  static getSRSData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARD_SRS);
      return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
  }

  static updateCardSRS(cardId, isCorrect) {
    const allSRS = this.getSRSData();
    const now = Date.now();
    let cardData = allSRS[cardId] || { reps: 0, intervalDays: 1, easeFactor: 2.5, lastReviewed: null, nextDue: now, baseMastery: 0.0 };

    if (isCorrect) {
      const repIdx = Math.min(cardData.reps, ANKI_INTERVAL_LADDER.length - 1);
      cardData.intervalDays = ANKI_INTERVAL_LADDER[repIdx];
      cardData.reps += 1;
      cardData.baseMastery = Math.min(1.0, (cardData.baseMastery || 0) + 0.35);
    } else {
      cardData.reps = 0;
      cardData.intervalDays = 1;
      cardData.easeFactor = Math.max(1.3, (cardData.easeFactor || 2.5) - 0.2);
      cardData.baseMastery = Math.max(0.0, (cardData.baseMastery || 0) - 0.4);
    }

    cardData.lastReviewed = now;
    cardData.nextDue = now + (cardData.intervalDays * 24 * 60 * 60 * 1000);
    allSRS[cardId] = cardData;
    try {
      localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(allSRS));
      this.autoSyncCloud();
    } catch (e) {}
    return cardData;
  }

  static getEffectiveCardMastery(cardSRS) {
    if (!cardSRS || !cardSRS.lastReviewed) return 0.0;
    const now = Date.now();
    const baseMastery = cardSRS.baseMastery !== undefined ? cardSRS.baseMastery : 0.8;
    if (now <= cardSRS.nextDue) return baseMastery;
    const overdueDays = (now - cardSRS.nextDue) / (1000 * 60 * 60 * 24);
    return Math.max(0.05, baseMastery * Math.exp(-0.05 * overdueDays));
  }

  static getDeckMastery(deck) {
    if (!deck || !deck.questions || deck.questions.length === 0) return { percentage: 0, colorHex: '#9ca3af', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.1)' };
    const allSRS = this.getSRSData();
    let totalMastery = 0, reviewedCount = 0;
    deck.questions.forEach(q => {
      const cardSRS = allSRS[q.id];
      if (cardSRS && cardSRS.lastReviewed) { totalMastery += this.getEffectiveCardMastery(cardSRS); reviewedCount++; }
    });
    if (reviewedCount === 0) return { percentage: 0, colorHex: '#6b7280', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.15)' };
    const percentage = Math.round((totalMastery / deck.questions.length) * 100);
    if (percentage >= 75) return { percentage, colorHex: '#10b981', statusText: `🟢 ${percentage}% Maîtrisé`, borderStyle: '1px solid #10b981', boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)' };
    if (percentage >= 40) return { percentage, colorHex: '#f59e0b', statusText: `🟡 ${percentage}% À réviser bientôt`, borderStyle: '1px solid #f59e0b', boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)' };
    return { percentage, colorHex: '#ef4444', statusText: `🔴 ${percentage}% À réviser d'urgence`, borderStyle: '1px solid #ef4444', boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)' };
  }

  static getFolderMastery(deckList) {
    if (!deckList || deckList.length === 0) return { percentage: 0, colorHex: '#6b7280', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.15)' };
    let sumMastery = 0;
    deckList.forEach(deck => { const res = this.getDeckMastery(deck); sumMastery += res.percentage; });
    const p = Math.round(sumMastery / deckList.length);
    if (p >= 75) return { percentage: p, colorHex: '#10b981', statusText: `🟢 ${p}% Maîtrisé`, borderStyle: '1px solid #10b981', boxShadow: '0 0 14px rgba(16, 185, 129, 0.45)' };
    if (p >= 40) return { percentage: p, colorHex: '#f59e0b', statusText: `🟡 ${p}% En désuétude`, borderStyle: '1px solid #f59e0b', boxShadow: '0 0 14px rgba(245, 158, 11, 0.45)' };
    if (p > 0) return { percentage: p, colorHex: '#ef4444', statusText: `🔴 ${p}% À réviser d'urgence`, borderStyle: '1px solid #ef4444', boxShadow: '0 0 14px rgba(239, 68, 68, 0.45)' };
    return { percentage: 0, colorHex: '#6b7280', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.15)', boxShadow: 'none' };
  }

  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) { return { ...DEFAULT_SETTINGS }; }
  }

  static async syncFromCloudSilent() {
    const profile = this.getProfile();
    if (!profile?.cloudAccount?.username || !profile?.cloudAccount?.hashedKey) return false;
    const { username, hashedKey } = profile.cloudAccount;

    // Parse timestamps as numbers (Epoch time in ms)
    const cloudTimestamp = Number(await checkCloudUpdateTimestamp()) || 0;
    const localTimestampStr = localStorage.getItem('remix_last_cloud_sync');
    const localTimestamp = localTimestampStr ? Number(localTimestampStr) : 0;
    
    if (cloudTimestamp <= localTimestamp && cloudTimestamp !== 0) {
      return false; // Up to date, no need to download 1.6MB!
    }

    // Pass true to include subjects_data
    const cloudData = await fetchProfileFromCloud(username, hashedKey, true);
    if (!cloudData) return false;

    // Update local sync timestamp
    if (cloudData.updated_at) {
      localStorage.setItem('remix_last_cloud_sync', cloudData.updated_at.toString());
    }

    if (cloudData.profile_data) {
      const currentProfile = this.getProfile(); // Re-fetch to avoid race conditions!
      const mergedProf = mergeProfileData(currentProfile, cloudData.profile_data);
      // Ensure we re-compute anti-cheat token so we don't accidentally ban the user
      mergedProf.checksumToken = computeAntiCheatToken(mergedProf);
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mergedProf));
    }
    if (cloudData.srs_data) {
      if (cloudData.srs_data.srs) localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(cloudData.srs_data.srs));
      if (cloudData.srs_data.revisionItems) localStorage.setItem(STORAGE_KEYS.REVISION_ITEMS, JSON.stringify(cloudData.srs_data.revisionItems));
    }
    if (cloudData.subjects_data) {
      let localOptimized = {};
      try {
        const str = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
        if (str) localOptimized = JSON.parse(str);
      } catch(e) {}
      const mergedSubs = mergeSubjectsData(localOptimized, cloudData.subjects_data);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(mergedSubs));
    }
    if (cloudData.paused_session) {
      localStorage.setItem(STORAGE_KEYS.PAUSED_SESSION, JSON.stringify(cloudData.paused_session));
    } else if (cloudData.paused_session === null || (cloudData.srs_data && cloudData.srs_data.pausedSession === null)) {
      localStorage.removeItem(STORAGE_KEYS.PAUSED_SESSION);
    }
    return true;
  }

  /* --- CLOUD ACCOUNT SYNC (Supabase) --- */
  static async autoSyncCloud() {
    const profile = this.getProfile();
    if (!profile?.cloudAccount?.username || !profile?.cloudAccount?.hashedKey) return;
    const { username, hashedKey } = profile.cloudAccount;
    
    // Read optimized subjects directly from localStorage to push a lightweight payload
    let optimizedSubjectsToPush = {};
    try {
      const str = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (str) optimizedSubjectsToPush = JSON.parse(str);
    } catch(e) {}

    const cloudKey = `remix_cloud_db_${username}_${hashedKey}`;
    const payload = {
      profile,
      srs: this.getSRSData(),
      subjects: optimizedSubjectsToPush,
      pausedSession: this.getPausedSession(),
      revisionItems: this.getRevisionItems(),
      updatedAt: Date.now()
    };
    try { localStorage.setItem(cloudKey, JSON.stringify(payload)); } catch (e) {}
    
    pushProfileToCloud(
      username,
      hashedKey,
      profile,
      this.getSRSData(),
      optimizedSubjectsToPush,
      this.getPausedSession(),
      this.getRevisionItems()
    ).catch(() => {});
  }

  static async _hashPasscodeCheck(passcode) {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(passcode + '_remix_salt_2026');
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return btoa(passcode);
  }

  static async registerCloudAccount(email, passcode, username) {
    const cleanUser = username.trim();
    try {
      const authData = await cloudSignUp(email, passcode, cleanUser);
      if (!authData.user) {
        return { success: false, message: 'Erreur lors de la création du compte.' };
      }

      // Check if we need to wait for email confirmation (depends on Supabase settings)
      if (authData.user.identities && authData.user.identities.length === 0) {
        return { success: false, message: 'Cet email est déjà utilisé ou invalide.' };
      }

      // New account local profile setup
      const profile = this.getProfile();
      profile.name = cleanUser;
      profile.cloudAccount = { username: cleanUser, hashedKey: 'supabase_auth_v2' };
      if (!profile.friendId) {
        profile.friendId = generateFriendId();
      }
      this.saveProfile(profile);
      
      // Wait a moment for Supabase triggers to finish if any, then push profile
      await pushProfileToCloud(cleanUser, 'supabase_auth_v2', profile, this.getSRSData(), this.getSubjects(), this.getPausedSession(), this.getRevisionItems());
      
      return { success: true, isNew: true, profile };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  static async loginCloudAccount(email, passcode) {
    try {
      const authData = await cloudSignIn(email, passcode);
      if (!authData.user) {
        return { success: false, message: 'Identifiants incorrects.' };
      }

      let cleanUser = (authData.user.user_metadata?.username || 'Joueur').toLowerCase().replace(/[^a-z0-9_éèêëàâäôöûüùîïçœæ-]/g, '');

      // Try Supabase Cloud first
      const cloudData = await fetchProfileFromCloud(cleanUser, 'supabase_auth_v2', true);
      if (cloudData) {
        if (cloudData.username) {
          cleanUser = cloudData.username;
        }
        const profile = cloudData.profile_data || {};
        profile.cloudAccount = { username: cleanUser, hashedKey: 'supabase_auth_v2' };
        this.saveProfile(profile);
        if (cloudData.srs_data) {
          if (cloudData.srs_data.srs) localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(cloudData.srs_data.srs));
          else localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(cloudData.srs_data));

          if (cloudData.srs_data.revisionItems) localStorage.setItem(STORAGE_KEYS.REVISION_ITEMS, JSON.stringify(cloudData.srs_data.revisionItems));
        }
        if (cloudData.subjects_data) {
          let localOptimized = {};
          try {
            const str = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
            if (str) localOptimized = JSON.parse(str);
          } catch(e) {}
          const mergedSubs = mergeSubjectsData(localOptimized, cloudData.subjects_data);
          localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(mergedSubs));
        }
        if (cloudData.paused_session) {
          localStorage.setItem(STORAGE_KEYS.PAUSED_SESSION, JSON.stringify(cloudData.paused_session));
        } else if (cloudData.paused_session === null || (cloudData.srs_data && cloudData.srs_data.pausedSession === null)) {
          localStorage.removeItem(STORAGE_KEYS.PAUSED_SESSION);
        }
        // Ensure friendId is set and saved to Supabase column
        if (!profile.friendId) {
          profile.friendId = generateFriendId();
          this.saveProfile(profile);
          saveFriendId(cleanUser, 'supabase_auth_v2', profile.friendId).catch(() => {});
        }
        // Push merged state back to cloud immediately
        await this.autoSyncCloud();
        return { success: true, isNew: false, profile };
      }

      // If no cloud data yet, they probably just registered but didn't save yet.
      const profile = this.getProfile();
      profile.name = cleanUser;
      profile.cloudAccount = { username: cleanUser, hashedKey: 'supabase_auth_v2' };
      if (!profile.friendId) profile.friendId = generateFriendId();
      this.saveProfile(profile);
      pushProfileToCloud(cleanUser, 'supabase_auth_v2', profile, this.getSRSData(), this.getSubjects(), this.getPausedSession(), this.getRevisionItems()).catch(() => {});

      return { success: true, isNew: false, profile };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  static async resetCloudPassword(email) {
    try {
      await cloudResetPassword(email);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  static async logoutCloudAccount() {
    await cloudSignOut();
    const profile = this.getProfile();
    profile.cloudAccount = null;
    this.saveProfile(profile);
  }

  static getRevisionItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISION_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  }

  static addRevisionItem(questionObj, subjectId) {
    if (!questionObj) return;
    try {
      const items = this.getRevisionItems();
      const existingIdx = items.findIndex(item => item.question === questionObj.question);
      const itemData = {
        id: questionObj.id || Math.random().toString(36).substring(2, 9),
        question: questionObj.question,
        options: questionObj.options || questionObj.shuffledOptions || [],
        correct: questionObj.correct,
        explanation: questionObj.explanation || '',
        subjectId: subjectId,
        addedAt: Date.now()
      };
      if (existingIdx >= 0) {
        items[existingIdx] = itemData;
      } else {
        items.push(itemData);
      }
      localStorage.setItem(STORAGE_KEYS.REVISION_ITEMS, JSON.stringify(items));
      this.autoSyncCloud();
    } catch (e) {}
  }

  static removeRevisionItem(questionText) {
    if (!questionText) return;
    try {
      let items = this.getRevisionItems();
      items = items.filter(item => item.question !== questionText);
      localStorage.setItem(STORAGE_KEYS.REVISION_ITEMS, JSON.stringify(items));
      this.autoSyncCloud();
    } catch (e) {}
  }

  static exportAllData() {
    const backup = { subjects: this.getSubjects(), profile: this.getProfile(), settings: this.getSettings(), srs: this.getSRSData(), exportDate: new Date().toISOString() };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `remix_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(a); a.click(); a.remove();
  }

  static importData(jsonContent) {
    try {
      const data = JSON.parse(jsonContent);
      if (data.subjects) this.saveSubjects(data.subjects);
      if (data.profile) this.saveProfile(data.profile);
      if (data.settings) this.saveSettings(data.settings);
      if (data.srs) localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(data.srs));
      this.autoSyncCloud();
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  }

  static savePausedSession(sessionData) {
    if (!sessionData) {
      localStorage.removeItem(STORAGE_KEYS.PAUSED_SESSION);
      const profile = this.getProfile();
      profile.pausedSessionClearedAt = Date.now();
      this.saveProfile(profile);
      this.autoSyncCloud();
      return;
    }
    sessionData.savedAt = Date.now();
    localStorage.setItem(STORAGE_KEYS.PAUSED_SESSION, JSON.stringify(sessionData));
    this.autoSyncCloud();
  }

  static getPausedSession() {
    const data = localStorage.getItem(STORAGE_KEYS.PAUSED_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  static clearPausedSession() {
    localStorage.removeItem(STORAGE_KEYS.PAUSED_SESSION);
    const profile = this.getProfile();
    profile.pausedSessionClearedAt = Date.now();
    this.saveProfile(profile);
    this.autoSyncCloud();
  }

  static resetAllData() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
}
