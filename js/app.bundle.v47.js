// Bundled standalone script for Instant Web Execution
(function() {
'use strict';

// --- File: js/questionsData.js ---
const DEFAULT_SUBJECTS = {};


// --- File: js/cloudDB.js ---
// Cloud Database module — Supabase integration for global leaderboard and multi-device profile sync
const SUPABASE_URL = 'https://hsgrieghyfpzxuazfmvx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bborZn7bk6huf--BanH2pg___DL_98m';

let _supabaseClient = null;

function getDB() {
  if (_supabaseClient) return _supabaseClient;
  try {
    if (window.supabase && window.supabase.createClient) {
      _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch (e) {
    console.log('Supabase init failed:', e.message);
  }
  return _supabaseClient;
}

async function fetchServerDate() {
  const db = getDB();
  if (!db) return null;
  try {
    const { data, error } = await db.rpc('get_server_time');
    if (error) {
      console.warn("Could not fetch server time, reverting to local or aborting.", error);
      return null;
    }
    return data; // Returns 'YYYY-MM-DD'
  } catch (err) {
    console.error("Error fetching server date:", err);
    return null;
  }
}

// --- AUTHENTICATION (Supabase Auth) ---

async function cloudSignUp(email, password, username) {
  const db = getDB();
  if (!db) throw new Error("Supabase non initialisé.");
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: { username: username }
    }
  });
  if (error) throw error;
  return data;
}

async function cloudSignIn(email, password) {
  const db = getDB();
  if (!db) throw new Error("Supabase non initialisé.");
  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

async function cloudResetPassword(email) {
  const db = getDB();
  if (!db) throw new Error("Supabase non initialisé.");
  const { error } = await db.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return true;
}

async function cloudSignOut() {
  const db = getDB();
  if (!db) return;
  await db.auth.signOut();
}

async function getCloudUser() {
  const db = getDB();
  if (!db) return null;
  const { data: { user } } = await db.auth.getUser();
  return user;
}

// --- LEADERBOARD ---

async function pushPlayerToCloud(playerCard) {
  try {
    const db = getDB();
    if (!db) return;
    
    // Do not attempt to push if the user is a guest (no active session),
    // to avoid console 403 Forbidden errors from the RLS policies.
    const { data: { session } } = await db.auth.getSession();
    if (!session) return;

    await db.from('leaderboard').upsert({
      name: (playerCard.cloudAccount?.username || playerCard.name),
      level: playerCard.level || 1,
      xp: playerCard.xp || 0,
      coins: playerCard.coins || 0,
      wins: playerCard.wins || 0,
      total_duels: playerCard.total_duels || 0,
      streak: playerCard.streak || 0,
      badges: playerCard.badges || [],
      avatar: playerCard.avatar || '🎓',
      checksum_token: playerCard.checksumToken || '',
      last_active: Date.now()
    }, { onConflict: 'name' });
  } catch (e) {
    console.log('Leaderboard sync failed:', e.message);
  }
}

async function fetchCloudLeaderboard() {
  try {
    const db = getDB();
    if (!db) return [];
    const { data, error } = await db
      .from('leaderboard')
      .select('*')
      .order('level', { ascending: false })
      .order('coins', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.log('Leaderboard fetch failed:', e.message);
    return [];
  }
}

// --- PROFILE SYNC (multi-device account with Smart Merge Conflict Protection) ---

function mergeProfileData(localProfile, cloudProfile) {
  if (!cloudProfile) return localProfile;
  if (!localProfile) return cloudProfile;

  const merged = { ...cloudProfile, ...localProfile };

  // Track total coins earned and spent so buying an item or earning coins on one device
  // is mathematically exact without double-spending or resetting coins.
  const lEarned = localProfile.totalCoinsEarned ?? localProfile.coins ?? 50;
  const cEarned = cloudProfile.totalCoinsEarned ?? cloudProfile.coins ?? 50;
  const lSpent = localProfile.totalCoinsSpent ?? 0;
  const cSpent = cloudProfile.totalCoinsSpent ?? 0;

  merged.totalCoinsEarned = Math.max(lEarned, cEarned);
  merged.totalCoinsSpent = Math.max(lSpent, cSpent);
  merged.coins = Math.max(0, merged.totalCoinsEarned - merged.totalCoinsSpent);

  // Maximize XP, Level, and Streaks
  merged.xp = Math.max(localProfile.xp || 0, cloudProfile.xp || 0);
  merged.level = Math.max(localProfile.level || 1, cloudProfile.level || 1);
  merged.streak = Math.max(localProfile.streak || 0, cloudProfile.streak || 0);
  merged.maxStreak = Math.max(localProfile.maxStreak || 0, cloudProfile.maxStreak || 0);

  // Merge Purchased Items (Themes & Avatars)
  const lPurchased = localProfile.purchasedItems || [];
  const cPurchased = cloudProfile.purchasedItems || [];
  merged.purchasedItems = Array.from(new Set([...cPurchased, ...lPurchased]));

  // Merge Inventory (Power-ups: take max of each powerup count)
  const lInv = localProfile.inventory || {};
  const cInv = cloudProfile.inventory || {};
  merged.inventory = {
    powerup_fifty: Math.max(lInv.powerup_fifty || 0, cInv.powerup_fifty || 0),

    powerup_skip: Math.max(lInv.powerup_skip || 0, cInv.powerup_skip || 0)
  };

  // Merge Stats
  const lStats = localProfile.stats || {};
  const cStats = cloudProfile.stats || {};
  merged.stats = {
    gamesPlayed: Math.max(lStats.gamesPlayed || 0, cStats.gamesPlayed || 0),
    correctAnswers: Math.max(lStats.correctAnswers || 0, cStats.correctAnswers || 0),
    wrongAnswers: Math.max(lStats.wrongAnswers || 0, cStats.wrongAnswers || 0),
    skippedAnswers: Math.max(lStats.skippedAnswers || 0, cStats.skippedAnswers || 0),
    perfectGames: Math.max(lStats.perfectGames || 0, cStats.perfectGames || 0),
    duelWins: Math.max(lStats.duelWins || 0, cStats.duelWins || 0)
  };

  // Union of Custom Rewards, minus deleted ones (CRDT tombstones)
  const lRewards = localProfile.customRewards || [];
  const cRewards = cloudProfile.customRewards || [];
  const lDeleted = localProfile.deletedCustomRewards || [];
  const cDeleted = cloudProfile.deletedCustomRewards || [];
  
  merged.deletedCustomRewards = Array.from(new Set([...lDeleted, ...cDeleted]));
  
  const rewardMap = new Map();
  [...cRewards, ...lRewards].forEach(r => {
    if (!merged.deletedCustomRewards.includes(r.id)) {
      rewardMap.set(r.id, r);
    }
  });
  merged.customRewards = Array.from(rewardMap.values());

  // Union of Unlocked Achievements
  const lAch = localProfile.unlockedAchievements || [];
  const cAch = cloudProfile.unlockedAchievements || [];
  merged.unlockedAchievements = Array.from(new Set([...cAch, ...lAch]));

  return merged;
}

function mergeSubjectsData(localSubjects = {}, cloudSubjects = {}) {
  return { ...cloudSubjects, ...localSubjects };
}

async function checkCloudUpdateTimestamp() {
  try {
    const db = getDB();
    if (!db) return 0;
    const { data: { session } } = await db.auth.getSession();
    if (!session) return 0;
    const { data } = await db.from('profiles').select('updated_at').eq('id', session.user.id).maybeSingle();
    return data ? data.updated_at : 0;
  } catch (e) {
    return 0;
  }
}

async function pushProfileToCloud(username, hashedKey, profile, srsData, subjectsData, pausedSession = null, revisionItems = []) {
  try {
    const db = getDB();
    if (!db) return;
    
    const { data: { session } } = await db.auth.getSession();
    if (!session) return;

    let payload = {
      username: username.toLowerCase(),
      hashed_key: 'supabase_auth_v2',
      profile_data: profile,
      friend_id: profile.friendId,
      srs_data: {
        srs: srsData,
        revisionItems: revisionItems,
        pausedSession: pausedSession
      },
      updated_at: Date.now()
    };

    try {
      const subjectsStr = JSON.stringify(subjectsData || {});
      if (subjectsStr.length < 1024 * 1024 * 10) { 
        payload.subjects_data = subjectsData;
      }
    } catch (e) {}

    // Update local timestamp to prevent our own push from triggering a pull
    try { localStorage.setItem('remix_last_cloud_sync', payload.updated_at.toString()); } catch(e){}

    // Use UPDATE by default to avoid overwriting omitted columns
    const { data, error } = await db.from('profiles').update(payload).eq('id', session.user.id).select('id');

    // If row doesn't exist yet, fallback to INSERT
    if ((!error && (!data || data.length === 0)) || (error && error.code === 'PGRST116')) {
      payload.id = session.user.id;
      await db.from('profiles').insert(payload);
    }
  } catch (e) {
    console.error('Profile cloud push failed:', e.message);
  }
}

async function fetchProfileFromCloud(username, hashedKey, includeSubjects = false) {
  try {
    const db = getDB();
    if (!db) return null;

    const { data: { session } } = await db.auth.getSession();
    if (!session) return null;

    let query = db.from('profiles');
    if (includeSubjects) {
      query = query.select('*');
    } else {
      query = query.select('id, username, hashed_key, profile_data, friend_id, srs_data, updated_at');
    }

    const { data, error } = await query.eq('id', session.user.id).maybeSingle();
      
    if (error) throw error;
    if (data) {
      if (!data.paused_session && data.srs_data?.pausedSession) {
        data.paused_session = data.srs_data.pausedSession;
      }
    }
    return data;
  } catch (e) {
    console.log('Profile cloud fetch failed:', e.message);
    return null;
  }
}

// --- FRIEND SYSTEM ---

async function lookupByFriendId(friendId) {
  try {
    const db = getDB();
    if (!db) return null;
    const { data, error } = await db
      .from('profiles')
      .select('username, friend_id, profile_data')
      .eq('friend_id', friendId.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (e) {
    console.log('Friend lookup failed:', e.message);
    return null;
  }
}

async function saveFriendId(username, hashedKey, friendId) {
  try {
    const db = getDB();
    if (!db) return;

    const { data: { session } } = await db.auth.getSession();
    if (!session) return;

    await db.from('profiles')
      .update({ friend_id: friendId })
      .eq('id', session.user.id);
  } catch (e) {
    console.log('saveFriendId failed:', e.message);
  }
}

async function addFriend(myUsername, friendUsername) {
  try {
    const db = getDB();
    if (!db) return { success: false };
    const { error } = await db.from('friendships').insert({
      requester_username: myUsername.toLowerCase(),
      addressee_username: friendUsername.toLowerCase()
    });
    if (error && error.code !== '23505') throw error; // ignore duplicate
    return { success: true };
  } catch (e) {
    console.log('addFriend failed:', e.message);
    return { success: false, error: e.message };
  }
}

async function getFriends(myUsername) {
  try {
    const db = getDB();
    if (!db) return [];
    const me = myUsername.toLowerCase();
    // Get all friendships where I am requester or addressee
    const { data, error } = await db.from('friendships')
      .select('requester_username, addressee_username')
      .or(`requester_username.eq.${me},addressee_username.eq.${me}`);
    if (error) throw error;
    if (!data || data.length === 0) return [];

    const friendUsernames = data.map(f =>
      f.requester_username === me ? f.addressee_username : f.requester_username
    );

    // Fetch their profile info
    const { data: profiles, error: pErr } = await db.from('profiles')
      .select('username, friend_id, profile_data')
      .in('username', friendUsernames);
    if (pErr) throw pErr;

    return (profiles || []).map(p => {
      const pd = p.profile_data || {};
      return {
        username: p.username,
        friendId: p.friend_id || '???',
        name: pd.name || p.username,
        avatar: pd.avatar || '🎓',
        level: pd.level || 1,
        wins: pd.stats?.duelWins || 0,
        total_duels: pd.stats?.duelsPlayed || 0,
        streak: pd.streakDays || 0,
        badges: pd.selectedBadges || (pd.unlockedAchievements ? pd.unlockedAchievements.slice(0, 3) : [])
      };
    });
  } catch (e) {
    console.log('getFriends failed:', e.message);
    return [];
  }
}

async function removeFriend(myUsername, friendUsername) {
  try {
    const db = getDB();
    if (!db) return;
    const me = myUsername.toLowerCase();
    const friend = friendUsername.toLowerCase();
    await db.from('friendships').delete()
      .or(`and(requester_username.eq.${me},addressee_username.eq.${friend}),and(requester_username.eq.${friend},addressee_username.eq.${me})`);
  } catch (e) {
    console.log('removeFriend failed:', e.message);
  }
}

async function sendFriendNotification(toUsername, fromUsername, fromAvatar, type, payload) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('friend_notifications').insert({
      to_username: toUsername.toLowerCase(),
      from_username: fromUsername.toLowerCase(),
      from_avatar: fromAvatar || '🎓',
      type,
      payload
    });
    if (error) throw error;
    return true;
  } catch (e) {
    console.log('sendFriendNotification failed:', e.message);
    return false;
  }
}

async function getMyNotifications(myUsername) {
  try {
    const db = getDB();
    if (!db) return [];
    const { data, error } = await db.from('friend_notifications')
      .select('*')
      .eq('to_username', myUsername.toLowerCase())
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.log('getMyNotifications failed:', e.message);
    return [];
  }
}

async function markNotificationRead(id) {
  try {
    const db = getDB();
    if (!db) return;
    await db.from('friend_notifications').delete().eq('id', id);
  } catch (e) {
    console.log('markNotificationRead failed:', e.message);
  }
}

// --- COMMUNITY SUBJECTS ---

async function submitCommunitySubject(subjectName, author, category, questionsData) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('community_subjects').insert({
      subject_name: subjectName,
      author: author,
      category: category,
      questions_data: questionsData,
      status: 'pending'
    });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('submitCommunitySubject failed:', e.message);
    return false;
  }
}

async function fetchPendingCommunitySubjects() {
  try {
    const db = getDB();
    if (!db) return [];
    const { data, error } = await db.from('community_subjects')
      .select('id, subject_name, author, category, created_at, status, questions_data')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    // Parse questions_data if it's a JSON string
    return (data || []).map(row => ({
      ...row,
      questions_data: typeof row.questions_data === 'string' ? JSON.parse(row.questions_data) : row.questions_data
    }));
  } catch (e) {
    console.error('fetchPendingCommunitySubjects failed:', e.message);
    return [];
  }
}

async function fetchAcceptedCommunitySubjects() {
  try {
    const db = getDB();
    if (!db) return [];
    const { data, error } = await db.from('community_subjects')
      .select('id, subject_name, author, category, created_at, questions_data')
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    // Parse questions_data if it's a JSON string
    return (data || []).map(row => ({
      ...row,
      questions_data: typeof row.questions_data === 'string' ? JSON.parse(row.questions_data) : row.questions_data
    }));
  } catch (e) {
    console.error('fetchAcceptedCommunitySubjects failed:', e.message);
    return [];
  }
}

async function fetchCommunitySubjectData(subjectId) {
  try {
    const db = getDB();
    if (!db) return null;
    const { data, error } = await db.from('community_subjects')
      .select('questions_data')
      .eq('id', subjectId)
      .single();
    if (error) throw error;
    if (!data) return null;
    
    // Parse questions_data if it's a JSON string
    const questionsData = data.questions_data;
    return typeof questionsData === 'string' ? JSON.parse(questionsData) : questionsData;
  } catch (e) {
    console.error('fetchCommunitySubjectData failed:', e.message);
    return null;
  }
}

async function updateCommunitySubjectStatus(subjectId, status) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('community_subjects')
      .update({ status: status })
      .eq('id', subjectId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('updateCommunitySubjectStatus failed:', e.message);
    return false;
  }
}

async function deleteCommunitySubject(subjectId) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('community_subjects')
      .delete()
      .eq('id', subjectId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('deleteCommunitySubject failed:', e.message);
    return false;
  }
}

async function updateCommunitySubjectCategory(subjectId, category) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('community_subjects')
      .update({ category: category })
      .eq('id', subjectId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('updateCommunitySubjectCategory failed:', e.message);
    return false;
  }
}

// ==========================================
// SUPABASE STORAGE LOGIC
// ==========================================

const _signedUrlCache = new Map();

function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

async function uploadRewardImage(base64Data, username) {
  try {
    const db = getDB();
    if (!db) return null;
    
    const blob = dataURLtoBlob(base64Data);
    
    // Nettoyer le nom d'utilisateur (retirer accents, espaces, etc.) pour Supabase Storage
    const safeUsername = username
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
      
    const fileName = `${safeUsername}_${Date.now()}.webp`;
    
    const { data, error } = await db.storage
      .from('reward_images')
      .upload(fileName, blob, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    return data.path;
  } catch (e) {
    console.error('uploadRewardImage failed:', e.message);
    return null;
  }
}

async function getRewardImageUrl(path) {
  if (!path) return null;
  // Backward compatibility for old base64 images stored in JSON
  if (path.startsWith('data:image')) return path;
  
  if (_signedUrlCache.has(path)) {
    const cached = _signedUrlCache.get(path);
    // Refresh 1 hour before expiry (approx 24h validity)
    if (Date.now() < cached.expiresAt - (60 * 60 * 1000)) {
      return cached.url;
    }
  }

  try {
    const db = getDB();
    if (!db) return null;
    
    // 24 hours validity
    const { data, error } = await db.storage
      .from('reward_images')
      .createSignedUrl(path, 60 * 60 * 24);
      
    if (error) throw error;
    
    _signedUrlCache.set(path, {
      url: data.signedUrl,
      expiresAt: Date.now() + (60 * 60 * 24 * 1000)
    });
    
    return data.signedUrl;
  } catch (e) {
    console.error('getRewardImageUrl failed:', e.message);
    return null;
  }
}


// --- File: js/storage.js ---
// Storage module for persistent user data, custom subjects, SRS spacing (Anki decay intervals), statistics, Real Supabase Cloud Database sync, and Anti-Cheat Checksum auto-purge



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

class StorageManager {
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

  static upsertSubjectWithProgress(subject) {
    const subjects = this.getSubjects();
    let targetSubjectId = null;

    const norm = (s) => (s || '')
      .replace(/\[CSV\]/gi, '')
      .replace(/\.(csv|txt)$/i, '')
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]/g, '') // keep only alphanumeric
      .trim();

    const targetNorm = norm(subject.name);
    const targetFileNorm = norm(subject.originalFileName);

    // Find existing subject by ID, by exact/normalized name, or by original file name if renamed!
    if (subject.id && subjects[subject.id]) {
      targetSubjectId = subject.id;
    } else {
      const existingKey = Object.keys(subjects).find(k => {
        const existingSub = subjects[k];
        if (!existingSub) return false;
        
        // 1. Direct name match
        if (targetNorm && (norm(existingSub.name) === targetNorm || norm(k) === targetNorm)) return true;
        
        // 2. Match by originalFileName (e.g. if the user renamed the deck in the UI)
        if (targetFileNorm && existingSub.originalFileName && norm(existingSub.originalFileName) === targetFileNorm) return true;

        // 3. Match from description (e.g. "Importé depuis chapitre 8.csv")
        if (targetFileNorm && existingSub.description && norm(existingSub.description).includes(targetFileNorm)) return true;

        // 4. Match from subject.name against originalFileName
        if (targetNorm && existingSub.originalFileName && norm(existingSub.originalFileName) === targetNorm) return true;

        return false;
      });
      if (existingKey) {
        targetSubjectId = existingKey;
      }
    }

    if (targetSubjectId && subjects[targetSubjectId]) {
      const existingSub = subjects[targetSubjectId];
      const oldQuestions = existingSub.questions || [];
      
      // Build lookup map of old questions by ID and by index
      const oldById = new Map();
      const oldByQuestion = new Map();
      oldQuestions.forEach((q, idx) => {
        if (q.id) oldById.set(q.id, q);
        if (q.question) oldByQuestion.set(q.question.trim().toLowerCase(), q);
      });

      // Update question list with the new content while mapping IDs to preserve SRS
      const updatedQuestions = (subject.questions || []).map((newQ, idx) => {
        const qKey = newQ.question ? newQ.question.trim().toLowerCase() : '';
        // 1. Try matching by question text
        // 2. Try matching by explicit ID
        // 3. Fallback: match by position index if total count is similar
        const matchedOld = oldByQuestion.get(qKey) || (newQ.id ? oldById.get(newQ.id) : null) || oldQuestions[idx];
        
        const persistentId = (matchedOld && matchedOld.id) ? matchedOld.id : (newQ.id || `q_${Date.now()}_${idx}`);

        return {
          ...newQ,
          id: persistentId
        };
      });

      // Update subject in place preserving custom user name, custom icon, folders/pathParts, and verified flags
      subjects[targetSubjectId] = {
        ...existingSub,
        originalFileName: subject.originalFileName || existingSub.originalFileName || subject.name,
        questions: updatedQuestions
      };
      this.saveSubjects(subjects);
      return { subject: subjects[targetSubjectId], updated: true };
    } else {
      // Create new subject
      subjects[subject.id] = subject;
      this.saveSubjects(subjects);
      return { subject: subjects[subject.id], updated: false };
    }
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

  static dismissCard(cardId, questionText) {
    if (!cardId && !questionText) return;
    const allSRS = this.getSRSData();
    const now = Date.now();
    
    // Set SRS interval to 10 years (3650 days) and 100% mastery so it never reappears in reviews
    if (cardId) {
      allSRS[cardId] = {
        reps: 99,
        intervalDays: 3650,
        easeFactor: 3.0,
        baseMastery: 1.0,
        lastReviewed: now,
        nextDue: now + (3650 * 24 * 60 * 60 * 1000),
        dismissed: true
      };
      try {
        localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(allSRS));
      } catch (e) {}
    }

    if (questionText) {
      this.removeRevisionItem(questionText);
    }
    
    this.autoSyncCloud();
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

    const payload = {
      profile,
      srs: this.getSRSData(),
      subjects: optimizedSubjectsToPush,
      pausedSession: this.getPausedSession(),
      revisionItems: this.getRevisionItems(),
      updatedAt: Date.now()
    };
    
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
    
    // Create an ultra-compact version of the session (no duplicate pools, minimal footprint)
    const compactSession = {
      subjectId: sessionData.subjectId,
      mode: sessionData.mode,
      currentIndex: sessionData.currentIndex || 0,
      score: sessionData.score || 0,
      correctCount: sessionData.correctCount || 0,
      wrongCount: sessionData.wrongCount || 0,
      skippedCount: sessionData.skippedCount || 0,
      sessionTimer: sessionData.sessionTimer || 180,
      streak: sessionData.streak || 0,
      multiplier: sessionData.multiplier || 1,
      powerupDoubleActive: !!sessionData.powerupDoubleActive,
      disabledOptions: sessionData.disabledOptions || [],
      history: sessionData.history || [],
      savedAt: Date.now(),
      // Only keep the remaining/prepared questions array, without extra bloat
      questions: (sessionData.questions || []).map(q => ({
        id: q.id,
        question: q.question,
        options: q.options || [],
        correct: q.correct,
        explanation: q.explanation || '',
        shuffledOptions: q.shuffledOptions || q.options || []
      }))
    };

    try {
      localStorage.setItem(STORAGE_KEYS.PAUSED_SESSION, JSON.stringify(compactSession));
    } catch (e) {
      console.warn('Quota exceeded when saving paused session to localStorage, attempting fallback:', e);
      try {
        // Fallback: try clearing legacy keys if any
        sessionStorage.setItem(STORAGE_KEYS.PAUSED_SESSION, JSON.stringify(compactSession));
      } catch (err) {}
    }
    this.autoSyncCloud();
  }

  static getPausedSession() {
    let data = null;
    try {
      data = localStorage.getItem(STORAGE_KEYS.PAUSED_SESSION);
      if (!data) data = sessionStorage.getItem(STORAGE_KEYS.PAUSED_SESSION);
    } catch (e) {}
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  static clearPausedSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.PAUSED_SESSION);
      sessionStorage.removeItem(STORAGE_KEYS.PAUSED_SESSION);
    } catch (e) {}
    const profile = this.getProfile();
    profile.pausedSessionClearedAt = Date.now();
    this.saveProfile(profile);
    this.autoSyncCloud();
  }

  static resetAllData() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
}


// --- File: js/audio.js ---
// Web Audio API Synthesizer for zero-dependency retro sound effects


class SoundSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  isSoundEnabled() {
    const settings = StorageManager.getSettings();
    return settings.soundEnabled !== false;
  }

  getVolume() {
    const settings = StorageManager.getSettings();
    return settings.volume !== undefined ? settings.volume : 0.7;
  }

  playCorrect() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();

    // Two-tone arpeggio (E5 -> A5 -> C#6)
    [659.25, 880, 1108.73].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.3 * vol, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  }

  playWrong() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

    gain.gain.setValueAtTime(0.4 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  playClick() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.15 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playStreak(count) {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();
    const baseFreq = 440 + Math.min(count * 40, 600);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.2);

    gain.gain.setValueAtTime(0.3 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  playLevelUp() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.35 * vol, now + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.45);
    });
  }

  playAchievement() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();
    const notes = [523.25, 698.46, 880.00, 1046.50]; // C5, F5, A5, C6

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25 * vol, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.35);
    });
  }

  playPurchase() {
    if (!this.isSoundEnabled()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getVolume();

    [987.77, 1318.51].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.3 * vol, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.22);
    });
  }
}

const SoundFX = new SoundSynthesizer();


// --- File: js/csvParser.js ---
// Module for parsing CSV files and Anki export (.txt) with distractor generation & validation

class CSVParser {
  static cleanHTML(text) {
    if (!text) return '';
    let cleaned = text.replace(/&nbsp;/g, ' ')
                      .replace(/<br\s*\/?>/gi, '\n')
                      .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, '')
                      .replace(/\{\{c\d+::(.*?)(?:::.*?)?\}\}/g, '$1')
                      .trim();
    return cleaned;
  }

  static parseMultilineRecords(text) {
    const records = [];
    let currentRecord = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === '\t' || char === ';') && !inQuotes) {
        // add the current field to the current record
        currentRecord.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' && !inQuotes) {
        currentRecord.push(currentField.trim());
        if (currentRecord.length > 0 && !currentRecord[0].startsWith('#')) {
          records.push(currentRecord);
        }
        currentRecord = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }

    if (currentField || currentRecord.length > 0) {
      currentRecord.push(currentField.trim());
      records.push(currentRecord);
    }

    return records;
  }

  static parseQCMOptions(questionText, answerRaw) {
    const qcmPattern = /\(?\s*a\)\s*(.*?)\s+b\)\s*(.*?)\s+c\)\s*(.*?)\s+d\)\s*(.*?)\s*\)?$/i.exec(questionText);

    if (qcmPattern) {
      const optA = 'a) ' + qcmPattern[1].trim();
      const optB = 'b) ' + qcmPattern[2].trim();
      const optC = 'c) ' + qcmPattern[3].trim();
      const optD = 'd) ' + qcmPattern[4].trim();

      const cleanQ = questionText.slice(0, qcmPattern.index).trim();
      const options = [optA, optB, optC, optD];

      const ansClean = this.cleanHTML(answerRaw);
      let correctOpt = null;

      for (const opt of options) {
        const letter = opt[0].toLowerCase();
        if (ansClean.toLowerCase().includes(`${letter})`) || ansClean.toLowerCase().startsWith(letter)) {
          correctOpt = opt;
          break;
        }
      }

      if (!correctOpt) correctOpt = options[0];

      return { question: cleanQ, options, correct: correctOpt, explanation: ansClean };
    }

    return null;
  }

  static parse(text) {
    try {
      if (!text || text.trim() === '') {
        return { success: false, error: 'Fichier vide ou illisible.' };
      }

      const records = this.parseMultilineRecords(text);
      if (records.length === 0) {
        return { success: false, error: 'Aucun enregistrement valide trouvé dans ce fichier.' };
      }

      const isAnkiDeck = records[0].length >= 3 && (records[0][0].includes('::') || records[0][1].includes('::'));

      const questions = [];
      const allAnswers = [];

      for (let idx = 0; idx < records.length; idx++) {
        const r = records[idx];
        let qRaw = '';
        let aRaw = '';
        let lineNo = idx + 1;

        if (isAnkiDeck && r.length >= 4) {
          qRaw = r[2];
          aRaw = r[3];
        } else if (r.length >= 2) {
          qRaw = r[0];
          aRaw = r[1];
        } else {
          continue;
        }

        const qClean = this.cleanHTML(qRaw);
        const aClean = this.cleanHTML(aRaw);

        if (!qClean) {
          return { success: false, error: `❌ Ligne ${lineNo} : La question est manquante ou vide.` };
        }

        if (!aClean) {
          return { success: false, error: `❌ Ligne ${lineNo} : Aucune bonne réponse spécifiée pour la question "${qClean.slice(0, 30)}...".` };
        }

        const qcmRes = this.parseQCMOptions(qClean, aRaw);

        if (qcmRes) {
          if (!qcmRes.correct) {
            return { success: false, error: `❌ Ligne ${lineNo} : Impossible d'identifier la bonne réponse.` };
          }
          questions.push({
            id: `imported_${Date.now()}_${idx}`,
            question: qcmRes.question,
            correct: qcmRes.correct,
            options: qcmRes.options,
            explanation: qcmRes.explanation
          });
        } else {
          let opts = [];
          let explanation = `Réponse : ${aClean}`;
          if (r.length >= 5 && !isAnkiDeck) {
            opts = [aClean, this.cleanHTML(r[2]), this.cleanHTML(r[3]), this.cleanHTML(r[4])];
            if (r.length >= 6) {
              const explicitExpl = this.cleanHTML(r[5]);
              if (explicitExpl) explanation = explicitExpl;
            }
          } else {
            allAnswers.push(aClean);
            opts = [aClean]; // Will generate distractors below
          }

          questions.push({
            id: `imported_${Date.now()}_${idx}`,
            question: qClean,
            correct: aClean,
            options: opts,
            explanation: explanation
          });
        }
      }

      if (questions.length === 0) {
        return { success: false, error: 'Aucune question valide n\'a pu être extraite.' };
      }

      // Generate distractors for 2-column cards if needed
      const uniqueAnswers = Array.from(new Set(allAnswers));
      questions.forEach((q, idx) => {
        if (q.options.length < 2) {
          const correct = q.correct;
          const others = uniqueAnswers.filter(a => a !== correct);
          const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);

          let counter = 1;
          while (distractors.length < 3) {
            const dummy = `Option alternative ${counter}`;
            if (!distractors.includes(dummy) && dummy !== correct) {
              distractors.push(dummy);
            }
            counter++;
          }
          q.options = [correct, distractors[0], distractors[1], distractors[2]].sort(() => Math.random() - 0.5);
        }
      });

      return {
        success: true,
        count: questions.length,
        isAnkiDeck,
        questions
      };
    } catch (e) {
      return { success: false, error: `Erreur d'analyse : ${e.message}` };
    }
  }
}


// --- File: js/gamification.js ---
// Gamification module: XP, Levels, Coins, Shop, Achievements, and Power-ups




const ACHIEVEMENTS = [
  // Progression de Base
  { id: 'ach_first', title: '🎓 Premiers Pas', desc: 'Compléter votre première session de révision.', icon: '🎯' },
  { id: 'ach_perfect', title: '🌟 Sans Faute', desc: 'Obtenir 100% de réponses correctes sur une session.', icon: '🏆' },
  { id: 'ach_perfect_5', title: '💫 Perfectionniste', desc: 'Réaliser 5 sessions parfaites à 100%.', icon: '✨' },
  
  // Combos & Streaks
  { id: 'ach_streak_5', title: '🔥 Sur une Lance', desc: 'Atteindre un combo de 5 bonnes réponses d\'affilée.', icon: '⚡' },
  { id: 'ach_streak_10', title: '⚡ Inarrêtable', desc: 'Atteindre un combo de 10 bonnes réponses d\'affilée.', icon: '🚀' },
  { id: 'ach_streak_20', title: '☄️ Météore', desc: 'Atteindre un combo de 20 bonnes réponses d\'affilée.', icon: '💥' },

  // Niveaux & XP
  { id: 'ach_level_5', title: '🧠 Savant Fou', desc: 'Atteindre le niveau 5.', icon: '👑' },
  { id: 'ach_level_10', title: '🏛️ Grand Maître', desc: 'Atteindre le niveau 10.', icon: '⚜️' },
  { id: 'ach_level_20', title: '🌌 Omniscient', desc: 'Atteindre le niveau 20.', icon: '👁️' },

  // Économie & Boutique
  { id: 'ach_coins_500', title: '💰 Chasseur de Pièces', desc: 'Accumuler un total de 500 pièces.', icon: '🪙' },
  { id: 'ach_coins_2000', title: '🏦 Banquier', desc: 'Accumuler un total de 2000 pièces.', icon: '💵' },
  { id: 'ach_coins_5000', title: '💎 Millionnaire', desc: 'Accumuler un total de 5000 pièces.', icon: '👑' },
  { id: 'ach_shop_buy', title: '🛍️ Client VIP', desc: 'Acheter un élément dans la boutique.', icon: '💎' },
  { id: 'ach_custom_reward', title: '🎁 Auto-Récompense', desc: 'Créer une récompense personnalisée dans la boutique.', icon: '🎉' },

  // Cartes & Exercices
  { id: 'ach_correct_50', title: '📖 Studieux', desc: 'Répondre correctement à 50 questions.', icon: '✏️' },
  { id: 'ach_correct_200', title: '📚 Encyclopédie', desc: 'Répondre correctement à 200 questions.', icon: '📖' },
  { id: 'ach_correct_500', title: '🎓 Sommité du Savoir', desc: 'Répondre correctement à 500 questions.', icon: '🧠' },
  { id: 'ach_custom_subject', title: '📝 Professeur', desc: 'Importer ou posséder un cours personnalisé via CSV.', icon: '📚' },
  { id: 'ach_srs_master', title: '🔁 Maître de la Répétition', desc: 'Maîtriser au moins 20 cartes en répétition espacée (SRS).', icon: '🔄' },

  // Duels Multijoueur
  { id: 'ach_duel_first', title: '⚔️ Gladiateur', desc: 'Participer à votre premier duel 1v1.', icon: '🛡️' },
  { id: 'ach_duel_win', title: '🥇 Champion d\'Arène', desc: 'Remporter votre premier duel multijoueur.', icon: '🏆' },
  { id: 'ach_duel_wins_5', title: '👑 Invaincu', desc: 'Remporter 5 duels multijoueur.', icon: '🎖️' },

  // Compte & Social
  { id: 'ach_cloud_connected', title: '☁️ Synchronisé', desc: 'Associer un compte Cloud à votre profil.', icon: '🌐' }
];
const EXCLUSIVE_EMOJIS = [
  { id: 'emoji_time_1', emoji: '📅', label: 'Calendrier' },
  { id: 'emoji_time_2', emoji: '⏳', label: 'Sablier' },
  { id: 'emoji_time_3', emoji: '⏰', label: 'Réveil' },
  { id: 'emoji_time_4', emoji: '🌙', label: 'Lune' },
  { id: 'emoji_time_5', emoji: '☀️', label: 'Soleil' },
  { id: 'emoji_time_6', emoji: '🕰️', label: 'Horloge' },
  { id: 'emoji_time_7', emoji: '🗓️', label: 'Éphéméride' }
];

const SHOP_ITEMS = [
  // Power-ups
  { id: 'powerup_fifty', type: 'powerup', title: '50 / 50', desc: 'Élimine 2 mauvaises réponses', cost: 40, icon: '✂️' },
  { id: 'powerup_skip', type: 'powerup', title: 'Joker (Passer)', desc: 'Passe la question sans perdre de streak', cost: 60, icon: '⏭️' },

  // Themes
  { id: 'theme-cyberpunk', type: 'theme', title: 'Cyberpunk Neon', desc: 'Style sombre néon violet et cyan', cost: 0, icon: '🌆' },
  { id: 'theme-midnight', type: 'theme', title: 'Midnight Synthwave', desc: 'Ambiance rétro-futuriste bleu profond', cost: 500, icon: '🌃' },
  { id: 'theme-emerald', type: 'theme', title: 'Emerald Forest', desc: 'Design apaisant vert émeraude et or', cost: 800, icon: '🌲' },
  { id: 'theme-solar', type: 'theme', title: 'Solar Flare', desc: 'Mode chaud orange et ambre dynamisant', cost: 1000, icon: '☀️' },
  { id: 'theme-dracula', type: 'theme', title: 'Vampire Blood', desc: 'Rouge sang et noir profond', cost: 1500, icon: '🧛' },
  { id: 'theme-ocean', type: 'theme', title: 'Ocean Abyss', desc: 'Bleu aquatique relaxant', cost: 1800, icon: '🌊' },
  { id: 'theme-royal', type: 'theme', title: 'Royal Gold', desc: 'Prestige et dorures', cost: 2500, icon: '👑' },
  { id: 'theme-matrix', type: 'theme', title: 'The Matrix', desc: 'Hacker vert fluorescent', cost: 3000, icon: '💻' },
  { id: 'theme-sakura', type: 'theme', title: 'Cherry Blossom', desc: 'Doux rose pastel printanier', cost: 4000, icon: '🌸' },
  { id: 'theme-arctic', type: 'theme', title: 'Arctic Glacier', desc: 'Bleu glacial et blanc pur', cost: 4500, icon: '🧊' },
  { id: 'theme-lava', type: 'theme', title: 'Volcanic Lava', desc: 'Magma bouillonnant rouge intense', cost: 5000, icon: '🌋' },
  { id: 'theme-synthwave', type: 'theme', title: 'Outrun 80s', desc: 'Magenta et orange rétro', cost: 6000, icon: '📼' },
  { id: 'theme-cotton-candy', type: 'theme', title: 'Cotton Candy', desc: 'Rose et bleu ciel sucré', cost: 7000, icon: '🍭' },
  { id: 'theme-abyss', type: 'theme', title: 'Void Abyss', desc: "Le noir absolu de l'espace", cost: 10000, icon: '🌌' },

  // Avatars
  { id: 'avatar-student', type: 'avatar', title: 'Étudiant Assidu', desc: 'Avatar classique de révision', cost: 0, icon: '🎓' },
  { id: 'avatar-wizard', type: 'avatar', title: 'Mage du Savoir', desc: 'Avatar magique', cost: 300, icon: '🧙‍♂️' },
  { id: 'avatar-robot', type: 'avatar', title: 'IA Réductrice', desc: 'Avatar futuriste', cost: 400, icon: '🤖' },
  { id: 'avatar-ninja', type: 'avatar', title: 'Ninja de la Thermo', desc: 'Rapide et précis', cost: 500, icon: '🥷' },
  { id: 'avatar-king', type: 'avatar', title: 'Roi des Examens', desc: 'Couronne de la réussite', cost: 800, icon: '👑' },
  { id: 'avatar-alien', type: 'avatar', title: 'Cerveau Galactique', desc: "Venu d'ailleurs", cost: 1200, icon: '👽' },
  { id: 'avatar-knight', type: 'avatar', title: 'Chevalier Noir', desc: 'Armure impénétrable', cost: 1500, icon: '🛡️' },
  { id: 'avatar-dragon', type: 'avatar', title: 'Dragon', desc: 'Force mythologique', cost: 2000, icon: '🐉' },
  { id: 'avatar-astronaut', type: 'avatar', title: 'Astronaute', desc: 'Au-delà des étoiles', cost: 2500, icon: '👨‍🚀' },
  { id: 'avatar-devil', type: 'avatar', title: 'Démon du QCM', desc: 'Infernal', cost: 3000, icon: '😈' },
  { id: 'avatar-hacker', type: 'avatar', title: 'Anonymous Hacker', desc: 'Pirate des serveurs', cost: 3500, icon: '💻' },
  { id: 'avatar-samurai', type: 'avatar', title: 'Samurai', desc: 'Discipline de fer', cost: 4000, icon: '⛩️' },
  { id: 'avatar-superhero', type: 'avatar', title: 'Super-Héros', desc: 'Sauveur des notes', cost: 4500, icon: '🦸‍♂️' },
  { id: 'avatar-ghost', type: 'avatar', title: 'Fantôme', desc: 'Invisible pendant le contrôle', cost: 5000, icon: '👻' },
  { id: 'avatar-einstein', type: 'avatar', title: 'Einstein', desc: 'Génie absolu', cost: 7500, icon: '🧠' },
  { id: 'avatar-god', type: 'avatar', title: 'Dieu de la Révision', desc: "L'omniscience pure", cost: 10000, icon: '👁️' },

  // Emojis de Duel
  { id: 'emoji-fire', type: 'emoji', title: 'Enflammé', desc: 'Emoji de duel', cost: 0, icon: '🔥' },
  { id: 'emoji-brain', type: 'emoji', title: 'Cerveau', desc: 'Emoji de duel', cost: 0, icon: '🧠' },
  { id: 'emoji-laugh', type: 'emoji', title: 'Rire', desc: 'Emoji de duel', cost: 0, icon: '😂' },
  { id: 'emoji-cool', type: 'emoji', title: 'Cool', desc: 'Emoji de duel', cost: 0, icon: '😎' },
  { id: 'emoji-rocket', type: 'emoji', title: 'Fusée', desc: 'Emoji de duel', cost: 100, icon: '🚀' },
  { id: 'emoji-lightning', type: 'emoji', title: 'Éclair', desc: 'Emoji de duel', cost: 150, icon: '⚡' },
  { id: 'emoji-thinking', type: 'emoji', title: 'Réflexion', desc: 'Emoji de duel', cost: 200, icon: '🤔' },
  { id: 'emoji-exploding', type: 'emoji', title: 'Mind Blown', desc: 'Emoji de duel', cost: 250, icon: '🤯' },
  { id: 'emoji-party', type: 'emoji', title: 'Fête', desc: 'Emoji de duel', cost: 300, icon: '🎉' },
  { id: 'emoji-trophy', type: 'emoji', title: 'Trophée', desc: 'Emoji de duel', cost: 400, icon: '🏆' },
  { id: 'emoji-clown', type: 'emoji', title: 'Clown', desc: 'Emoji de duel', cost: 450, icon: '🤡' },
  { id: 'emoji-skull', type: 'emoji', title: 'Skull', desc: 'Emoji de duel', cost: 500, icon: '💀' },
  { id: 'emoji-nerd', type: 'emoji', title: 'Nerd', desc: 'Emoji de duel', cost: 600, icon: '🤓' },
  { id: 'emoji-sweat', type: 'emoji', title: 'Sueur', desc: 'Emoji de duel', cost: 700, icon: '😅' },
  { id: 'emoji-muscle', type: 'emoji', title: 'Muscle', desc: 'Emoji de duel', cost: 800, icon: '💪' },
  { id: 'emoji-sleeping', type: 'emoji', title: 'Zzz', desc: 'Emoji de duel', cost: 900, icon: '😴' },
  { id: 'emoji-money', type: 'emoji', title: 'Argent', desc: 'Emoji de duel', cost: 1000, icon: '💸' },
  { id: 'emoji-angry', type: 'emoji', title: 'Énervé', desc: 'Emoji de duel', cost: 1200, icon: '😡' },
  { id: 'emoji-poop', type: 'emoji', title: 'Caca', desc: 'Emoji de duel', cost: 1500, icon: '💩' },
  { id: 'emoji-salute', type: 'emoji', title: 'Respect', desc: 'Emoji de duel', cost: 1800, icon: '🫡' },
  { id: 'emoji-eyes', type: 'emoji', title: 'Yeux', desc: 'Emoji de duel', cost: 2000, icon: '👀' },
  { id: 'emoji-heart', type: 'emoji', title: 'Coeur', desc: 'Emoji de duel', cost: 2500, icon: '❤️' },
  { id: 'emoji-crown', type: 'emoji', title: 'Couronne', desc: 'Emoji de duel', cost: 3000, icon: '👑' },
  { id: 'emoji-100', type: 'emoji', title: '100%', desc: 'Emoji de duel', cost: 4000, icon: '💯' },
  { id: 'emoji-bomb', type: 'emoji', title: 'Bombe', desc: 'Emoji de duel', cost: 5000, icon: '💣' }
];

class GamificationEngine {
  static getLevelTitle(level) {
    if (level < 2) return 'Novice de Révision';
    if (level < 4) return 'Apprenti Assidu';
    if (level < 7) return 'Stratège du Savoir';
    if (level < 10) return 'Expert Académique';
    return 'Légende des Examens 👑';
  }

  static getRequiredXP(level) {
    return level * 120;
  }

  static calculatePoints(isCorrect, streak, powerupActive = false) {
    if (isCorrect === false) return -5;
    if (isCorrect === null || isCorrect === undefined) return 0;
    let base = 10;
    let multiplier = 1;
    if (streak >= 10) multiplier = 3;
    else if (streak >= 6) multiplier = 2;
    else if (streak >= 3) multiplier = 1.5;

    if (powerupActive) multiplier *= 2;

    return Math.round(base * multiplier);
  }

  static addReward(profile, points, xpEarned, coinsEarned) {
    profile.totalCoinsEarned = (profile.totalCoinsEarned ?? profile.coins ?? 50) + coinsEarned;
    profile.totalCoinsSpent = profile.totalCoinsSpent ?? 0;
    profile.coins = Math.max(0, profile.totalCoinsEarned - profile.totalCoinsSpent);
    profile.xp += xpEarned;

    let reqXP = this.getRequiredXP(profile.level);
    let leveledUp = false;

    while (profile.xp >= reqXP) {
      profile.xp -= reqXP;
      profile.level += 1;
      profile.totalCoinsEarned += 50;
      profile.coins = Math.max(0, profile.totalCoinsEarned - profile.totalCoinsSpent);
      reqXP = this.getRequiredXP(profile.level);
      leveledUp = true;
    }

    if (leveledUp) {
      SoundFX.playLevelUp();
    }

    StorageManager.saveProfile(profile);
    return { profile, leveledUp };
  }

  static updateStreak(profile, isCorrect) {
    if (isCorrect) {
      profile.streak += 1;
      if (profile.streak > (profile.maxStreak || 0)) {
        profile.maxStreak = profile.streak;
      }
      SoundFX.playStreak(profile.streak);
    } else {
      profile.streak = 0;
    }
    StorageManager.saveProfile(profile);
    return profile.streak;
  }

  static checkAchievements(profile) {
    const newlyUnlocked = [];
    const stats = profile.stats || {};
    
    // Check custom subject condition (Professeur)
    let hasCustomSubject = false;
    try {
      const subjects = StorageManager.getSubjects();
      hasCustomSubject = Object.values(subjects).some(s => 
        !s.deleted && (
          s.originalFileName || 
          s.id.startsWith('sub_') || 
          s.id.startsWith('custom_') || 
          (s.description && s.description.toLowerCase().includes('importé'))
        )
      );
    } catch (e) {}

    // Check SRS mastered cards count
    let srsMasteredCount = 0;
    try {
      const srsData = StorageManager.getSRSData();
      srsMasteredCount = Object.values(srsData).filter(card => 
        (card.reps || 0) >= 3 || 
        (card.intervalDays || 0) >= 3 || 
        (card.interval || 0) >= 3 || 
        (card.repetitions || 0) >= 3 ||
        (card.baseMastery || 0) >= 0.7
      ).length;
    } catch (e) {}

    ACHIEVEMENTS.forEach(ach => {
      if (profile.unlockedAchievements.includes(ach.id)) return;

      let conditionMet = false;
      // Progression & Perfection
      if (ach.id === 'ach_first' && (stats.gamesPlayed || 0) >= 1) conditionMet = true;
      if (ach.id === 'ach_perfect' && (stats.perfectGames || 0) >= 1) conditionMet = true;
      if (ach.id === 'ach_perfect_5' && (stats.perfectGames || 0) >= 5) conditionMet = true;

      // Streaks
      if (ach.id === 'ach_streak_5' && (profile.maxStreak || 0) >= 5) conditionMet = true;
      if (ach.id === 'ach_streak_10' && (profile.maxStreak || 0) >= 10) conditionMet = true;
      if (ach.id === 'ach_streak_20' && (profile.maxStreak || 0) >= 20) conditionMet = true;

      // Levels
      if (ach.id === 'ach_level_5' && (profile.level || 1) >= 5) conditionMet = true;
      if (ach.id === 'ach_level_10' && (profile.level || 1) >= 10) conditionMet = true;
      if (ach.id === 'ach_level_20' && (profile.level || 1) >= 20) conditionMet = true;

      // Coins & Shop
      if (ach.id === 'ach_coins_500' && (profile.totalCoinsEarned || profile.coins || 0) >= 500) conditionMet = true;
      if (ach.id === 'ach_coins_2000' && (profile.totalCoinsEarned || profile.coins || 0) >= 2000) conditionMet = true;
      if (ach.id === 'ach_coins_5000' && (profile.totalCoinsEarned || profile.coins || 0) >= 5000) conditionMet = true;
      if (ach.id === 'ach_shop_buy' && (profile.purchasedItems || []).length > 2) conditionMet = true;
      if (ach.id === 'ach_custom_reward' && (profile.customRewards || []).length >= 1) conditionMet = true;

      // Questions & Learning
      if (ach.id === 'ach_correct_50' && (stats.correctAnswers || 0) >= 50) conditionMet = true;
      if (ach.id === 'ach_correct_200' && (stats.correctAnswers || 0) >= 200) conditionMet = true;
      if (ach.id === 'ach_correct_500' && (stats.correctAnswers || 0) >= 500) conditionMet = true;
      if (ach.id === 'ach_custom_subject' && hasCustomSubject) conditionMet = true;
      if (ach.id === 'ach_srs_master' && srsMasteredCount >= 20) conditionMet = true;

      // Duels
      if (ach.id === 'ach_duel_first' && ((stats.duelPlayed || 0) >= 1 || (stats.duelsPlayed || 0) >= 1)) conditionMet = true;
      if (ach.id === 'ach_duel_win' && (stats.duelWins || 0) >= 1) conditionMet = true;
      if (ach.id === 'ach_duel_wins_5' && (stats.duelWins || 0) >= 5) conditionMet = true;

      // Cloud
      if (ach.id === 'ach_cloud_connected' && !!(profile.cloudAccount && profile.cloudAccount.username)) conditionMet = true;

      if (conditionMet) {
        profile.unlockedAchievements.push(ach.id);
        newlyUnlocked.push(ach);
      }
    });

    if (newlyUnlocked.length > 0) {
      SoundFX.playAchievement();
      StorageManager.saveProfile(profile);
    }

    return newlyUnlocked;
  }

  static buyItem(profile, itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, message: 'Article introuvable.' };

    if (profile.purchasedItems.includes(itemId) && (item.type === 'theme' || item.type === 'avatar' || item.type === 'emoji')) {
      if (item.type === 'theme') {
        profile.theme = itemId;
        StorageManager.saveProfile(profile);
        return { success: true, message: `Thème "${item.title}" équipé !` };
      } else if (item.type === 'avatar') {
        profile.avatar = item.icon;
        StorageManager.saveProfile(profile);
        return { success: true, message: `Avatar "${item.title}" équipé !` };
      } else if (item.type === 'emoji') {
        return { success: false, message: 'Cet emoji est déjà débloqué.' };
      }
    }

    if (profile.coins < item.cost) {
      return { success: false, message: 'Pièces insuffisantes !' };
    }

    profile.totalCoinsSpent = (profile.totalCoinsSpent ?? 0) + item.cost;
    profile.totalCoinsEarned = profile.totalCoinsEarned ?? (profile.coins + profile.totalCoinsSpent);
    profile.coins = Math.max(0, profile.totalCoinsEarned - profile.totalCoinsSpent);
    SoundFX.playPurchase();

    if (item.type === 'theme') {
      if (!profile.purchasedItems.includes(itemId)) profile.purchasedItems.push(itemId);
      profile.theme = itemId;
    } else if (item.type === 'avatar') {
      if (!profile.purchasedItems.includes(itemId)) profile.purchasedItems.push(itemId);
      profile.avatar = item.icon;
    } else if (item.type === 'emoji') {
      if (!profile.purchasedItems.includes(itemId)) profile.purchasedItems.push(itemId);
    } else if (item.type === 'powerup') {
      profile.inventory[itemId] = (profile.inventory[itemId] || 0) + 1;
    }

    StorageManager.saveProfile(profile);
    this.checkAchievements(profile);
    return { success: true, message: `Achat et équipement de "${item.title}" réussis !` };
  }

  static redeemCustomReward(profile, rewardId) {
    const reward = profile.customRewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, message: 'Récompense introuvable.' };

    if (profile.coins < reward.cost) {
      return { success: false, message: 'Pas assez de pièces pour débloquer cette vraie récompense !' };
    }

    profile.totalCoinsSpent = (profile.totalCoinsSpent ?? 0) + reward.cost;
    profile.totalCoinsEarned = profile.totalCoinsEarned ?? (profile.coins + profile.totalCoinsSpent);
    profile.coins = Math.max(0, profile.totalCoinsEarned - profile.totalCoinsSpent);
    reward.redeemedCount = (reward.redeemedCount || 0) + 1;
    SoundFX.playPurchase();

    StorageManager.saveProfile(profile);
    return { success: true, message: `Félicitations ! Vous avez débloqué : ${reward.title} 🎉` };
  }

  static async checkDailyLogin(profile) {
    if (!profile.cloudAccount) return null; // Require cloud account
    
    let today = null;
    
    // Attempt to get server date
    if (window.supabase) {
      try {
        today = await fetchServerDate();
      } catch (e) {
        console.warn("Could not fetch server date", e);
      }
    }

    if (!today) {
      console.warn("Using offline date fallback.");
      today = new Date().toISOString().split('T')[0];
    }

    if (profile.lastLoginDate !== today) {
      // Only allow streak progression if the clock went FORWARD. 
      // (This doesn't fully block time travel forwards, but blocks backward jumps).
      // Full security is achieved when online (today comes from server).
      if (profile.lastLoginDate) {
        const lastDate = new Date(profile.lastLoginDate);
        const currentDate = new Date(today);
        const diffTime = currentDate - lastDate;
        
        if (diffTime < 0) {
          // Time traveled backward! Abort to prevent streak breaking or duplicate quests.
          return;
        }

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          profile.streakDays = (profile.streakDays || 0) + 1;
        } else if (diffDays > 1) {
          profile.streakDays = 1; // Streak broken
        } else if (diffDays === 0) {
           return null; // Already checked today
        }
      } else {
        profile.streakDays = 1;
      }
      
      const loginReward = this.getDailyLoginReward(profile);
      profile.lastLoginDate = today;
      profile.dailyQuests = this.generateDailyQuests();
      StorageManager.saveProfile(profile);
      return loginReward;
    }
    return null;
  }

  static getDailyLoginReward(profile) {
    const day = ((profile.streakDays - 1) % 7) + 1;
    let rewardText = '';
    
    // Ensure nested objects exist
    if (!profile.inventory) profile.inventory = {};
    if (!profile.purchasedItems) profile.purchasedItems = [];
    
    if (day === 1) {
      profile.totalCoinsEarned = (profile.totalCoinsEarned || profile.coins) + 20;
      profile.coins += 20;
      rewardText = '+20 Pièces 🪙';
    } else if (day === 2) {
      profile.inventory.powerup_fifty = (profile.inventory.powerup_fifty || 0) + 1;
      rewardText = '+1 Jocker 50/50 ⚖️';
    } else if (day === 3) {
      profile.xp = (profile.xp || 0) + 20;
      rewardText = '+20 XP 🌟';
    } else if (day === 4) {
      profile.inventory.powerup_skip = (profile.inventory.powerup_skip || 0) + 1;
      rewardText = '+1 Passe-question ⏭️';
    } else if (day === 5) {
      profile.totalCoinsEarned = (profile.totalCoinsEarned || profile.coins) + 100;
      profile.coins += 100;
      rewardText = '+100 Pièces 🪙';
    } else if (day === 6) {
      profile.inventory.powerup_fifty = (profile.inventory.powerup_fifty || 0) + 2;
      profile.inventory.powerup_skip = (profile.inventory.powerup_skip || 0) + 1;
      rewardText = '+2 Jockers 50/50 ⚖️ et +1 Passe ⏭️';
    } else if (day === 7) {
      // Find first not owned
      const toUnlock = EXCLUSIVE_EMOJIS.find(e => !profile.purchasedItems.includes(e.id));
      if (toUnlock) {
        profile.purchasedItems.push(toUnlock.id);
        rewardText = `Emoji exclusif: ${toUnlock.emoji} (${toUnlock.label})`;
      } else {
        // Fallback if all unlocked
        profile.totalCoinsEarned = (profile.totalCoinsEarned || profile.coins) + 200;
        profile.coins += 200;
        rewardText = '+200 Pièces 🪙 (Tous les emojis débloqués !)';
      }
    }

    return { day, rewardText, streak: profile.streakDays };
  }

  static generateDailyQuests() {
    const quests = [
      { id: 'q_duels', type: 'duels', target: 3, progress: 0, title: 'Jouer 3 duels', reward: 50 },
      { id: 'q_perfect', type: 'perfect', target: 1, progress: 0, title: 'Obtenir 100% à un quiz', reward: 100 },
      { id: 'q_sessions', type: 'sessions', target: 2, progress: 0, title: 'Terminer 2 sessions de révision', reward: 50 },
      { id: 'q_win', type: 'duel_win', target: 1, progress: 0, title: 'Gagner un duel', reward: 100 }
    ];
    // Randomly pick 3 quests
    return quests.sort(() => 0.5 - Math.random()).slice(0, 3).map(q => ({ ...q, completed: false }));
  }

  static updateDailyQuests(profile, type, amount = 1) {
    if (!profile.dailyQuests) return;
    let updated = false;
    profile.dailyQuests.forEach(q => {
      if (!q.completed && q.type === type) {
        q.progress += amount;
        if (q.progress >= q.target) {
          q.progress = q.target;
          q.completed = true;
          this.addReward(profile, 0, 0, q.reward);
          SoundFX.playAchievement();
        }
        updated = true;
      }
    });
    if (updated) {
      StorageManager.saveProfile(profile);
    }
  }
}


// --- File: js/quizEngine.js ---
// Quiz Engine module managing game modes, question shuffling, timers, and powerups




class QuizEngine {
  constructor() {
    this.currentSession = null;
    this.timerInterval = null;
  }

  startSession({ subjectId, questions, mode = 'classic', sessionTimerSeconds = 180 }) {
    if (!questions || questions.length === 0) {
      throw new Error('Aucune question disponible pour ce sujet.');
    }

    let finalQuestions;

    if (mode === 'duel') {
      finalQuestions = [...questions];
    } else {
      const allSRS = StorageManager.getSRSData();
      const now = Date.now();

      let sortedQuestions = [...questions].sort((a, b) => {
        const srsA = allSRS[a.id];
        const srsB = allSRS[b.id];
        const dueA = srsA ? (srsA.nextDue <= now ? 0 : 1) : 0;
        const dueB = srsB ? (srsB.nextDue <= now ? 0 : 1) : 0;
        if (dueA !== dueB) return dueA - dueB;
        const mA = srsA ? srsA.mastery : -1;
        const mB = srsB ? srsB.mastery : -1;
        return mA - mB;
      });

      finalQuestions = sortedQuestions;
    }

    const prepared = finalQuestions.map(q => this.prepareQuestion(q));

    this.currentSession = {
      subjectId: subjectId,
      mode: mode,
      questions: prepared,
      currentIndex: 0,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      skippedCount: 0,
      sessionTimer: sessionTimerSeconds || 180,
      streak: 0,
      multiplier: 1,
      powerupDoubleActive: false,
      disabledOptions: [],
      history: []
    };

    return this.getCurrentQuestion();
  }

  prepareQuestion(questionObj) {
    if (!questionObj) return null;
    const rawOptions = questionObj.options || questionObj.shuffledOptions || [];
    const options = Array.isArray(rawOptions) ? [...rawOptions] : [];
    const shuffled = options.length > 0 ? options.sort(() => Math.random() - 0.5) : [questionObj.correct || ''];

    return {
      id: questionObj.id || Math.random().toString(36).substring(2, 9),
      question: questionObj.question,
      options: options,
      correct: questionObj.correct,
      explanation: questionObj.explanation || '',
      shuffledOptions: shuffled
    };
  }

  getCurrentQuestion() {
    if (!this.currentSession) return null;

    // Loop/extend pool if questions run low before 3-minute timer ends
    if (this.currentSession.currentIndex >= this.currentSession.questions.length) {
      if (this.currentSession.mode !== 'revision') {
        const subjects = StorageManager.getSubjects();
        const pool = subjects[this.currentSession.subjectId]?.questions || [];
        if (pool.length > 0) {
          const extra = [...pool].sort(() => Math.random() - 0.5).map(q => this.prepareQuestion(q));
          this.currentSession.questions.push(...extra);
        } else {
          return null;
        }
      } else {
        return null; // End of revision items
      }
    }

    return {
      ...this.currentSession.questions[this.currentSession.currentIndex],
      currentIndex: this.currentSession.currentIndex,
      totalQuestions: this.currentSession.questions.length,
      disabledOptions: this.currentSession.disabledOptions
    };
  }

  submitAnswer(selectedOption) {
    if (!this.currentSession) return null;

    const currentQ = this.currentSession.questions[this.currentSession.currentIndex];
    const isCorrect = selectedOption === currentQ.correct;

    const profile = StorageManager.getProfile();

    // Update SRS Spaced Repetition Data
    StorageManager.updateCardSRS(currentQ.id, isCorrect);

    if (isCorrect) {
      this.currentSession.correctCount += 1;
      this.currentSession.streak += 1;
      
      if (this.currentSession.mode !== 'revision') {
        const points = GamificationEngine.calculatePoints(
          true,
          this.currentSession.streak,
          this.currentSession.powerupDoubleActive
        );
        this.currentSession.score += points;
      }
      SoundFX.playCorrect();

      if (this.currentSession.mode === 'revision') {
        StorageManager.removeRevisionItem(currentQ.question);
      }
    } else {
      this.currentSession.wrongCount += 1;
      this.currentSession.streak = 0;
      const points = GamificationEngine.calculatePoints(false, 0);
      this.currentSession.score = Math.max(0, this.currentSession.score + points);

      SoundFX.playWrong();

      // Re-queue card 20 questions later in current session
      const requeueQ = this.prepareQuestion(currentQ);
      const targetPos = Math.min(this.currentSession.questions.length, this.currentSession.currentIndex + 21);
      this.currentSession.questions.splice(targetPos, 0, requeueQ);

      StorageManager.addRevisionItem(currentQ, this.currentSession.subjectId);
    }

    GamificationEngine.updateStreak(profile, isCorrect);

    this.currentSession.history.push({
      question: currentQ.question,
      selected: selectedOption,
      correct: currentQ.correct,
      isCorrect: isCorrect,
      explanation: currentQ.explanation
    });

    if (this.currentSession.mode === 'timeAttack' && this.currentSession.globalTimer !== null) {
      if (isCorrect) this.currentSession.globalTimer += 3;
      else this.currentSession.globalTimer = Math.max(0, this.currentSession.globalTimer - 5);
    }

    this.currentSession.powerupDoubleActive = false;
    this.currentSession.disabledOptions = [];

    this.currentSession.currentIndex += 1;
    const nextQ = this.getCurrentQuestion();

    if (!nextQ) {
      return {
        isFinished: true,
        nextQuestion: null,
        wasCorrect: isCorrect,
        correctAnswer: currentQ.correct,
        explanation: currentQ.explanation || '',
        summary: this.finishSession()
      };
    }

    return {
      isFinished: false,
      nextQuestion: nextQ,
      wasCorrect: isCorrect,
      correctAnswer: currentQ.correct,
      explanation: currentQ.explanation || ''
    };
  }

  usePowerup(powerupType) {
    if (!this.currentSession) return { success: false, message: 'Partie non active.' };

    const profile = StorageManager.getProfile();
    const count = profile.inventory[powerupType] || 0;

    if (count <= 0) {
      return { success: false, message: 'Vous ne possédez pas ce power-up ! Allez dans la boutique.' };
    }

    const currentQ = this.currentSession.questions[this.currentSession.currentIndex];

    if (powerupType === 'powerup_fifty') {
      const wrongOpts = currentQ.shuffledOptions.filter(opt => opt !== currentQ.correct);
      const toRemove = wrongOpts.sort(() => Math.random() - 0.5).slice(0, 2);
      this.currentSession.disabledOptions = toRemove;

    } else if (powerupType === 'powerup_double') {
      this.currentSession.powerupDoubleActive = true;
    } else if (powerupType === 'powerup_skip') {
      this.currentSession.skippedCount += 1;
      this.currentSession.currentIndex += 1;
      this.currentSession.disabledOptions = [];
      this.currentSession.powerupDoubleActive = false;
    }

    profile.inventory[powerupType] -= 1;
    StorageManager.saveProfile(profile);

    return {
      success: true,
      message: 'Power-up activé !',
      nextQuestion: this.getCurrentQuestion()
    };
  }

  resumeSession(pausedState) {
    if (!pausedState) return null;

    this.currentSession = {
      ...pausedState
    };

    return this.getCurrentQuestion();
  }

  finishSession() {
    if (!this.currentSession) return null;

    clearInterval(this.timerInterval);
    StorageManager.clearPausedSession();

    const correct = this.currentSession.correctCount;
    const totalAnswered = correct + this.currentSession.wrongCount + this.currentSession.skippedCount;
    const accuracy = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;

    let xpEarned = Math.max(0, Math.floor(this.currentSession.score / 4));
    let coinsEarned = Math.round(correct * 3) + (accuracy === 100 ? 25 : 0);

    const subject = StorageManager.getSubjects()[this.currentSession.subjectId];
    const isUnverified = subject && subject.verified === false;

    const profile = StorageManager.getProfile();
    profile.stats = profile.stats || {};
    profile.stats.gamesPlayed += 1;
    profile.stats.correctAnswers += correct;
    profile.stats.wrongAnswers += this.currentSession.wrongCount;
    profile.stats.skippedAnswers += this.currentSession.skippedCount;

    if (accuracy === 100 && totalAnswered >= 5) {
      profile.stats.perfectGames += 1;
    }

    let pendingAwarded = false;
    if (this.currentSession.mode === 'revision') {
      this.currentSession.score = 0;
      xpEarned = 0;
      coinsEarned = 0;
    } else if (isUnverified) {
      // Accumulate pending XP and Coins so the player gets retroactively rewarded once verified!
      profile.stats.pendingRewards = profile.stats.pendingRewards || {};
      const subId = this.currentSession.subjectId;
      profile.stats.pendingRewards[subId] = profile.stats.pendingRewards[subId] || { xp: 0, coins: 0, games: 0, correct: 0 };
      profile.stats.pendingRewards[subId].xp += xpEarned;
      profile.stats.pendingRewards[subId].coins += coinsEarned;
      profile.stats.pendingRewards[subId].games += 1;
      profile.stats.pendingRewards[subId].correct += correct;

      this.currentSession.score = 0;
      xpEarned = 0;
      coinsEarned = 0;
      pendingAwarded = true;
    }

    const { profile: updatedProfile, leveledUp } = GamificationEngine.addReward(profile, this.currentSession.score, xpEarned, coinsEarned);
    const newAchievements = GamificationEngine.checkAchievements(updatedProfile);

    const summary = {
      score: this.currentSession.score,
      correctCount: correct,
      wrongCount: this.currentSession.wrongCount,
      totalQuestions: totalAnswered,
      accuracy: accuracy,
      xpEarned: xpEarned,
      coinsEarned: coinsEarned,
      leveledUp: leveledUp,
      newAchievements: newAchievements,
      history: this.currentSession.history,
      isUnverified: isUnverified,
      pendingAwarded: pendingAwarded
    };

    this.currentSession = null;
    return summary;
  }
}


// --- File: js/multiplayer.js ---
// Real-time Multiplayer Engine using Supabase Realtime for 1v1 Duels — with Global Leaderboard




class MultiplayerEngine {
  constructor() {
    this.channel = null;
    this.currentBattleId = null;
    this.matchmakingPollInterval = null;
  }

  static generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  }

  // --- Supabase DB helpers ---
  static _getDB() {
    if (window.supabase && window.supabase.createClient) {
      // Reuse existing client or create one
      if (!MultiplayerEngine._db) {
        MultiplayerEngine._db = window._dbInstance || window.supabase.createClient(
          'https://hsgrieghyfpzxuazfmvx.supabase.co',
          'sb_publishable_bborZn7bk6huf--BanH2pg___DL_98m'
        );
      }
      return MultiplayerEngine._db;
    }
    return null;
  }

  // --- Battle CRUD ---
  static async createBattle({ code, subjectId, subjectName, wager, isPublic, player1Id, player1Name, player1Avatar, questionsData }) {
    const db = this._getDB();
    if (!db) return null;
    const { data, error } = await db.from('battles').insert({
      code,
      subject_id: subjectId,
      subject_name: subjectName,
      wager: wager || 0,
      is_public: isPublic || false,
      player1_id: player1Id,
      player1_name: player1Name,
      player1_avatar: player1Avatar || '🎓',
      questions_data: questionsData,
      status: 'waiting'
    }).select().single();
    if (error) { console.error('createBattle error:', error); return null; }
    return data;
  }

  static async findMatchmakingBattle(subjectId, wager, myUsername) {
    const db = this._getDB();
    if (!db) return null;
    const { data, error } = await db.from('battles')
      .select('*')
      .eq('status', 'waiting')
      .eq('is_public', true)
      .eq('subject_id', subjectId)
      .eq('wager', wager)
      .is('player2_id', null)
      .neq('player1_id', myUsername)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) { console.error('findMatchmaking error:', error); return null; }
    return data;
  }

  static async joinBattle(battleId, { player2Id, player2Name, player2Avatar }) {
    const db = this._getDB();
    if (!db) return null;
    const { data, error } = await db.from('battles')
      .update({
        player2_id: player2Id,
        player2_name: player2Name,
        player2_avatar: player2Avatar || '🎓',
        status: 'waiting'
      })
      .eq('id', battleId)
      .select()
      .single();
    if (error) { console.error('joinBattle error:', error); return null; }
    return data;
  }

  static async getBattle(battleId) {
    const db = this._getDB();
    if (!db) return null;
    const { data, error } = await db.from('battles').select('*').eq('id', battleId).single();
    if (error) return null;
    return data;
  }

  static async getBattleByCode(code) {
    const db = this._getDB();
    if (!db) return null;
    const { data, error } = await db.from('battles').select('*').eq('code', code.toUpperCase()).eq('status', 'waiting').maybeSingle();
    if (error) return null;
    return data;
  }

  static async deleteBattle(battleId) {
    const db = this._getDB();
    if (!db) return;
    await db.from('battles').delete().eq('id', battleId);
  }

  static async markReady(battleId, playerNum) {
    const db = this._getDB();
    if (!db) return null;
    const field = playerNum === 1 ? 'player1_ready' : 'player2_ready';
    const { data, error } = await db.from('battles')
      .update({ [field]: true })
      .eq('id', battleId)
      .select()
      .single();
    if (error) return null;
    return data;
  }

  static async updateScore(battleId, playerNum, score) {
    const db = this._getDB();
    if (!db) return;
    const field = playerNum === 1 ? 'player1_score' : 'player2_score';
    await db.from('battles').update({ [field]: score }).eq('id', battleId);
  }

  static async finishBattle(battleId) {
    const db = this._getDB();
    if (!db) return;
    await db.from('battles').update({ status: 'finished' }).eq('id', battleId);
  }

  static async cancelMatchmaking(battleId) {
    return this.deleteBattle(battleId);
  }

  // --- Supabase Realtime Channel ---
  static subscribeToBattle(battleId, callbacks) {
    const db = this._getDB();
    if (!db) return null;

    const channel = db.channel(`battle_${battleId}`, {
      config: { broadcast: { self: false } }
    });

    channel.on('broadcast', { event: 'player_joined' }, (payload) => {
      if (callbacks.onPlayerJoined) callbacks.onPlayerJoined(payload.payload);
    });

    channel.on('broadcast', { event: 'player_ready' }, (payload) => {
      if (callbacks.onPlayerReady) callbacks.onPlayerReady(payload.payload);
    });

    channel.on('broadcast', { event: 'battle_start' }, (payload) => {
      if (callbacks.onBattleStart) callbacks.onBattleStart(payload.payload);
    });

    channel.on('broadcast', { event: 'score_update' }, (payload) => {
      if (callbacks.onScoreUpdate) callbacks.onScoreUpdate(payload.payload);
    });

    channel.on('broadcast', { event: 'question_advance' }, (payload) => {
      if (callbacks.onQuestionAdvance) callbacks.onQuestionAdvance(payload.payload);
    });

    channel.on('broadcast', { event: 'emote' }, (payload) => {
      if (callbacks.onEmote) callbacks.onEmote(payload.payload);
    });

    channel.on('broadcast', { event: 'player_finished' }, (payload) => {
      if (callbacks.onPlayerFinished) callbacks.onPlayerFinished(payload.payload);
    });

    channel.on('broadcast', { event: 'player_left_lobby' }, (payload) => {
      if (callbacks.onPlayerLeftLobby) callbacks.onPlayerLeftLobby(payload.payload);
    });

    channel.on('broadcast', { event: 'player_abandoned' }, (payload) => {
      if (callbacks.onPlayerAbandoned) callbacks.onPlayerAbandoned(payload.payload);
    });

    channel.on('broadcast', { event: 'battle_finished' }, (payload) => {
      if (callbacks.onBattleFinished) callbacks.onBattleFinished(payload.payload);
    });

    channel.subscribe();
    return channel;
  }

  static broadcastEvent(channel, eventType, payload) {
    if (!channel) return;
    channel.send({ type: 'broadcast', event: eventType, payload });
  }

  // --- High-level Duel Actions ---

  static async createPrivateRoom(subjectData, wager = 0) {
    const profile = StorageManager.getProfile();
    if (wager > 0 && profile.coins < wager) {
      return { success: false, message: `Pièces insuffisantes ! (${profile.coins} 🪙 dispo, ${wager} 🪙 requis)` };
    }

    const code = this.generateRoomCode();
    const questions = [...subjectData.questions].sort(() => Math.random() - 0.5).slice(0, 10);
    const questionsClean = questions.map(q => ({
      id: q.id || Math.random().toString(36).substring(2, 9),
      question: q.question,
      options: q.options || [],
      correct: q.correct,
      explanation: q.explanation || ''
    }));

    const battle = await this.createBattle({
      code,
      subjectId: subjectData.id,
      subjectName: subjectData.name,
      wager,
      isPublic: false,
      player1Id: (profile.cloudAccount?.username || profile.name).toLowerCase(),
      player1Name: profile.name,
      player1Avatar: profile.avatar || '🎓',
      questionsData: questionsClean
    });

    if (!battle) return { success: false, message: 'Erreur serveur. Réessayez.' };
    return { success: true, battle, code };
  }

  static async joinPrivateRoom(code) {
    const profile = StorageManager.getProfile();
    const myUsername = (profile.cloudAccount?.username || profile.name).toLowerCase();

    const battle = await this.getBattleByCode(code.toUpperCase());
    if (!battle) return { success: false, message: 'Salon introuvable ou déjà commencé.' };
    if (battle.player1_id === myUsername) return { success: false, message: 'Vous ne pouvez pas combattre contre vous-même ! 🚫' };
    if (battle.player2_id) return { success: false, message: 'Ce salon est déjà plein !' };
    if (battle.wager > 0 && profile.coins < battle.wager) {
      return { success: false, message: `Pièces insuffisantes ! (${profile.coins} 🪙 dispo, ${battle.wager} 🪙 requis)` };
    }

    const updated = await this.joinBattle(battle.id, {
      player2Id: myUsername,
      player2Name: profile.name,
      player2Avatar: profile.avatar || '🎓'
    });

    if (!updated) return { success: false, message: 'Erreur en rejoignant le salon.' };
    return { success: true, battle: updated };
  }

  static async startMatchmaking(subjectData, wager = 0) {
    const profile = StorageManager.getProfile();
    const myUsername = (profile.cloudAccount?.username || profile.name).toLowerCase();

    // Search for an existing public room
    const existing = await this.findMatchmakingBattle(subjectData.id, wager, myUsername);

    if (existing) {
      // Join the existing room
      if (existing.wager > 0 && profile.coins < existing.wager) {
        return { success: false, message: `Pièces insuffisantes pour ce pari ! (${existing.wager} 🪙 requis)` };
      }

      const updated = await this.joinBattle(existing.id, {
        player2Id: myUsername,
        player2Name: profile.name,
        player2Avatar: profile.avatar || '🎓'
      });

      if (!updated) return { success: false, message: 'Erreur matchmaking: joinBattle a échoué (vérifier la console pour l\'erreur RLS).' };
      return { success: true, matched: true, battle: updated };
    }

    // No room found — create one and wait
    const code = this.generateRoomCode();
    const questions = [...subjectData.questions].sort(() => Math.random() - 0.5).slice(0, 10);
    const questionsClean = questions.map(q => ({
      id: q.id || Math.random().toString(36).substring(2, 9),
      question: q.question,
      options: q.options || [],
      correct: q.correct,
      explanation: q.explanation || ''
    }));

    const battle = await this.createBattle({
      code,
      subjectId: subjectData.id,
      subjectName: subjectData.name,
      wager: wager,
      isPublic: true,
      player1Id: myUsername,
      player1Name: profile.name,
      player1Avatar: profile.avatar || '🎓',
      questionsData: questionsClean
    });

    if (!battle) return { success: false, message: 'Erreur serveur.' };
    return { success: true, matched: false, waiting: true, battle };
  }

  static async cancelMatchmaking(battleId) {
    await this.deleteBattle(battleId);
  }

  static resolveDuel(wager, myScore, oppScore) {
    const profile = StorageManager.getProfile();
    profile.stats = profile.stats || {};
    profile.stats.duelPlayed = (profile.stats.duelPlayed || 0) + 1;
    profile.stats.duelsPlayed = (profile.stats.duelsPlayed || 0) + 1;

    let result, coinsEarned = 0;

    if (myScore > oppScore) {
      result = 'VICTORY';
      profile.stats.duelWins = (profile.stats.duelWins || 0) + 1;
      coinsEarned = wager * 2;
      if (wager > 0) {
        profile.totalCoinsEarned = (profile.totalCoinsEarned ?? profile.coins ?? 50) + coinsEarned;
        profile.coins = Math.max(0, (profile.totalCoinsEarned ?? 50) - (profile.totalCoinsSpent ?? 0));
      }
      profile.xp += 100;
    } else if (myScore === oppScore) {
      result = 'DRAW';
      // Refund wager
      if (wager > 0) {
        profile.totalCoinsEarned = (profile.totalCoinsEarned ?? profile.coins ?? 50) + wager;
        profile.coins = Math.max(0, (profile.totalCoinsEarned ?? 50) - (profile.totalCoinsSpent ?? 0));
      }
      profile.xp += 25;
    } else {
      result = 'DEFEAT';
      profile.stats.duelLosses = (profile.stats.duelLosses || 0) + 1;
      // Wager already deducted, no refund
      profile.xp += 10;
    }

    StorageManager.saveProfile(profile);
    GamificationEngine.checkAchievements(StorageManager.getProfile());
    return { result, coinsEarned, wager, myScore, oppScore };
  }

  // --- Leaderboard (unchanged) ---
  static async getLeaderboard() {
    const profile = StorageManager.getProfile();
    const isVerified = StorageManager.verifyAntiCheatToken(profile);

    const myId = (profile.cloudAccount?.username || profile.name || 'Réviseur Pro');
    const myIdLower = myId.toLowerCase();

    const userEntry = {
      name: myId,
      level: profile.level || 1,
      xp: profile.xp || 0,
      coins: profile.coins || 0,
      wins: profile.stats?.duelWins || 0,
      total_duels: profile.stats?.duelsPlayed || 0,
      streak: profile.streakDays || 0,
      badges: profile.selectedBadges || (profile.unlockedAchievements ? profile.unlockedAchievements.slice(0, 3) : []),
      avatar: profile.avatar || '🎓',
      isUser: true,
      isVerified
    };

    let cloudPlayers = await fetchCloudLeaderboard();

    if (!cloudPlayers || cloudPlayers.length === 0) {
      cloudPlayers = StorageManager.getGlobalLeaderboardRegistry().map(p => ({
        name: p.name, level: p.level, xp: p.xp || 0, coins: p.coins, wins: p.wins,
        avatar: p.avatar, checksum_token: p.checksumToken,
        total_duels: p.total_duels || 0, streak: p.streak || 0, badges: p.badges || []
      }));
    }

    const mapPlayers = new Map();

    cloudPlayers.forEach(player => {
      const profileLike = { ...player, checksumToken: player.checksum_token, stats: { duelWins: player.wins, duelsPlayed: player.total_duels } };
      const isValid = StorageManager.verifyAntiCheatToken(profileLike);
      if (!isValid) return;

      const isMe = player.name.toLowerCase() === myIdLower;
      mapPlayers.set(player.name.toLowerCase(), {
        name: player.name,
        level: player.level,
        xp: player.xp || 0,
        coins: player.coins,
        wins: player.wins,
        total_duels: player.total_duels || 0,
        streak: player.streak || 0,
        badges: player.badges || [],
        avatar: player.avatar,
        isUser: isMe,
        isVerified: true
      });
    });

    if (isVerified) {
      mapPlayers.set(myIdLower, userEntry);
    }

    return Array.from(mapPlayers.values()).sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.coins - a.coins;
    });
  }
}


// --- File: js/app.js ---
// Main application controller linking UI, QuizEngine, Gamification, Storage, Audio, and Multiplayer








const safeOn = (id, event, fn) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
};

const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};


class AppController {
  constructor() {
    this.quizEngine = new QuizEngine();
    this.currentView = 'subjects-view';
    this.currentFolderPath = [];
    this._eventListenersSetup = false;
    this.pendingNewQuiz = null;

    // Selection mode state
    this.isSelectMode = false;
    this.selectedSubjects = new Set();
    
    // Profile sync
    StorageManager.subscribe(() => { this.renderHeaderStats(); this.updatePausedBanner(); });

    this.timerInterval = null;
    this.currentSubjectId = null;
    this.flashcardSession = null;
    this.currentFolderPath = [];
    this.profileClickCount = 0;
    this.profileClickTimer = null;
    this.currentDuelRoom = null;
    // Duel state
    this.duelState = null; // { battleId, channel, playerNum, battle, myScore, oppScore, questionIndex, questions }
    this.matchmakingPollInterval = null;
  }

  updateSplashProgress(percent, statusText) {
    const bar = document.getElementById('splash-progress-bar');
    const text = document.getElementById('splash-status-text');
    if (bar) bar.style.width = `${percent}%`;
    if (text && statusText) text.textContent = statusText;
  }

  hideSplashScreen() {
    this.updateSplashProgress(100, 'Prêt ! Lancement...');
    setTimeout(() => {
      const splash = document.getElementById('app-splash-screen');
      if (splash) splash.classList.add('loaded');
    }, 250);
  }

  init() {
    this.updateSplashProgress(25, 'Chargement de votre profil...');
    const profile = StorageManager.getProfile();
    
    // Unlock everything for admin
    if (profile.name && profile.name.toLowerCase() === 'admin') {
      let dirty = false;
      SHOP_ITEMS.forEach(item => {
        if (!profile.purchasedItems.includes(item.id)) {
          profile.purchasedItems.push(item.id);
          dirty = true;
        }
      });
      if (dirty) StorageManager.saveProfile(profile);
    }

    this.updateSplashProgress(50, 'Vérification des missions et récompenses...');
    GamificationEngine.checkDailyLogin(profile).then((loginReward) => {
      this.updateHeaderStats();
      if (loginReward) {
        this.showDailyRewardPopup(loginReward);
      }
    });
    GamificationEngine.checkAchievements(StorageManager.getProfile());
    this.resolveAbandonedBattles();
    this.applyUserTheme();
    this.setupNavigation();
    
    this.updateSplashProgress(75, 'Organisation de vos cours & paquets...');
    this.renderCategoryFilters();
    this.renderSubjects();
    this.updatePausedBanner();
    this.renderShop();
    this.renderProfile();
    this.setupCSVImporter();
    this.setupEventListeners();

    this.setupFriendSystem();
    this.checkAndVerifyLocalDecks();

    // Finish loading and dismiss splash smoothly
    this.hideSplashScreen();

    // 1. Immediate Cloud Sync on launch (Lightweight timestamp check: ~0.1 KB)
    setTimeout(async () => {
      const updated = await StorageManager.syncFromCloudSilent();
      if (updated) {
        this.updateHeaderStats();
        this.updatePausedBanner();
        if (document.getElementById('subjects-view')?.classList.contains('active')) {
          this.renderSubjects();
        }
      }
    }, 800);

    // 2. Instant Sync whenever user switches back to the tab/app on phone or computer
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        const updated = await StorageManager.syncFromCloudSilent();
        if (updated) {
          this.updateHeaderStats();
          this.updatePausedBanner();
          if (document.getElementById('subjects-view')?.classList.contains('active')) {
            this.renderSubjects();
          }
        }
      }
    });

    // 3. Periodic silent background cloud sync heartbeat (2 minutes, zero egress if no changes)
    setInterval(async () => {
      const updated = await StorageManager.syncFromCloudSilent();
      if (updated) {
        this.updateHeaderStats();
        this.updatePausedBanner();
        if (document.getElementById('subjects-view')?.classList.contains('active')) {
          this.renderSubjects();
        }
      }
    }, 2 * 60 * 1000); // 2 minutes

    // Poll friend notifications every 30 seconds (very light query, doesn't consume much egress)
    setInterval(async () => {
      await this.pollFriendNotifications();
    }, 30000); // 30 seconds

    // Initial notification poll after short delay
    setTimeout(() => this.pollFriendNotifications(), 3000);

    // Run background migration for legacy Base64 reward images
    setTimeout(() => this.migrateLegacyBase64Rewards(), 5000);
  }

  async migrateLegacyBase64Rewards() {
    const profile = StorageManager.getProfile();
    let migrated = false;
    const username = profile.cloudAccount?.username || 'anonyme';
    
    if (profile.customRewards && profile.customRewards.length > 0) {
      for (let rew of profile.customRewards) {
        if (rew.image && rew.image.startsWith('data:image')) {
          console.log(`Migrating legacy base64 image for reward: ${rew.title}`);
          // uploadRewardImage was imported at the top of the file
          const path = await uploadRewardImage(rew.image, username);
          if (path) {
            rew.image = path;
            migrated = true;
          }
        }
      }
    }
    
    if (migrated) {
      console.log('Migration complete. Saving cleaned profile.');
      StorageManager.saveProfile(profile);
      // Force sync to cloud to clear base64 from Supabase DB immediately
      await StorageManager.syncFromCloudSilent(); 
    }
  }


  // ─── FRIEND SYSTEM ────────────────────────────────────────────────────────

  async renderFriends() {
    const profile = StorageManager.getProfile();
    const myUsername = profile.cloudAccount?.username;
    const friendIdEl = document.getElementById('my-friend-id');
    if (friendIdEl) {
      friendIdEl.textContent = profile.friendId || (myUsername ? '...' : '🔒 Connexion requise');
    }

    const container = document.getElementById('friends-list-container');
    if (!container) return;

    if (!myUsername) {
      container.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 1rem; font-size: 0.9rem;">🔒 Connecte-toi à un Compte Cloud pour utiliser les amis.</div>`;
      return;
    }

    container.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 1rem; font-size: 0.85rem;">Chargement...</div>`;
    const friends = await getFriends(myUsername);

    if (friends.length === 0) {
      container.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 1rem; font-size: 0.9rem;">Aucun ami pour l'instant. Partage ton ID pour commencer !</div>`;
      return;
    }

    container.innerHTML = '';
    friends.forEach(friend => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md);';
      row.innerHTML = `
        <div style="font-size: 1.8rem; cursor: pointer;" class="friend-profile-trigger" data-username="${friend.username}">${friend.avatar}</div>
        <div style="flex: 1; cursor: pointer;" class="friend-profile-trigger" data-username="${friend.username}">
          <div style="font-weight: 700; font-size: 0.95rem;">${friend.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">@${friend.username} · Niv. ${friend.level} · <span style="font-family: monospace; color: var(--accent-purple);">${friend.friendId}</span></div>
        </div>
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn-secondary btn-invite-friend" data-username="${friend.username}" data-name="${friend.name}" style="padding: 0.4rem 0.65rem; font-size: 0.8rem;" title="Inviter en duel">⚔️</button>
          <button class="btn-secondary btn-share-reward" data-username="${friend.username}" data-name="${friend.name}" style="padding: 0.4rem 0.65rem; font-size: 0.8rem;" title="Offrir une récompense">🎁</button>
          <button class="btn-secondary btn-remove-friend" data-username="${friend.username}" style="padding: 0.4rem 0.65rem; font-size: 0.8rem; color: var(--accent-red); border-color: rgba(239,68,68,0.4);" title="Retirer">✕</button>
        </div>
      `;
      container.appendChild(row);
    });

    // Wire friend action buttons
    container.querySelectorAll('.btn-invite-friend').forEach(btn => {
      btn.addEventListener('click', () => this.inviteFriendToDuel(btn.dataset.username, btn.dataset.name));
    });
    container.querySelectorAll('.btn-share-reward').forEach(btn => {
      btn.addEventListener('click', () => this.openShareRewardModal(btn.dataset.username, btn.dataset.name));
    });
    container.querySelectorAll('.btn-remove-friend').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm(`Retirer ${btn.dataset.username} de tes amis ?`)) return;
        await removeFriend(myUsername, btn.dataset.username);
        await this.renderFriends();
      });
    });
    
    container.querySelectorAll('.friend-profile-trigger').forEach(el => {
      el.addEventListener('click', () => {
        const friend = friends.find(f => f.username === el.dataset.username);
        if (friend) this.openProfileModal(friend);
      });
    });
  }

  async inviteFriendToDuel(friendUsername, friendName) {
    const profile = StorageManager.getProfile();
    const myUsername = profile.cloudAccount?.username;
    if (!myUsername) { alert('Connexion Cloud requise !'); return; }

    // Create a private battle room
    const subjects = StorageManager.getSubjects();
    const subjectIds = Object.keys(subjects);
    if (subjectIds.length === 0) { alert('Aucun cours disponible pour un duel !'); return; }

    // Use a default subject (first available) - user picks in duel lobby anyway
    const subjectId = subjectIds[0];
    const subject = subjects[subjectId];
    const result = await MultiplayerEngine.createPrivateRoom({ id: subjectId, name: subject.name || subjectId, questions: Object.values(subject.questions || {}) }, 0);

    if (!result.success) { alert(result.message); return; }

    const sent = await sendFriendNotification(
      friendUsername, myUsername, profile.avatar || '🎓',
      'duel_invite',
      { battleCode: result.code, subjectName: subject.name || subjectId, createdAt: Date.now() }
    );

    if (sent) {
      alert(`✅ Invitation envoyée à ${friendName} !\nRejoignez le salon, vous allez y être redirigé.`);
      
      // Navigate to duels tab
      const duelsTab = document.querySelector('[data-target="duels-view"]');
      if (duelsTab) duelsTab.click();

      // Show matchmaking screen waiting for the friend
      this.showDuelScreen('matchmaking');
      const statusText = document.getElementById('matchmaking-status-text');
      if (statusText) statusText.textContent = `En attente de ${friendName}... Code : ${result.code}`;

      const channel = MultiplayerEngine.subscribeToBattle(result.battle.id, {
        onPlayerJoined: (data) => {
          this.enterDuelLobby({ ...result.battle, ...data });
        }
      });

      this.duelState = { battleId: result.battle.id, channel, battle: result.battle };

      // Poll to make sure we don't miss the join event
      this.matchmakingPollInterval = setInterval(async () => {
        const battle = await MultiplayerEngine.getBattle(result.battle.id);
        if (battle && battle.player2_id) {
          clearInterval(this.matchmakingPollInterval);
          this.matchmakingPollInterval = null;
          this.enterDuelLobby(battle);
        }
      }, 2000);
    } else {
      alert('❌ Erreur lors de l\'envoi de l\'invitation.');
    }
  }

  openShareRewardModal(friendUsername, friendName) {
    const profile = StorageManager.getProfile();
    const rewards = profile.customRewards || [];
    const modal = document.getElementById('modal-share-reward');
    const nameEl = document.getElementById('share-target-name');
    const list = document.getElementById('share-reward-list');
    const status = document.getElementById('share-reward-status');
    if (!modal || !list) return;

    if (nameEl) nameEl.textContent = friendName;
    if (status) status.textContent = '';

    if (rewards.length === 0) {
      list.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">Aucune récompense personnelle à partager.</div>`;
    } else {
      list.innerHTML = '';
      rewards.forEach(rew => {
        const btn = document.createElement('button');
        btn.className = 'btn-secondary';
        btn.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; text-align: left; width: 100%;';
        btn.innerHTML = `<span style="font-size: 1.5rem;">🎁</span><div><div style="font-weight: 700;">${rew.title}</div><div style="font-size: 0.8rem; color: var(--text-secondary);">${rew.cost} 🪙</div></div>`;
        btn.addEventListener('click', async () => {
          const myUsername = profile.cloudAccount?.username;
          if (!myUsername) return;
          btn.disabled = true;
          btn.textContent = 'Envoi...';
          const sent = await sendFriendNotification(
            friendUsername, myUsername, profile.avatar || '🎓',
            'reward_share',
            { reward: { id: `rew_${Date.now()}`, title: rew.title, cost: rew.cost, image: rew.image || null, redeemedCount: 0 } }
          );
          if (status) status.textContent = sent ? `✅ "${rew.title}" envoyée à ${friendName} !` : '❌ Erreur lors de l\'envoi.';
          if (status) status.style.color = sent ? 'var(--accent-green, #22c55e)' : 'var(--accent-red)';
          if (sent) setTimeout(() => modal.classList.remove('active'), 1500);
        });
        list.appendChild(btn);
      });
    }

    modal.classList.add('active');
  }

  async pollFriendNotifications() {
    const profile = StorageManager.getProfile();
    const myUsername = profile.cloudAccount?.username;
    if (!myUsername) return;

    const notifs = await getMyNotifications(myUsername);
    const btn = document.getElementById('header-notif-btn');
    const badge = document.getElementById('header-notif-badge');
    if (!btn) return;

    if (notifs.length > 0) {
      btn.style.display = 'flex';
      if (badge) { badge.style.display = 'flex'; badge.textContent = notifs.length; }
    } else {
      if (badge) badge.style.display = 'none';
    }

    // Store for modal rendering
    this._pendingNotifs = notifs;
  }

  async renderNotificationsModal() {
    const notifs = this._pendingNotifs || [];
    const list = document.getElementById('friend-notifs-list');
    if (!list) return;

    if (notifs.length === 0) {
      list.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 1.5rem;">Aucune nouvelle notification 🎉</div>`;
      return;
    }

    list.innerHTML = '';
    notifs.forEach(n => {
      const card = document.createElement('div');
      card.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem;';

      const payloadStr = typeof n.payload === 'string' ? JSON.parse(n.payload) : (n.payload || {});
      if (n.type === 'duel_invite') {
        const payload = payloadStr || {};
        card.innerHTML = `
          <span style="font-size: 2rem;">${n.from_avatar || '🎓'}</span>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.95rem;">⚔️ Défi de ${n.from_username}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${payload.subjectName || 'Quiz'} · Code : <strong style="color: var(--accent-cyan); font-family: monospace;">${payload.battleCode || '???'}</strong></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            <button class="btn-primary btn-notif-join" data-code="${payload.battleCode || ''}" data-id="${n.id}" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;">Rejoindre</button>
            <button class="btn-secondary btn-notif-dismiss" data-id="${n.id}" style="padding: 0.4rem 0.75rem; font-size: 0.75rem;">Ignorer</button>
          </div>
        `;
      } else if (n.type === 'reward_share') {
        const rew = payloadStr?.reward || {};
        card.innerHTML = `
          <span style="font-size: 2rem;">${n.from_avatar || '🎓'}</span>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.95rem;">🎁 Cadeau de ${n.from_username}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">"${rew.title || '?'}" (${rew.cost || 0} 🪙)</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            <button class="btn-primary btn-notif-accept-reward" data-id="${n.id}" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;">Accepter</button>
            <button class="btn-secondary btn-notif-dismiss" data-id="${n.id}" style="padding: 0.4rem 0.75rem; font-size: 0.75rem;">Refuser</button>
          </div>
        `;
      } else if (n.type === 'friend_request') {
        card.innerHTML = `
          <span style="font-size: 2rem;">${n.from_avatar || '🎓'}</span>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.95rem;">👋 Demande d'ami</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${n.from_username} veut devenir ton ami !</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            <button class="btn-primary btn-notif-accept-friend" data-user="${n.from_username}" data-id="${n.id}" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;">Accepter</button>
            <button class="btn-secondary btn-notif-dismiss" data-id="${n.id}" style="padding: 0.4rem 0.75rem; font-size: 0.75rem;">Ignorer</button>
          </div>
        `;
      }
      list.appendChild(card);

      // Wire buttons
      card.querySelectorAll('.btn-notif-dismiss').forEach(b => {
        b.addEventListener('click', async () => {
          await markNotificationRead(b.dataset.id);
          this._pendingNotifs = (this._pendingNotifs || []).filter(x => x.id !== b.dataset.id);
          card.remove();
          await this.pollFriendNotifications();
        });
      });

      card.querySelectorAll('.btn-notif-join').forEach(b => {
        b.addEventListener('click', async () => {
          await markNotificationRead(b.dataset.id);
          const code = b.dataset.code;
          document.getElementById('modal-friend-notifs')?.classList.remove('active');
          // Navigate to duels and pre-fill code
          const duelsTab = document.querySelector('[data-target="duels-view"]');
          if (duelsTab) duelsTab.click();
          setTimeout(() => {
            const codeInput = document.getElementById('input-duel-code');
            const joinBtn = document.getElementById('btn-join-duel');
            if (codeInput) codeInput.value = code;
            if (joinBtn) joinBtn.click();
          }, 300);
          this._pendingNotifs = (this._pendingNotifs || []).filter(x => x.id !== b.dataset.id);
          await this.pollFriendNotifications();
        });
      });

      card.querySelectorAll('.btn-notif-accept-reward').forEach(b => {
        b.addEventListener('click', async () => {
          const notif = notifs.find(x => x.id === b.dataset.id);
          if (!notif) return;
          const payloadStr = typeof notif.payload === 'string' ? JSON.parse(notif.payload) : (notif.payload || {});
          const rew = payloadStr?.reward;
          if (rew && rew.title) {
            const profile = StorageManager.getProfile();
            if (!profile.customRewards) profile.customRewards = [];
            // Give new unique ID to avoid collision
            profile.customRewards.push({ ...rew, id: `rew_${Date.now()}`, redeemedCount: 0 });
            StorageManager.saveProfile(profile);
            StorageManager.autoSyncCloud();
            this.renderShop();
          }
          await markNotificationRead(b.dataset.id);
          this._pendingNotifs = (this._pendingNotifs || []).filter(x => x.id !== b.dataset.id);
          card.remove();
          await this.pollFriendNotifications();
          alert(`🎁 Récompense "${rew?.title}" ajoutée à ta liste !`);
        });
      });

      card.querySelectorAll('.btn-notif-accept-friend').forEach(b => {
        b.addEventListener('click', async () => {
          b.disabled = true;
          b.textContent = '...';
          const friendName = b.dataset.user;
          const myProfile = StorageManager.getProfile();
          const myUsername = myProfile.cloudAccount?.username;
          if (myUsername) {
            await addFriend(myUsername, friendName);
            await markNotificationRead(b.dataset.id);
            this._pendingNotifs = (this._pendingNotifs || []).filter(x => x.id !== b.dataset.id);
            card.remove();
            await this.pollFriendNotifications();
            await this.renderFriends();
          }
        });
      });
    });
  }

  setupFriendSystem() {
    // Copy friend ID
    safeOn('btn-copy-friend-id', 'click', () => {
      const profile = StorageManager.getProfile();
      const id = profile.friendId || '';
      if (!id) { alert('Connecte-toi d\'abord à un Compte Cloud !'); return; }
      navigator.clipboard.writeText(id).then(() => {
        const btn = document.getElementById('btn-copy-friend-id');
        if (btn) { btn.textContent = '✅ Copié !'; setTimeout(() => btn.textContent = '📋 Copier', 2000); }
      });
    });

    // Add friend by ID
    safeOn('btn-add-friend', 'click', async () => {
      const profile = StorageManager.getProfile();
      const myUsername = profile.cloudAccount?.username;
      const statusEl = document.getElementById('add-friend-status');
      const input = document.getElementById('input-add-friend');
      if (!myUsername) { if (statusEl) { statusEl.textContent = '🔒 Connexion Cloud requise.'; statusEl.style.color = 'var(--accent-red)'; } return; }

      const rawId = input ? input.value.trim().toUpperCase() : '';
      if (!rawId || rawId.length < 4) { if (statusEl) { statusEl.textContent = '❌ ID invalide.'; statusEl.style.color = 'var(--accent-red)'; } return; }

      const friendId = rawId.startsWith('RMX-') ? rawId : 'RMX-' + rawId;
      if (statusEl) { statusEl.textContent = 'Recherche...'; statusEl.style.color = 'var(--text-secondary)'; }

      const found = await lookupByFriendId(friendId);
      if (!found) { if (statusEl) { statusEl.textContent = '❌ Aucun joueur trouvé avec cet ID.'; statusEl.style.color = 'var(--accent-red)'; } return; }
      if (found.username === myUsername) { if (statusEl) { statusEl.textContent = '😅 C\'est toi !'; statusEl.style.color = 'var(--accent-amber)'; } return; }

      const res = await addFriend(myUsername, found.username);
      if (statusEl) {
        if (res.success) {
          statusEl.textContent = `✅ ${found.profile_data?.name || found.username} ajouté(e) !`;
          statusEl.style.color = 'var(--accent-green, #22c55e)';
          if (input) input.value = '';
          await this.renderFriends();
        } else {
          statusEl.textContent = '❌ Erreur : ' + (res.error || 'impossible d\'ajouter cet ami.');
          statusEl.style.color = 'var(--accent-red)';
        }
      }
    });

    // Notification bell
    safeOn('header-notif-btn', 'click', async () => {
      await this.renderNotificationsModal();
      document.getElementById('modal-friend-notifs')?.classList.add('active');
    });

    // Render friends when profile tab opens
    document.querySelectorAll('[data-target="profile-view"]').forEach(tab => {
      tab.addEventListener('click', () => {
        setTimeout(() => this.renderFriends(), 100);
      });
    });
  }

  triggerMathJax() {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise().catch(err => console.log('MathJax typeset error:', err));
    }
  }

  applyUserTheme() {
    const profile = StorageManager.getProfile();
    document.body.className = profile.theme || 'theme-cyberpunk';
  }

  updateHeaderStats() {
    const profile = StorageManager.getProfile();
    document.getElementById('header-coins').textContent = profile.coins;
    document.getElementById('header-streak').textContent = profile.streak;
    document.getElementById('header-level').textContent = `Niv. ${profile.level}`;

    const cloudUserEl = document.getElementById('header-cloud-user');
    const adminBtn = document.getElementById('nav-admin-btn');
    if (cloudUserEl) {
      if (profile.cloudAccount?.username) {
        cloudUserEl.textContent = profile.cloudAccount.username;
        cloudUserEl.style.color = '#6ee7b7';
        if (profile.cloudAccount.username === 'admin' && adminBtn) {
          adminBtn.style.display = 'block';
        } else if (adminBtn) {
          adminBtn.style.display = 'none';
        }
      } else {
        cloudUserEl.textContent = 'Connexion';
        cloudUserEl.style.color = '#fca5a5';
        if (adminBtn) adminBtn.style.display = 'none';
      }
    }
  }

  setupNavigation() {
    if (this._navSetup) return;
    this._navSetup = true;

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-target');
        if (target) {
          this.switchView(target);
        }
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        SoundFX.playClick();
      });
    });

    document.getElementById('btn-logo').addEventListener('click', () => {
      this.currentFolderPath = [];
      this.switchView('subjects-view');
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.nav-btn[data-target="subjects-view"]').classList.add('active');
    });
  }

  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
    }

    if (viewId === 'subjects-view') {
      this.renderSubjects();
      this.updatePausedBanner();
    }
    if (viewId === 'duels-view') this.renderDuelsView();
    if (viewId === 'shop-view') this.renderShop();
    if (viewId === 'profile-view') this.renderProfile();
    if (viewId === 'community-view') this.renderCommunitySubjects();
    if (viewId === 'admin-view') this.renderAdminSubjects();
    if (viewId === 'revision-view') {
      const items = StorageManager.getRevisionItems();
      document.getElementById('revision-count').textContent = items.length;
    }

    this.triggerMathJax();
  }

  renderCategoryFilters() {
    const select = document.getElementById('filter-category-select');
    if (!select) return;

    const subjects = StorageManager.getSubjects();
    const categories = new Set();

    Object.values(subjects).forEach(sub => {
      if (sub.category) categories.add(sub.category);
    });

    select.innerHTML = `<option value="ALL">📁 Toutes les catégories (${Object.keys(subjects).length})</option>`;
    Array.from(categories).sort().forEach(cat => {
      select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });

    select.addEventListener('change', () => {
      this.currentFolderPath = [];
      this.renderSubjects();
    });

    document.getElementById('search-subject-input').addEventListener('input', () => this.renderSubjects());
    
    const commSearch = document.getElementById('community-search-input');
    if (commSearch) commSearch.addEventListener('input', () => this.renderCommunitySubjects());
  }

  renderSubjects() {
    const container = document.getElementById('subjects-container');
    const subjects = StorageManager.getSubjects();
    container.innerHTML = '';

    const selectedCategory = document.getElementById('filter-category-select')?.value || 'ALL';
    const searchQuery = (document.getElementById('search-subject-input')?.value || '').toLowerCase().trim();

    let breadcrumbHTML = `<div class="breadcrumb-bar">`;
    breadcrumbHTML += `<span class="breadcrumb-item" data-path-idx="-1">📁 Accueil</span>`;

    this.currentFolderPath.forEach((folder, idx) => {
      breadcrumbHTML += `<span class="breadcrumb-separator">➔</span>`;
      breadcrumbHTML += `<span class="breadcrumb-item" data-path-idx="${idx}">${folder}</span>`;
    });

    if (this.currentFolderPath.length > 0) {
      breadcrumbHTML += `<button class="btn-secondary" id="btn-folder-up" style="margin-left: auto; padding: 0.35rem 0.75rem; font-size: 0.85rem;">⬅️ Dossier Parent</button>`;
    }
    breadcrumbHTML += `</div>`;

    if (searchQuery) {
      container.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-secondary); margin-bottom: 1rem;">Résultats pour "${searchQuery}" :</div>`;
      Object.values(subjects).forEach(sub => {
        if (!sub.name.toLowerCase().includes(searchQuery) && !sub.description?.toLowerCase().includes(searchQuery)) return;
        this.renderDeckCard(container, sub);
      });
      this.triggerMathJax();
      return;
    }

    // Toggle Action bar if select mode
    const actionBar = document.getElementById('selection-action-bar');
    if (actionBar) {
      actionBar.style.display = this.isSelectMode ? 'flex' : 'none';
      if (this.isSelectMode) {
        document.getElementById('selection-count').textContent = this.selectedSubjects.size;
      }
    }

    const currentDepth = this.currentFolderPath.length;
    const subfoldersMap = new Map();
    const directDecks = [];
    
    // Inject custom folders
    const profile = StorageManager.getProfile();
    if (profile.customFolders) {
      profile.customFolders.forEach(cf => {
        if (cf.pathParts.length === currentDepth + 1) {
          let matches = true;
          for (let i = 0; i < currentDepth; i++) {
            if (cf.pathParts[i] !== this.currentFolderPath[i]) {
              matches = false; break;
            }
          }
          if (matches) {
            const folderName = cf.pathParts[currentDepth];
            if (!subfoldersMap.has(folderName)) {
              subfoldersMap.set(folderName, { name: folderName, deckCount: 0, questionCount: 0, decks: [], customIcon: cf.icon });
            }
          }
        }
      });
    }

    Object.values(subjects).forEach(sub => {
      if (selectedCategory !== 'ALL' && sub.category !== selectedCategory) return;

      const pathParts = sub.pathParts || [sub.name];
      let matchesCurrentPath = true;

      for (let i = 0; i < currentDepth; i++) {
        if (pathParts[i] !== this.currentFolderPath[i]) {
          matchesCurrentPath = false;
          break;
        }
      }

      if (!matchesCurrentPath) return;

      if (pathParts.length > currentDepth + 1) {
        const folderName = pathParts[currentDepth];
        if (!subfoldersMap.has(folderName)) {
          subfoldersMap.set(folderName, { name: folderName, deckCount: 0, questionCount: 0, decks: [] });
        }
        const info = subfoldersMap.get(folderName);
        info.deckCount += 1;
        info.questionCount += (sub.questions ? sub.questions.length : 0);
        info.decks.push(sub);
      } else if (pathParts.length === currentDepth + 1) {
        directDecks.push(sub);
      }
    });

    const wrapper = document.createElement('div');
    wrapper.style.gridColumn = '1/-1';
    wrapper.innerHTML = breadcrumbHTML;
    container.appendChild(wrapper);

    wrapper.querySelectorAll('.breadcrumb-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-path-idx'), 10);
        if (idx === -1) this.currentFolderPath = [];
        else this.currentFolderPath = this.currentFolderPath.slice(0, idx + 1);
        this.renderSubjects();
      });
    });

    const btnUp = wrapper.querySelector('#btn-folder-up');
    if (btnUp) {
      btnUp.addEventListener('click', () => {
        this.currentFolderPath.pop();
        this.renderSubjects();
      });
    }

    const sortedFolders = Array.from(subfoldersMap.values()).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    sortedFolders.forEach(folder => {
      const card = document.createElement('div');
      card.className = 'folder-card';
      const icon = folder.customIcon || (folder.name.toLowerCase().includes('anglais') ? '🇬🇧' : (folder.name.toLowerCase().includes('math') ? '📐' : '📁'));

      const fMastery = StorageManager.getFolderMastery(folder.decks);
      if (fMastery.borderStyle) card.style.border = fMastery.borderStyle;
      if (fMastery.boxShadow) card.style.boxShadow = fMastery.boxShadow;

      let checkboxHTML = '';
      if (this.isSelectMode) {
        // Can't select folders for now, or maybe we can? 
        // For simplicity, we only select subjects. Wait, if they want to move a folder, it's easier to select subjects.
        // I won't add checkboxes on folders.
      }

      card.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="folder-icon-large">${icon}</div>
            <span class="level-badge" style="background: rgba(0,0,0,0.4); border: 1px solid ${fMastery.colorHex}; color: ${fMastery.colorHex}; font-size: 0.8rem;">${fMastery.statusText}</span>
          </div>
          <div class="folder-title">${folder.name}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">${folder.deckCount} sous-dossiers / paquets</div>
        </div>
        <div class="folder-meta">
          <span>${folder.questionCount} cartes au total</span>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn-secondary btn-share-folder" data-folder="${folder.name}" style="padding: 0.4rem 0.6rem; font-size: 0.8rem;" title="Partager à la communauté">🌐</button>
            <button class="btn-secondary btn-edit-folder" data-folder="${folder.name}" style="padding: 0.4rem 0.6rem; font-size: 0.8rem;" title="Renommer le dossier">✏️</button>
            <button class="btn-secondary btn-delete-folder" data-folder="${folder.name}" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);" title="Supprimer ce dossier">🗑️</button>
          </div>
        </div>
      `;

      card.querySelector('.btn-share-folder').addEventListener('click', (e) => {
        e.stopPropagation();
        this.shareFolderToCommunity(folder.name, folder.decks);
      });

      card.querySelector('.btn-edit-folder').addEventListener('click', (e) => {
        e.stopPropagation();
        const newName = prompt('Nouveau nom pour ce dossier :', folder.name);
        if (!newName || newName.trim() === '') return;
        const newIcon = prompt('Nouvelle icône pour ce dossier :', icon) || icon;
        
        const profile = StorageManager.getProfile();
        let folderFoundInProfile = false;
        if (profile.customFolders) {
          profile.customFolders.forEach(cf => {
            if (cf.pathParts.length === this.currentFolderPath.length + 1 &&
                cf.pathParts[cf.pathParts.length - 1] === folder.name) {
              let match = true;
              for (let i = 0; i < this.currentFolderPath.length; i++) {
                if (cf.pathParts[i] !== this.currentFolderPath[i]) match = false;
              }
              if (match) {
                cf.pathParts[cf.pathParts.length - 1] = newName.trim();
                cf.customIcon = newIcon;
                folderFoundInProfile = true;
              }
            }
          });
        }
        
        if (!folderFoundInProfile) {
          if (!profile.customFolders) profile.customFolders = [];
          profile.customFolders.push({
            pathParts: [...this.currentFolderPath, newName.trim()],
            customIcon: newIcon
          });
        }
        StorageManager.saveProfile(profile);

        const subjects = StorageManager.getSubjects();
        let subjectsModified = false;
        folder.decks.forEach(sub => {
          if (subjects[sub.id] && subjects[sub.id].pathParts) {
            const depth = this.currentFolderPath.length;
            if (subjects[sub.id].pathParts[depth] === folder.name) {
              subjects[sub.id].pathParts[depth] = newName.trim();
              subjectsModified = true;
            }
          }
        });
        
        if (subjectsModified) {
          StorageManager.saveSubjects(subjects);
        }
        this.renderSubjects();
      });

      card.querySelector('.btn-delete-folder').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Voulez-vous vraiment supprimer le dossier "${folder.name}" et TOUT son contenu (${folder.deckCount} éléments) ?`)) {
          // Delete from custom folders
          const profile = StorageManager.getProfile();
          if (profile.customFolders) {
            profile.customFolders = profile.customFolders.filter(cf => {
              // Same depth and same name
              if (cf.pathParts.length !== this.currentFolderPath.length + 1) return true;
              if (cf.pathParts[cf.pathParts.length - 1] !== folder.name) return true;
              // Check parents
              for (let i = 0; i < this.currentFolderPath.length; i++) {
                if (cf.pathParts[i] !== this.currentFolderPath[i]) return true;
              }
              return false; // exclude this one
            });
            StorageManager.saveProfile(profile);
          }

          // Delete all subjects inside this folder
          const subjects = StorageManager.getSubjects();
          let subjectsModified = false;
          
          folder.decks.forEach(sub => {
            if (subjects[sub.id]) {
              delete subjects[sub.id];
              subjectsModified = true;
            }
          });

          if (subjectsModified) {
            StorageManager.saveSubjects(subjects);
          }

          this.renderSubjects();
        }
      });

      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        this.currentFolderPath.push(folder.name);
        this.renderSubjects();
        SoundFX.playClick();
      });

      container.appendChild(card);
    });

    const sortedDecks = [...directDecks].sort((a, b) => {
      const aName = a.pathParts ? a.pathParts[a.pathParts.length - 1] : a.name;
      const bName = b.pathParts ? b.pathParts[b.pathParts.length - 1] : b.name;
      return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
    });

    sortedDecks.forEach(sub => {
      this.renderDeckCard(container, sub);
    });

    if (sortedFolders.length === 0 && sortedDecks.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.style.cssText = 'grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem 1.5rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-color); border-radius: var(--radius-lg); margin-top: 1rem;';
      emptyState.innerHTML = `
        <span style="font-size: 3rem; margin-bottom: 1rem;">📭</span>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: white;">Aucun cours disponible</h3>
        <p style="color: var(--text-secondary); max-width: 400px; margin-bottom: 1.5rem; font-size: 0.95rem;">
          Vous n'avez pas encore importé de cours. Vous pouvez en importer gratuitement depuis la communauté ou importer vos propres fichiers CSV !
        </p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
          <button id="btn-empty-goto-community" class="btn-primary" style="font-size: 0.9rem; padding: 0.6rem 1.2rem;">🌐 Découvrir la Communauté</button>
          <button id="btn-empty-goto-import" class="btn-secondary" style="font-size: 0.9rem; padding: 0.6rem 1.2rem;">📥 Importer un fichier</button>
        </div>
      `;
      
      emptyState.querySelector('#btn-empty-goto-community').addEventListener('click', () => {
        this.switchView('community-view');
      });
      emptyState.querySelector('#btn-empty-goto-import').addEventListener('click', () => {
        this.switchView('csv-view');
      });
      
      container.appendChild(emptyState);
    }

    this.triggerMathJax();
  }

  renderDeckCard(container, sub) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    const qCount = sub.questions ? sub.questions.length : 0;
    let cleanName = sub.pathParts ? sub.pathParts[sub.pathParts.length - 1] : sub.name;
    // Remove [CSV] if present
    cleanName = cleanName.replace(/\[CSV\]/g, '').trim();

    const dMastery = StorageManager.getDeckMastery(sub);
    if (dMastery.borderStyle) card.style.border = dMastery.borderStyle;
    if (dMastery.boxShadow) card.style.boxShadow = dMastery.boxShadow;

    let checkboxHTML = '';
    if (this.isSelectMode) {
      const isSelected = this.selectedSubjects.has(sub.id);
      checkboxHTML = `<input type="checkbox" class="subject-checkbox" ${isSelected ? 'checked' : ''} style="transform: scale(1.5); cursor: pointer;">`;
      if (isSelected) {
        card.style.border = '2px solid var(--accent-cyan)';
        card.style.background = 'rgba(6, 182, 212, 0.1)';
      }
    }

    card.innerHTML = `
      <div>
        <div class="subject-header">
          <span class="subject-icon">${sub.icon || '📚'}</span>
          <div style="overflow: hidden; flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem;">
              <div style="display: flex; gap: 0.5rem; align-items: center; overflow: hidden;">
                ${checkboxHTML}
                <h3 class="subject-title" style="font-size: 1.1rem; word-break: break-word;">${cleanName}</h3>
              </div>
              <span class="level-badge" style="background: rgba(0,0,0,0.4); border: 1px solid ${dMastery.colorHex}; color: ${dMastery.colorHex}; font-size: 0.75rem; white-space: nowrap;">${dMastery.statusText}</span>
            </div>
            <span class="level-badge" style="background: rgba(255,255,255,0.1); color: var(--accent-cyan); font-size: 0.75rem;">${sub.category || 'Général'}</span>
          </div>
        </div>
        <p class="subject-desc">${sub.description || 'Défiez vos connaissances dans cette matière.'}</p>
      </div>
      <div class="subject-footer">
        <span>${qCount} Cartes</span>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; justify-content: flex-end;">
          <button class="btn-secondary btn-icon-deck" data-sub="${sub.id}" style="padding: 0.4rem 0.5rem; font-size: 0.8rem;" title="Changer l'icône">🎨</button>
          <button class="btn-secondary btn-rename-deck" data-sub="${sub.id}" style="padding: 0.4rem 0.5rem; font-size: 0.8rem;" title="Renommer">✏️</button>
          <button class="btn-secondary btn-organize-deck" data-sub="${sub.id}" style="padding: 0.4rem 0.5rem; font-size: 0.8rem;" title="Déplacer vers un dossier">⚙️ Organiser</button>
          <button class="btn-secondary btn-share-deck" data-sub="${sub.id}" style="padding: 0.4rem 0.5rem; font-size: 0.8rem;" title="Partager à la communauté">🌐</button>
          <button class="btn-secondary btn-delete-deck" data-sub="${sub.id}" style="padding: 0.4rem 0.5rem; font-size: 0.8rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);" title="Supprimer ce paquet">🗑️</button>
          <button class="btn-primary btn-start-quiz" data-sub="${sub.id}">Quiz ➔</button>
        </div>
      </div>
    `;

    if (this.isSelectMode) {
      card.addEventListener('click', (e) => {
        // Prevent toggle if clicking on buttons
        if (e.target.tagName === 'BUTTON') return;
        
        if (this.selectedSubjects.has(sub.id)) {
          this.selectedSubjects.delete(sub.id);
        } else {
          this.selectedSubjects.add(sub.id);
        }
        this.renderSubjects();
      });
    }

    card.querySelector('.btn-delete-deck').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Voulez-vous vraiment supprimer le paquet "${cleanName}" ?`)) {
        const subjects = StorageManager.getSubjects();
        delete subjects[sub.id];
        StorageManager.saveSubjects(subjects);
        this.renderSubjects();
      }
    });

    const btnShareDeck = card.querySelector('.btn-share-deck');
    if (btnShareDeck) {
      btnShareDeck.addEventListener('click', (e) => {
        e.stopPropagation();
        this.shareDeckToCommunity(sub.id);
      });
    }

    const btnRenameDeck = card.querySelector('.btn-rename-deck');
    if (btnRenameDeck) {
      btnRenameDeck.addEventListener('click', (e) => {
        e.stopPropagation();
        const newName = prompt('Nouveau nom pour ce paquet :', cleanName);
        if (newName && newName.trim() !== '') {
          const subjects = StorageManager.getSubjects();
          if (subjects[sub.id]) {
            if (subjects[sub.id].pathParts) {
              subjects[sub.id].pathParts[subjects[sub.id].pathParts.length - 1] = newName.trim();
            }
            subjects[sub.id].name = newName.trim();
            StorageManager.saveSubjects(subjects);
            this.renderSubjects();
          }
        }
      });
    }

    const btnIconDeck = card.querySelector('.btn-icon-deck');
    if (btnIconDeck) {
      btnIconDeck.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIcon = prompt('Nouvelle icône pour ce paquet (ex: 📚, 🔬) :', sub.icon || '📚');
        if (newIcon && newIcon.trim() !== '') {
          const subjects = StorageManager.getSubjects();
          if (subjects[sub.id]) {
            subjects[sub.id].icon = newIcon.trim();
            StorageManager.saveSubjects(subjects);
            this.renderSubjects();
          }
        }
      });
    }

    card.querySelector('.btn-start-quiz').addEventListener('click', (e) => {
      e.stopPropagation();
      this.startQuiz(sub.id, 'classic');
    });

    card.querySelector('.btn-organize-deck').addEventListener('click', (e) => {
      e.stopPropagation();
      const subjectName = sub.pathParts ? sub.pathParts[sub.pathParts.length - 1] : sub.name;
      this.openFolderSelector((newPathParts) => {
        sub.pathParts = newPathParts;
        const subjects = StorageManager.getSubjects();
        subjects[sub.id] = sub;
        StorageManager.saveSubjects(subjects);
        this.renderSubjects();
      }, subjectName);
    });

    container.appendChild(card);
  }

  async shareFolderToCommunity(folderName, decks) {
    const profile = StorageManager.getProfile();
    const author = profile.cloudAccount?.username || profile.name || 'Joueur Anonyme';

    if (!confirm(`Partager le dossier "${folderName}" (contenant ${decks.length} cours) à la communauté ?`)) return;

    const folderData = {
      is_folder: true,
      subjects: decks
    };

    const category = prompt(`Catégorie pour le dossier "${folderName}" :`, 'Général') || 'Général';
    
    // Check total size
    const jsonStr = JSON.stringify(folderData);
    if (jsonStr.length > 5000000) {
      alert("Le dossier est trop volumineux pour être partagé en une seule fois (max ~5MB).");
      return;
    }

    const btn = document.querySelector(`.btn-share-folder[data-folder="${folderName}"]`);
    if (btn) btn.textContent = '⏳...';

    const success = await submitCommunitySubject(folderName, author, category, folderData);
    
    if (success) {
      alert('Dossier soumis à la communauté avec succès ! Il sera disponible après validation.');
      if (btn) { btn.textContent = '✅'; btn.disabled = true; }
    } else {
      alert('Erreur lors de la soumission du dossier.');
      if (btn) btn.textContent = '🌐';
    }
  }

  async shareDeckToCommunity(subjectId) {
    const subjects = StorageManager.getSubjects();
    const sub = subjects[subjectId];
    if (!sub) return;

    const profile = StorageManager.getProfile();
    const author = profile.cloudAccount?.username || profile.name || 'Joueur Anonyme';
    const cleanName = (sub.pathParts ? sub.pathParts[sub.pathParts.length - 1] : sub.name).replace(/\[CSV\]/g, '').trim();

    if (!confirm(`Partager le cours "${cleanName}" (${sub.questions ? sub.questions.length : 0} questions) à la communauté ?`)) return;

    const category = prompt(`Catégorie pour "${cleanName}" :`, sub.category || 'Général') || 'Général';
    
    // Check total size
    const jsonStr = JSON.stringify(sub.questions || []);
    if (jsonStr.length > 5000000) {
      alert("Le cours est trop volumineux pour être partagé (max ~5MB).");
      return;
    }

    const btn = document.querySelector(`.btn-share-deck[data-sub="${subjectId}"]`);
    if (btn) btn.textContent = '⏳...';

    const success = await submitCommunitySubject(cleanName, author, category, sub.questions || []);
    
    if (success) {
      alert('Cours soumis à la communauté avec succès ! Il sera disponible après validation.');
      if (btn) { btn.textContent = '✅'; btn.disabled = true; }
    } else {
      alert('Erreur lors de la soumission du cours.');
      if (btn) btn.textContent = '🌐';
    }
  }

  async renderDuelsView() {
    const subjects = StorageManager.getSubjects();
    const select = document.getElementById('duel-subject-select');
    select.innerHTML = '';

    Object.values(subjects).forEach(sub => {
      select.innerHTML += `<option value="${sub.id}">${sub.name} (${sub.questions ? sub.questions.length : 0} cartes)</option>`;
    });

    const tbody = document.getElementById('leaderboard-tbody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; opacity: 0.6;">⏳ Chargement du classement mondial...</td></tr>';

    const leaderboard = await MultiplayerEngine.getLeaderboard();
    tbody.innerHTML = '';

    if (leaderboard.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; opacity: 0.6;">Aucun joueur encore — créez un Compte Cloud pour apparaître ici !</td></tr>';
      return;
    }

    leaderboard.forEach((player, idx) => {
      const tr = document.createElement('tr');
      if (player.isUser) tr.style.background = 'rgba(99, 102, 241, 0.2)';
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => this.openProfileModal(player));

      const rankBadge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
      const verificationBadge = player.isVerified === false
        ? '<span class="level-badge" style="font-size: 0.7rem; background: rgba(239, 68, 68, 0.3); color: var(--accent-red);">🚩 Non vérifié</span>'
        : '<span style="font-size: 0.85rem;" title="Score vérifié anti-triche">🛡️</span>';

      tr.innerHTML = `
        <td style="padding: 0.85rem 1rem; font-weight: 700;">${rankBadge}</td>
        <td style="padding: 0.85rem 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
          <span>${player.avatar || '🎓'}</span>
          <span>${player.name}</span>
          ${verificationBadge}
          ${player.isUser ? '<span class="level-badge" style="font-size: 0.7rem; background: var(--accent-purple);">Vous</span>' : ''}
        </td>
        <td style="padding: 0.85rem 1rem;">Niv. ${player.level}</td>
        <td style="padding: 0.85rem 1rem; color: var(--accent-amber); font-weight: 700;">${player.coins} 🪙</td>
        <td style="padding: 0.85rem 1rem; color: var(--accent-green); font-weight: 700;">${player.wins || 0}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  openProfileModal(player) {
    const modal = document.getElementById('modal-user-profile');
    if (!modal) return;
    
    document.getElementById('modal-profile-avatar').textContent = player.avatar || '🎓';
    document.getElementById('modal-profile-name').textContent = player.name || 'Inconnu';
    document.getElementById('modal-profile-level').textContent = `Niveau ${player.level || 1}`;
    
    const duels = player.total_duels || 0;
    const wins = player.wins || 0;
    const winrate = duels > 0 ? Math.round((wins / duels) * 100) : 0;
    
    document.getElementById('modal-profile-winrate').textContent = `${winrate}%`;
    document.getElementById('modal-profile-duels').textContent = duels;
    document.getElementById('modal-profile-streak').textContent = `${player.streak || 0} 🔥`;
    
    const badgesContainer = document.getElementById('modal-profile-badges');
    badgesContainer.innerHTML = '';
    const badges = player.badges || [];
    
    if (badges.length === 0) {
      badgesContainer.innerHTML = `<div style="padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border-radius: var(--radius-sm); border: 1px dashed var(--border-color); color: var(--text-secondary); font-size: 0.85rem; width: 100%; text-align: center;">Aucun badge débloqué pour l'instant.</div>`;
    } else {
      // Find badge icons from ACHIEVEMENTS in gamification.js or just display text
      badges.forEach(bId => {
        const ach = ACHIEVEMENTS.find(a => a.id === bId);
        const icon = ach ? ach.icon : '🏅';
        const title = ach ? ach.title : bId.split('_').pop();

        const badgeEl = document.createElement('div');
        badgeEl.style.padding = '0.3rem 0.6rem';
        badgeEl.style.background = 'rgba(255,255,255,0.1)';
        badgeEl.style.borderRadius = 'var(--radius-sm)';
        badgeEl.style.fontSize = '0.8rem';
        badgeEl.style.display = 'flex';
        badgeEl.style.alignItems = 'center';
        badgeEl.style.gap = '0.3rem';
        
        badgeEl.innerHTML = `<span>${icon}</span> <span>${title}</span>`;
        badgesContainer.appendChild(badgeEl);
      });
    }

    const addFriendBtn = document.getElementById('btn-modal-profile-add-friend');
    const myProfile = StorageManager.getProfile();
    const myUsername = myProfile.cloudAccount?.username;
    
    // Only show add friend if not viewing ourselves and we are logged in
    if (!player.isUser && myUsername) {
      addFriendBtn.style.display = 'block';
      
      // Hide button if already friends
      getFriends(myUsername).then(friends => {
        if (friends.some(f => f.username === player.name.toLowerCase())) {
          addFriendBtn.style.display = 'none';
        }
      });
      
      addFriendBtn.onclick = async () => {
        const friendUsername = player.name.toLowerCase();
        // Since leaderboard name might be display name, we rely on the fact that name in leaderboard currently IS the username.
        const sent = await sendFriendNotification(
          friendUsername, myUsername, myProfile.avatar || '🎓',
          'friend_request',
          { message: "Veut devenir ton ami !" }
        );
        if (sent) {
          alert('Demande d\'ami envoyée !');
          addFriendBtn.textContent = '✅ Envoyée';
          addFriendBtn.disabled = true;
          setTimeout(() => {
            addFriendBtn.textContent = '➕ Demander en ami';
            addFriendBtn.disabled = false;
            modal.classList.remove('active');
          }, 2000);
        }
      };
    } else {
      addFriendBtn.style.display = 'none';
    }

    modal.classList.add('active');
  }

  renderDailyQuestsModal() {
    const profile = StorageManager.getProfile();
    const quests = profile.dailyQuests || [];
    const container = document.getElementById('daily-quests-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (quests.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: var(--text-secondary);">Aucune mission pour le moment. Reviens demain !</div>';
      return;
    }
    
    quests.forEach(q => {
      const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
      const isDone = q.completed;
      
      const el = document.createElement('div');
      el.style.background = isDone ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)';
      el.style.border = `1px solid ${isDone ? 'var(--accent-green)' : 'var(--border-color)'}`;
      el.style.borderRadius = 'var(--radius-md)';
      el.style.padding = '1rem';
      
      el.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div style="font-weight: 600; color: ${isDone ? 'var(--accent-green)' : 'white'};">
            ${isDone ? '✅' : '🎯'} ${q.title}
          </div>
          <div style="font-size: 0.9rem; font-weight: 700; color: var(--accent-amber);">
            +${q.reward} 🪙
          </div>
        </div>
        <div style="background: rgba(0,0,0,0.4); border-radius: 10px; height: 8px; overflow: hidden; margin-bottom: 0.4rem;">
          <div style="background: ${isDone ? 'var(--accent-green)' : 'var(--accent-cyan)'}; width: ${pct}%; height: 100%; transition: width 0.3s ease;"></div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: right;">
          ${q.progress} / ${q.target}
        </div>
      `;
      container.appendChild(el);
    });
  }


  updatePausedBanner() {
    const container = document.getElementById('paused-banner-container');
    const info = document.getElementById('paused-banner-info');
    if (!container) return;

    const paused = StorageManager.getPausedSession();
    if (!paused) {
      container.style.display = 'none';
      return;
    }

    const subjects = StorageManager.getSubjects();
    const subName = subjects[paused.subjectId]?.name || 'Quiz';
    const m = Math.floor(Math.max(0, paused.sessionTimer) / 60);
    const s = Math.floor(Math.max(0, paused.sessionTimer) % 60);
    const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;

    if (info) {
      info.textContent = `Sujet : ${subName} • Score : ${paused.score || 0} Pts • Chrono restant : ${timeStr}`;
    }
    container.style.display = 'block';
  }

  saveAndExitQuizSession() {
    clearInterval(this.timerInterval);
    const session = this.quizEngine.currentSession;
    if (session) {
      StorageManager.savePausedSession(session);
    }
    this.quizEngine.currentSession = null;
    this.switchView('subjects-view');
  }

  resumeQuizSession() {
    const paused = StorageManager.getPausedSession() || this.quizEngine.currentSession;
    if (!paused) return;

    StorageManager.clearPausedSession();

    const currentQ = this.quizEngine.resumeSession(paused);
    const subjects = StorageManager.getSubjects();
    const sub = subjects[paused.subjectId];
    if (sub) {
      const badge = document.getElementById('quiz-subject-badge');
      if (badge) badge.textContent = sub.name;
    }

    this.switchView('quiz-view');
    this.renderCurrentQuestion(currentQ);
    this.startTimer();
  }

  discardPausedSession() {
    StorageManager.clearPausedSession();
    this.updatePausedBanner();
  }

  closeOverwriteModal() {
    const modal = document.getElementById('modal-confirm-overwrite');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.visibility = 'hidden';
    }
  }

  showDailyRewardPopup(rewardData) {
    document.getElementById('daily-reward-day').textContent = rewardData.streak;
    document.getElementById('daily-reward-text').textContent = rewardData.rewardText;

    const dayInWeek = rewardData.day; // 1 to 7
    const dotsContainer = document.getElementById('daily-reward-dots');
    dotsContainer.innerHTML = '';

    for (let i = 1; i <= 7; i++) {
      const dot = document.createElement('div');
      dot.style.width = '14px';
      dot.style.height = '14px';
      dot.style.borderRadius = '50%';
      dot.style.background = i <= dayInWeek ? 'var(--accent-amber)' : 'rgba(255,255,255,0.2)';
      dot.style.boxShadow = i === dayInWeek ? '0 0 10px var(--accent-amber)' : 'none';
      dot.style.position = 'relative';
      dot.style.zIndex = '3';
      
      const label = document.createElement('div');
      label.textContent = `J${i}`;
      label.style.position = 'absolute';
      label.style.top = '20px';
      label.style.left = '50%';
      label.style.transform = 'translateX(-50%)';
      label.style.fontSize = '0.7rem';
      label.style.color = i <= dayInWeek ? 'var(--text-light)' : 'rgba(255,255,255,0.5)';
      
      dot.appendChild(label);
      dotsContainer.appendChild(dot);
    }

    setTimeout(() => {
      const progressBar = document.getElementById('daily-reward-progress-bar');
      if (progressBar) {
        const percentage = ((dayInWeek - 1) / 6) * 100;
        progressBar.style.width = `${percentage}%`;
      }
    }, 100);

    document.getElementById('modal-daily-reward').classList.add('active');
  }

  startQuiz(subjectId, mode = 'classic', force = false) {
    const paused = StorageManager.getPausedSession();
    if (paused && !force) {
      this.pendingNewQuiz = { subjectId, mode };
      const modal = document.getElementById('modal-confirm-overwrite');
      if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
      }
      return;
    }

    if (force) {
      StorageManager.clearPausedSession();
      this.updatePausedBanner();
    }

    const subjects = StorageManager.getSubjects();
    const sub = subjects[subjectId];
    if (!sub || !sub.questions || sub.questions.length === 0) {
      alert('Aucune question disponible pour ce sujet.');
      return;
    }

    this.currentSubjectId = subjectId;

    const firstQuestion = this.quizEngine.startSession({
      subjectId: subjectId,
      questions: sub.questions,
      mode: mode,
      sessionTimerSeconds: 180 // 3 minutes = 180 seconds
    });

    const badge = document.getElementById('quiz-subject-badge');
    if (badge) badge.textContent = sub.name;

    this.switchView('quiz-view');
    this.renderCurrentQuestion(firstQuestion);
    this.startTimer();
  }

  renderCurrentQuestion(question) {
    if (!question) return;

    const container = document.getElementById('quiz-question-container');
    const optionsContainer = document.getElementById('quiz-options-container');
    const nextBtn = document.getElementById('quiz-next-btn');
    const saveExitBtn = document.getElementById('quiz-save-exit-btn');
    const expBox = document.getElementById('quiz-explanation-box');
    const dismissBtn = document.getElementById('quiz-dismiss-card-btn');

    if (nextBtn) nextBtn.style.display = 'none';
    if (saveExitBtn) saveExitBtn.style.display = 'none';
    if (expBox) expBox.style.display = 'none';
    if (dismissBtn) dismissBtn.style.display = 'none';

    const counter = document.getElementById('quiz-counter');
    if (counter) counter.textContent = `Question ${question.currentIndex + 1}`;
    
    const session = this.quizEngine.currentSession;
    
    // Hide timer and score elements if in revision mode
    const timerBox = document.querySelector('.timer-box');
    const progBarContainer = document.querySelector('.quiz-progress-bar');
    const scoreBadge = document.getElementById('quiz-score-badge');
    const statPill = scoreBadge ? scoreBadge.closest('.stat-pill') : null;

    if (session && session.mode === 'revision') {
      if (timerBox) timerBox.style.display = 'none';
      if (progBarContainer) progBarContainer.style.display = 'none';
      if (statPill) statPill.style.display = 'none';
    } else {
      if (timerBox) timerBox.style.display = 'flex';
      if (progBarContainer) progBarContainer.style.display = 'block';
      if (statPill) statPill.style.display = 'block';
      
      const sessionTimeLeft = session ? session.sessionTimer : 180;
      const fillPercent = Math.min(100, Math.max(0, (sessionTimeLeft / 180) * 100));
      const progressBar = document.getElementById('quiz-progress-fill') || document.getElementById('quiz-progress-bar');
      if (progressBar) progressBar.style.width = `${fillPercent}%`;
    }

    if (scoreBadge) {
      if (session && session.mode === 'revision') {
        scoreBadge.textContent = '';
      } else {
        scoreBadge.textContent = `${session?.score || 0} Pts`;
      }
    }

    const questionTextEl = document.getElementById('quiz-question-text');
    if (questionTextEl) questionTextEl.innerHTML = escapeHTML(question.question);

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      question.shuffledOptions.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.setAttribute('data-option', opt);
        if (question.disabledOptions.includes(opt)) {
          card.classList.add('disabled');
        }

        card.innerHTML = `<div class="option-card-content"><span class="opt-text">${escapeHTML(opt)}</span></div><span class="opt-check"></span>`;
        card.addEventListener('click', () => {
          if (card.classList.contains('disabled') || card.classList.contains('selected') || card.classList.contains('answered')) return;
          this.handleAnswerSelection(card, opt);
        });

        optionsContainer.appendChild(card);
      });
    }

    this.updatePowerupButtons();
    this.triggerMathJax();
  }

  handleAnswerSelection(selectedCard, selectedOption) {
    // If in duel mode, use duel-specific handler
    if (this.duelState) {
      this.handleDuelAnswer(selectedCard, selectedOption);
      return;
    }

    // Lock all options immediately so no second click or 2nd attempt is possible
    const allCards = document.querySelectorAll('.option-card');
    allCards.forEach(c => {
      c.classList.add('answered');
      c.style.pointerEvents = 'none';
    });

    clearInterval(this.timerInterval);
    const result = this.quizEngine.submitAnswer(selectedOption);
    const targetCard = (selectedCard && selectedCard.closest) ? selectedCard.closest('.option-card') : selectedCard;

    if (result.wasCorrect) {
      if (targetCard) {
        targetCard.classList.add('correct');
        targetCard.style.setProperty('background-color', 'rgba(16, 185, 129, 0.4)', 'important');
        targetCard.style.setProperty('border', '3px solid #10b981', 'important');
        targetCard.style.setProperty('box-shadow', '0 0 25px rgba(16, 185, 129, 0.7)', 'important');
        targetCard.style.setProperty('color', '#ffffff', 'important');
        const checkEl = targetCard.querySelector('.opt-check');
        if (checkEl) checkEl.textContent = '✓';
      }
    } else {
      if (targetCard) {
        targetCard.classList.add('wrong');
        targetCard.style.setProperty('background-color', 'rgba(239, 68, 68, 0.5)', 'important');
        targetCard.style.setProperty('border', '3px solid #ef4444', 'important');
        targetCard.style.setProperty('box-shadow', '0 0 25px rgba(239, 68, 68, 0.8)', 'important');
        targetCard.style.setProperty('color', '#ffffff', 'important');
        const checkEl = targetCard.querySelector('.opt-check');
        if (checkEl) checkEl.textContent = '❌';

        // Append explicit red wrong text inside card content
        const contentEl = targetCard.querySelector('.option-card-content');
        if (contentEl && !contentEl.querySelector('.wrong-tag')) {
          const tag = document.createElement('div');
          tag.className = 'wrong-tag';
          tag.style.cssText = 'color: #fca5a5; font-size: 0.85rem; font-weight: 700; margin-top: 0.35rem;';
          tag.textContent = '❌ Votre réponse (Incorrecte -5 pts)';
          contentEl.appendChild(tag);
        }
      }

      // Highlight exact correct answer in vibrant green
      allCards.forEach(c => {
        const optVal = c.getAttribute('data-option');
        if (optVal === result.correctAnswer) {
          c.classList.add('correct');
          c.style.setProperty('background-color', 'rgba(16, 185, 129, 0.4)', 'important');
          c.style.setProperty('border', '3px solid #10b981', 'important');
          c.style.setProperty('box-shadow', '0 0 25px rgba(16, 185, 129, 0.7)', 'important');
          c.style.setProperty('color', '#ffffff', 'important');
          const checkEl = c.querySelector('.opt-check');
          if (checkEl) checkEl.textContent = '✓';

          const contentEl = c.querySelector('.option-card-content');
          if (contentEl && !contentEl.querySelector('.correct-tag')) {
            const tag = document.createElement('div');
            tag.className = 'correct-tag';
            tag.style.cssText = 'color: #6ee7b7; font-size: 0.85rem; font-weight: 700; margin-top: 0.35rem;';
            tag.textContent = '✅ Bonne réponse';
            contentEl.appendChild(tag);
          }
        }
      });
    }

    // Update live score badge immediately (-5 pts applied, min 0)
    const scoreBadge = document.getElementById('quiz-score-badge');
    if (scoreBadge) scoreBadge.textContent = `${this.quizEngine.currentSession?.score || 0} Pts`;

    this.updateHeaderStats();

    // Render explanation box reliably using result object
    const expBox = document.getElementById('quiz-explanation-box');
    const expText = document.getElementById('quiz-explanation-text');
    if (expBox && expText) {
      if (result.explanation && result.explanation.trim()) {
        expText.innerHTML = escapeHTML(result.explanation);
        expBox.style.setProperty('display', 'block', 'important');
        expBox.style.setProperty('visibility', 'visible', 'important');
        expBox.style.setProperty('opacity', '1', 'important');
        this.triggerMathJax();
      }
    }

    const saveExitBtn = document.getElementById('quiz-save-exit-btn');
    if (saveExitBtn) saveExitBtn.style.display = 'inline-block';

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.style.display = 'inline-block';
      nextBtn.onclick = () => {
        if (result.isFinished) {
          this.showResults(result.summary);
        } else {
          this.renderCurrentQuestion(result.nextQuestion);
          this.startTimer();
        }
      };
    }

    const dismissBtn = document.getElementById('quiz-dismiss-card-btn');
    if (dismissBtn) {
      dismissBtn.style.display = 'inline-block';
      dismissBtn.onclick = () => {
        const currentSession = this.quizEngine.currentSession;
        const currentQ = currentSession?.questions?.[currentSession.currentIndex - 1];
        if (currentQ) {
          StorageManager.dismissCard(currentQ.id, currentQ.question);
        }
        if (result.isFinished) {
          this.showResults(result.summary);
        } else {
          this.renderCurrentQuestion(result.nextQuestion);
          this.startTimer();
        }
      };
    }
  }

  async resolveAbandonedBattles() {
    const profile = StorageManager.getProfile();
    const myUsername = profile.cloudAccount?.username || profile.name;
    const db = MultiplayerEngine._getDB();
    if (!db) return;

    // Check for battles older than 5 minutes where we were involved
    const fiveMinsAgo = new Date(Date.now() - 5 * 60000).toISOString();

    const { data: battles } = await db.from('battles')
      .select('*')
      .or(`player1_id.eq.${myUsername},player2_id.eq.${myUsername}`)
      .in('status', ['waiting', 'finished'])
      .lt('created_at', fiveMinsAgo);

    if (!battles || battles.length === 0) return;

    let claimedBattles = JSON.parse(localStorage.getItem('remix_claimed_battles') || '[]');
    let resolvedAny = false;

    for (const b of battles) {
      if (claimedBattles.includes(b.id)) continue;
      
      if (!b.player2_id) {
        // Abandoned matchmaking queue, refund wager
        if (b.player1_id === myUsername && b.wager > 0) {
          profile.totalCoinsEarned = (profile.totalCoinsEarned || 0) + b.wager;
          profile.coins = Math.max(0, profile.totalCoinsEarned - (profile.totalCoinsSpent || 0));
          resolvedAny = true;
        }
        claimedBattles.push(b.id);
        continue;
      }

      const myScore = b.player1_id === myUsername ? b.player1_score : b.player2_score;
      const oppScore = b.player1_id === myUsername ? b.player2_score : b.player1_score;

      // resolveDuel automatically gives the reward to profile
      MultiplayerEngine.resolveDuel(b.wager || 0, myScore, oppScore);
      claimedBattles.push(b.id);
      resolvedAny = true;
    }

    if (resolvedAny) {
      localStorage.setItem('remix_claimed_battles', JSON.stringify(claimedBattles));
      this.updateHeaderStats();
    }
  }

  // === DUEL METHODS ===

  showDuelScreen(screen) {
    const screens = ['duel-menu-screen', 'duel-matchmaking-screen', 'duel-lobby-screen', 'duel-results-screen'];
    screens.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const leaderboard = document.getElementById('duel-leaderboard-section');

    switch (screen) {
      case 'menu':
        document.getElementById('duel-menu-screen').style.display = 'block';
        if (leaderboard) leaderboard.style.display = 'block';
        break;
      case 'matchmaking':
        document.getElementById('duel-matchmaking-screen').style.display = 'block';
        if (leaderboard) leaderboard.style.display = 'none';
        break;
      case 'lobby':
        document.getElementById('duel-lobby-screen').style.display = 'block';
        if (leaderboard) leaderboard.style.display = 'none';
        break;
      case 'results':
        document.getElementById('duel-results-screen').style.display = 'block';
        if (leaderboard) leaderboard.style.display = 'none';
        break;
    }
  }

  enterDuelLobby(battle, existingChannel = null) {
    if (this.matchmakingPollInterval) {
      clearInterval(this.matchmakingPollInterval);
      this.matchmakingPollInterval = null;
    }

    const profile = StorageManager.getProfile();
    const myUsername = profile.cloudAccount?.username || profile.name;
    const playerNum = battle.player1_id === myUsername ? 1 : 2;

    // Deduct wager now for joining player
    if (battle.wager > 0) {
      profile.totalCoinsSpent = (profile.totalCoinsSpent ?? 0) + battle.wager;
      profile.coins = Math.max(0, (profile.totalCoinsEarned ?? profile.coins ?? 50) - profile.totalCoinsSpent);
      StorageManager.saveProfile(profile);
      this.updateHeaderStats();
    }

    // Setup or reuse channel
    const channel = existingChannel || (this.duelState?.channel) || MultiplayerEngine.subscribeToBattle(battle.id, {});

    // Remove old listeners and re-subscribe with full callbacks
    if (channel) {
      channel.unsubscribe();
    }

    const fullChannel = MultiplayerEngine.subscribeToBattle(battle.id, {
      onPlayerReady: async (data) => {
        const readyEl = data.playerNum === 1 ? document.getElementById('lobby-p1-ready') : document.getElementById('lobby-p2-ready');
        if (readyEl) { readyEl.textContent = '✅ Prêt !'; readyEl.style.color = 'var(--accent-green)'; }

        // Check if both ready
        const b = await MultiplayerEngine.getBattle(battle.id);
        if (b && b.player1_ready && b.player2_ready) {
          this.startDuelCountdown();
        }
      },
      onScoreUpdate: (data) => {
        if (!this.duelState) return;
        const oppField = this.duelState.playerNum === 1 ? 'p2Score' : 'p1Score';
        this.duelState.oppScore = data[oppField] || data.score || 0;
        const oppScoreEl = document.getElementById('duel-hud-p2-score');
        if (oppScoreEl) oppScoreEl.textContent = this.duelState.oppScore;
      },
      onEmote: (data) => {
        this.displayReceivedEmote(data.emoji);
      },
      onPlayerFinished: (data) => {
        if (!this.duelState) return;
        this.duelState.oppFinished = true;
        this.duelState.oppScore = Math.max(this.duelState.oppScore, data.finalScore || 0);
        
        // If we are ALSO finished, resolve the duel now
        if (this.quizEngine.currentSession && this.quizEngine.currentSession.isFinished && !this.duelState.resolved) {
          this.resolveDuelAndShowResults();
        }
      },
      onPlayerLeftLobby: (data) => {
        if (!this.duelState || this.duelState.started) return;
        alert("L'adversaire s'est déconnecté du salon.");
        MultiplayerEngine.cancelMatchmaking(this.duelState.battleId);
        if (this.duelState.channel) this.duelState.channel.unsubscribe();
        this.duelState = null;
        this.showDuelScreen('menu');
      },
      onPlayerAbandoned: (data) => {
        if (!this.duelState || this.duelState.resolved) return;
        alert("L'adversaire a abandonné le combat !");
        this.duelState.oppFinished = true;
        
        // Force the resolution if we were already waiting
        if (this.quizEngine.currentSession && this.quizEngine.currentSession.isFinished) {
          this.resolveDuelAndShowResults();
        }
      },
      onBattleFinished: (data) => {
        if (!this.duelState || this.duelState.resolved) return;
        this.resolveDuelAndShowResults();
      }
    });

    this.duelState = {
      battleId: battle.id,
      channel: fullChannel,
      playerNum,
      battle,
      myScore: 0,
      oppScore: 0,
      oppFinished: false,
      resolved: false,
      questionIndex: 0,
      questions: battle.questions_data || []
    };

    // Update lobby UI
    this.showDuelScreen('lobby');
    document.getElementById('lobby-p1-avatar').textContent = battle.player1_avatar || '🎓';
    document.getElementById('lobby-p1-name').textContent = battle.player1_name;
    document.getElementById('lobby-p2-avatar').textContent = battle.player2_avatar || '⚔️';
    document.getElementById('lobby-p2-name').textContent = battle.player2_name || 'Adversaire';
    document.getElementById('lobby-room-code').textContent = battle.code;
    document.getElementById('lobby-subject-name').textContent = battle.subject_name;

    if (battle.wager > 0) {
      document.getElementById('lobby-pot-badge').textContent = `Pot : ${battle.wager * 2} 🪙`;
    } else {
      document.getElementById('lobby-pot-badge').textContent = 'Mode Amical';
    }

    // Reset ready states
    document.getElementById('lobby-p1-ready').textContent = '⏳ En attente...';
    document.getElementById('lobby-p1-ready').style.color = 'var(--text-secondary)';
    document.getElementById('lobby-p2-ready').textContent = '⏳ En attente...';
    document.getElementById('lobby-p2-ready').style.color = 'var(--text-secondary)';

    const readyBtn = document.getElementById('btn-duel-ready');
    if (readyBtn) { readyBtn.disabled = false; readyBtn.textContent = '✅ Je suis Prêt !'; }
  }

  startDuelCountdown() {
    const overlay = document.getElementById('duel-countdown-overlay');
    const numEl = document.getElementById('countdown-number');
    if (!overlay || !numEl) { this.startDuelBattle(); return; }

    overlay.style.display = 'flex';
    let count = 3;
    numEl.textContent = count;
    numEl.style.animation = 'countdownPulse 0.8s ease-out';

    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        numEl.textContent = count;
        numEl.style.animation = 'none';
        void numEl.offsetWidth; // trigger reflow
        numEl.style.animation = 'countdownPulse 0.8s ease-out';
      } else if (count === 0) {
        numEl.textContent = 'GO !';
        numEl.style.color = 'var(--accent-green)';
        numEl.style.animation = 'none';
        void numEl.offsetWidth;
        numEl.style.animation = 'countdownPulse 0.8s ease-out';
      } else {
        clearInterval(countInterval);
        overlay.style.display = 'none';
        numEl.style.color = 'white';
        this.startDuelBattle();
      }
    }, 1000);
  }

  startDuelBattle() {
    if (!this.duelState || !this.duelState.questions.length) return;

    const battle = this.duelState.battle;
    const profile = StorageManager.getProfile();

    // Start a quiz session with duel mode
    this.quizEngine.startSession({
      subjectId: battle.subject_id,
      questions: this.duelState.questions,
      mode: 'duel',
      sessionTimerSeconds: 180
    });

    // Switch to quiz view
    document.getElementById('quiz-subject-badge').textContent = `⚔️ DUEL (${battle.code})`;
    this.switchView('quiz-view');

    // Hide normal quiz controls, inject duel HUD
    const saveBtn = document.getElementById('quiz-save-exit-btn');
    if (saveBtn) saveBtn.style.display = 'none';
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.style.display = 'none';

    // Inject duel HUD at the top of quiz-view
    const quizView = document.getElementById('quiz-view');
    if (quizView) {
      const hudTemplate = document.getElementById('duel-hud-template');
      if (hudTemplate) {
        const hud = hudTemplate.content.cloneNode(true);
        // Insert right after the top bar
        const topBar = quizView.querySelector('div');
        if (topBar) {
          quizView.insertBefore(hud, topBar.nextSibling);
        } else {
          quizView.insertBefore(hud, quizView.firstChild);
        }
      }
    }

    // Set HUD player info
    const myName = this.duelState.playerNum === 1 ? battle.player1_name : battle.player2_name;
    const myAvatar = this.duelState.playerNum === 1 ? battle.player1_avatar : battle.player2_avatar;
    const oppName = this.duelState.playerNum === 1 ? battle.player2_name : battle.player1_name;
    const oppAvatar = this.duelState.playerNum === 1 ? battle.player2_avatar : battle.player1_avatar;

    const setEl = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    setEl('duel-hud-p1-avatar', myAvatar || '🎓');
    setEl('duel-hud-p1-name', myName);
    setEl('duel-hud-p1-score', '0');
    setEl('duel-hud-p2-avatar', oppAvatar || '⚔️');
    setEl('duel-hud-p2-name', oppName);
    setEl('duel-hud-p2-score', '0');

    // Populate emoji bar from owned/free shop emojis and exclusive emojis
    const emojiBar = document.getElementById('duel-emoji-bar');
    if (emojiBar) {
      emojiBar.innerHTML = '';
      const profile = StorageManager.getProfile();
      
      const ownedShopEmojis = SHOP_ITEMS.filter(item => 
        item.type === 'emoji' && (item.cost === 0 || profile.purchasedItems.includes(item.id))
      );
      
      const ownedExclusiveEmojis = EXCLUSIVE_EMOJIS.filter(item =>
        profile.purchasedItems.includes(item.id)
      ).map(item => ({ icon: item.emoji, title: item.label }));
      
      const allOwnedEmojis = [...ownedShopEmojis, ...ownedExclusiveEmojis];

      allOwnedEmojis.forEach(em => {
        const btn = document.createElement('button');
        btn.className = 'duel-emoji-btn';
        btn.textContent = em.icon;
        btn.title = em.title;
        btn.addEventListener('click', () => {
          if (this.duelState?.channel) {
            MultiplayerEngine.broadcastEvent(this.duelState.channel, 'emote', { emoji: em.icon, label: em.title });
            // Show own emote briefly
            this.displayReceivedEmote(em.icon, true);
          }
        });
        emojiBar.appendChild(btn);
      });
    }

    // Render first question
    this.duelState.questionIndex = 0;
    this.duelState.myScore = 0;
    this.duelState.oppScore = 0;
    this.renderCurrentQuestion(this.quizEngine.getCurrentQuestion());

    // Start duel timer (does NOT pause on answer)
    this.startTimer();
  }

  handleDuelAnswer(selectedCard, selectedOption) {
    if (!this.duelState) return;

    // Lock all options
    const allCards = document.querySelectorAll('.option-card');
    allCards.forEach(c => { c.classList.add('answered'); c.style.pointerEvents = 'none'; });

    // DO NOT pause the timer in duel mode
    const result = this.quizEngine.submitAnswer(selectedOption);
    const targetCard = (selectedCard && selectedCard.closest) ? selectedCard.closest('.option-card') : selectedCard;

    // Visual feedback (correct/wrong) — quick, no explanation
    if (result.wasCorrect) {
      if (targetCard) {
        targetCard.classList.add('correct');
        targetCard.style.setProperty('background-color', 'rgba(16, 185, 129, 0.4)', 'important');
        targetCard.style.setProperty('border', '3px solid #10b981', 'important');
        targetCard.style.setProperty('box-shadow', '0 0 25px rgba(16, 185, 129, 0.7)', 'important');
        targetCard.style.setProperty('color', '#ffffff', 'important');
        const checkEl = targetCard.querySelector('.opt-check');
        if (checkEl) checkEl.textContent = '✓';
      }
      SoundFX.playCorrect();
    } else {
      if (targetCard) {
        targetCard.classList.add('wrong');
        targetCard.style.setProperty('background-color', 'rgba(239, 68, 68, 0.5)', 'important');
        targetCard.style.setProperty('border', '3px solid #ef4444', 'important');
        targetCard.style.setProperty('box-shadow', '0 0 25px rgba(239, 68, 68, 0.8)', 'important');
        targetCard.style.setProperty('color', '#ffffff', 'important');
        const checkEl = targetCard.querySelector('.opt-check');
        if (checkEl) checkEl.textContent = '❌';

        const contentEl = targetCard.querySelector('.option-card-content');
        if (contentEl && !contentEl.querySelector('.wrong-tag')) {
          const tag = document.createElement('div');
          tag.className = 'wrong-tag';
          tag.style.cssText = 'color: #fca5a5; font-size: 0.85rem; font-weight: 700; margin-top: 0.35rem;';
          tag.textContent = '❌ Votre réponse (Incorrecte -5 pts)';
          contentEl.appendChild(tag);
        }
      }
      SoundFX.playWrong();

      // Show correct answer
      allCards.forEach(c => {
        if (c.getAttribute('data-option') === result.correctAnswer) {
          c.classList.add('correct');
          c.style.setProperty('background-color', 'rgba(16, 185, 129, 0.4)', 'important');
          c.style.setProperty('border', '3px solid #10b981', 'important');
          c.style.setProperty('box-shadow', '0 0 25px rgba(16, 185, 129, 0.7)', 'important');
          c.style.setProperty('color', '#ffffff', 'important');
          const checkEl = c.querySelector('.opt-check');
          if (checkEl) checkEl.textContent = '✓';

          const contentEl = c.querySelector('.option-card-content');
          if (contentEl && !contentEl.querySelector('.correct-tag')) {
            const tag = document.createElement('div');
            tag.className = 'correct-tag';
            tag.style.cssText = 'color: #6ee7b7; font-size: 0.85rem; font-weight: 700; margin-top: 0.35rem;';
            tag.textContent = '✅ Bonne réponse';
            contentEl.appendChild(tag);
          }
        }
      });
    }

    this.triggerMathJax();

    // Update duel score
    this.duelState.myScore = this.quizEngine.currentSession?.score || 0;

    // Update HUD
    const myScoreEl = document.getElementById('duel-hud-p1-score');
    if (myScoreEl) myScoreEl.textContent = this.duelState.myScore;

    // Broadcast score to opponent
    const scoreField = this.duelState.playerNum === 1 ? 'p1Score' : 'p2Score';
    MultiplayerEngine.broadcastEvent(this.duelState.channel, 'score_update', {
      [scoreField]: this.duelState.myScore,
      score: this.duelState.myScore
    });

    // Update DB score
    MultiplayerEngine.updateScore(this.duelState.battleId, this.duelState.playerNum, this.duelState.myScore);

    // Auto-advance after 2 seconds
    this.duelState.questionIndex++;
    setTimeout(() => {
      if (!this.duelState) return;

      if (result.isFinished) {
        this.endDuel();
      } else {
        const nextQ = this.quizEngine.getCurrentQuestion();
        if (nextQ) {
          this.renderCurrentQuestion(nextQ);
        } else {
          this.endDuel();
        }
      }
    }, 2000);
  }

  async endDuel(isTimeUp = false) {
    if (!this.duelState) return;
    clearInterval(this.timerInterval);

    // Finish the quiz session
    if (this.quizEngine.currentSession) {
      this.quizEngine.finishSession();
    }

    // Mark battle as finished
    await MultiplayerEngine.finishBattle(this.duelState.battleId);

    // Broadcast finished
    MultiplayerEngine.broadcastEvent(this.duelState.channel, 'player_finished', {
      playerNum: this.duelState.playerNum,
      finalScore: this.duelState.myScore
    });

    if (!this.duelState.oppFinished && !isTimeUp) {
      this.switchView('duels-view');
      this.showDuelScreen('matchmaking');
      document.getElementById('matchmaking-status-text').textContent = 'En attente de l\'adversaire...';
      
      // Dynamic timeout based on remaining time for the opponent
      const remainingTimeMs = this.quizEngine.currentSession ? (this.quizEngine.currentSession.sessionTimer * 1000) : 180000;
      const waitTime = Math.max(15000, remainingTimeMs + 5000); // Give them at least 15s, or their timer + 5s
      
      setTimeout(() => {
        if (this.duelState && !this.duelState.resolved) {
          this.resolveDuelAndShowResults();
        }
      }, waitTime);
      
      return;
    }

    this.resolveDuelAndShowResults();
  }

  async resolveDuelAndShowResults() {
    if (!this.duelState || this.duelState.resolved) return;
    this.duelState.resolved = true;

    // Fetch latest from DB to catch any missed updates (e.g. disconnects)
    const finalBattle = await MultiplayerEngine.getBattle(this.duelState.battleId);
    if (finalBattle) {
      const oppField = this.duelState.playerNum === 1 ? 'player2_score' : 'player1_score';
      this.duelState.oppScore = Math.max(this.duelState.oppScore, finalBattle[oppField] || 0);
    }

    MultiplayerEngine.broadcastEvent(this.duelState.channel, 'battle_finished', {
      player1_score: this.duelState.playerNum === 1 ? this.duelState.myScore : this.duelState.oppScore,
      player2_score: this.duelState.playerNum === 2 ? this.duelState.myScore : this.duelState.oppScore
    });

    // Resolve duel (coins, stats)
    const duelResult = MultiplayerEngine.resolveDuel(
      this.duelState.battle.wager || 0,
      this.duelState.myScore,
      this.duelState.oppScore
    );

    // Update daily quests
    const profile = StorageManager.getProfile();
    GamificationEngine.updateDailyQuests(profile, 'duels', 1);
    if (duelResult.result === 'VICTORY') {
      GamificationEngine.updateDailyQuests(profile, 'duel_win', 1);
    }

    // Remove HUD elements
    const hud = document.getElementById('duel-hud');
    if (hud) hud.remove();
    const emojiBar = document.getElementById('duel-emoji-bar');
    if (emojiBar) emojiBar.remove();
    const emotesReceived = document.getElementById('duel-emotes-received');
    if (emotesReceived) emotesReceived.remove();

    // Show results
    this.showDuelResults(duelResult);
  }

  showDuelResults(duelResult) {
    this.switchView('duels-view');
    this.showDuelScreen('results');
    this.updateHeaderStats();

    const battle = this.duelState?.battle;
    const playerNum = this.duelState?.playerNum || 1;

    // Set result emoji and title
    const resultEmoji = document.getElementById('duel-result-emoji');
    const resultTitle = document.getElementById('duel-result-title');

    if (duelResult.result === 'VICTORY') {
      if (resultEmoji) resultEmoji.textContent = '🏆';
      if (resultTitle) { resultTitle.textContent = 'VICTOIRE !'; resultTitle.style.color = 'var(--accent-green)'; }
    } else if (duelResult.result === 'DEFEAT') {
      if (resultEmoji) resultEmoji.textContent = '💀';
      if (resultTitle) { resultTitle.textContent = 'DÉFAITE...'; resultTitle.style.color = 'var(--accent-red)'; }
    } else {
      if (resultEmoji) resultEmoji.textContent = '🤝';
      if (resultTitle) { resultTitle.textContent = 'ÉGALITÉ !'; resultTitle.style.color = 'var(--accent-amber)'; }
    }

    // Set scores
    const myName = battle ? (playerNum === 1 ? battle.player1_name : battle.player2_name) : 'Vous';
    const myAvatar = battle ? (playerNum === 1 ? battle.player1_avatar : battle.player2_avatar) : '🎓';
    const oppName = battle ? (playerNum === 1 ? battle.player2_name : battle.player1_name) : 'Adversaire';
    const oppAvatar = battle ? (playerNum === 1 ? battle.player2_avatar : battle.player1_avatar) : '⚔️';

    document.getElementById('duel-res-p1-avatar').textContent = myAvatar || '🎓';
    document.getElementById('duel-res-p1-name').textContent = myName;
    document.getElementById('duel-res-p1-score').textContent = duelResult.myScore;
    document.getElementById('duel-res-p2-avatar').textContent = oppAvatar || '⚔️';
    document.getElementById('duel-res-p2-name').textContent = oppName;
    document.getElementById('duel-res-p2-score').textContent = duelResult.oppScore;

    // Coins banner
    const coinsBanner = document.getElementById('duel-res-coins-banner');
    if (coinsBanner) {
      if (duelResult.result === 'VICTORY' && duelResult.wager > 0) {
        coinsBanner.textContent = `+${duelResult.coinsEarned} 🪙 (Pot gagné !)`;
        coinsBanner.style.borderColor = 'var(--accent-green)';
        coinsBanner.style.background = 'rgba(16, 185, 129, 0.15)';
        coinsBanner.style.color = '#6ee7b7';
      } else if (duelResult.result === 'DEFEAT' && duelResult.wager > 0) {
        coinsBanner.textContent = `-${duelResult.wager} 🪙 (Pari perdu)`;
        coinsBanner.style.borderColor = 'var(--accent-red)';
        coinsBanner.style.background = 'rgba(239, 68, 68, 0.15)';
        coinsBanner.style.color = '#fca5a5';
      } else if (duelResult.result === 'DRAW' && duelResult.wager > 0) {
        coinsBanner.textContent = `+${duelResult.wager} 🪙 (Remboursé)`;
        coinsBanner.style.borderColor = 'var(--accent-amber)';
        coinsBanner.style.background = 'rgba(245, 158, 11, 0.15)';
        coinsBanner.style.color = '#fbbf24';
      } else {
        coinsBanner.textContent = 'Match Amical — pas de pari';
        coinsBanner.style.borderColor = 'var(--border-color)';
        coinsBanner.style.background = 'rgba(255,255,255,0.03)';
        coinsBanner.style.color = 'var(--text-secondary)';
      }
    }
  }

  displayReceivedEmote(emoji, isSelf = false) {
    const container = document.getElementById('duel-emotes-received');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = 'emote-bubble';
    bubble.textContent = emoji;
    if (isSelf) bubble.style.opacity = '0.5';
    container.appendChild(bubble);

    // Fade out after 2.5s, remove after 3s
    setTimeout(() => bubble.classList.add('fade-out'), 2500);
    setTimeout(() => bubble.remove(), 3000);
  }

  cleanupDuel() {
    if (this.matchmakingPollInterval) {
      clearInterval(this.matchmakingPollInterval);
      this.matchmakingPollInterval = null;
    }
    if (this.duelState?.channel) {
      this.duelState.channel.unsubscribe();
    }
    clearInterval(this.timerInterval);

    // Remove HUD elements if they exist
    const hud = document.getElementById('duel-hud');
    if (hud) hud.remove();
    const emojiBar = document.getElementById('duel-emoji-bar');
    if (emojiBar) emojiBar.remove();
    const emotesReceived = document.getElementById('duel-emotes-received');
    if (emotesReceived) emotesReceived.remove();

    this.duelState = null;
    this.updateHeaderStats();
  }

  startRevisionQuiz() {
    const revisionItems = StorageManager.getRevisionItems();
    if (!revisionItems || revisionItems.length === 0) {
      alert("Vous n'avez aucune question loupée à réviser pour le moment ! Jouez des parties pour accumuler des erreurs.");
      return;
    }

    // Mélanger et limiter à 20 questions maximum
    const questionsToPlay = [...revisionItems].sort(() => Math.random() - 0.5).slice(0, 20);

    this.currentSubjectId = 'revision_global';
    
    try {
      this.quizEngine.startSession({
        subjectId: 'revision_global',
        questions: questionsToPlay,
        mode: 'revision',
        sessionTimerSeconds: 180
      });
      this.switchView('quiz-view');
      this.renderCurrentQuestion(this.quizEngine.getCurrentQuestion());
      this.startTimer();
    } catch (e) {
      alert(e.message);
    }
  }

  startTimer() {
    clearInterval(this.timerInterval);
    const session = this.quizEngine.currentSession;
    if (!session) return;
    
    // Do not start timer in revision mode
    if (session.mode === 'revision') return;

    const timerEl = document.getElementById('quiz-timer');

    this.timerInterval = setInterval(() => {
      if (session.sessionTimer !== undefined) {
        session.sessionTimer -= 1;
        const m = Math.floor(Math.max(0, session.sessionTimer) / 60);
        const s = Math.floor(Math.max(0, session.sessionTimer) % 60);
        const timeStr = `⏱️ ${m}:${s < 10 ? '0' : ''}${s}`;

        if (timerEl) timerEl.textContent = timeStr;

        const fillPercent = Math.min(100, Math.max(0, (session.sessionTimer / 180) * 100));
        const progressBar = document.getElementById('quiz-progress-fill') || document.getElementById('quiz-progress-bar');
        if (progressBar) progressBar.style.width = `${fillPercent}%`;

        if (session.sessionTimer <= 0) {
          clearInterval(this.timerInterval);
          if (this.duelState) {
            this.endDuel(true);
          } else {
            this.showResults(this.quizEngine.finishSession());
          }
        }
      }
    }, 1000);
  }

  updatePowerupButtons() {
    const profile = StorageManager.getProfile();
    const inv = profile.inventory || {};

    const elFifty = document.getElementById('pu-count-fifty');
    if (elFifty) elFifty.textContent = inv.powerup_fifty || 0;



    const elSkip = document.getElementById('pu-count-skip');
    if (elSkip) elSkip.textContent = inv.powerup_skip || 0;
  }

  showResults(summary) {
    if (!summary) return;
    this.switchView('results-view');
    this.updateHeaderStats();

    // Update daily quests
    const profile = StorageManager.getProfile();
    GamificationEngine.updateDailyQuests(profile, 'sessions', 1);
    if (summary.totalQuestions > 0 && summary.correctAnswers === summary.totalQuestions) {
      GamificationEngine.updateDailyQuests(profile, 'perfect', 1);
    }

    document.getElementById('res-score').textContent = summary.score;
    document.getElementById('res-accuracy').textContent = `${summary.accuracy}%`;
    document.getElementById('res-xp').textContent = `+${summary.xpEarned} XP`;
    document.getElementById('res-coins').textContent = `+${summary.coinsEarned} 🪙`;

    const masteryBanner = document.getElementById('res-progression-banner');
    const deltaVal = summary.accuracy >= 70 ? `+${Math.round(summary.accuracy * 0.25)}%` : `-${Math.round((100 - summary.accuracy) * 0.2)}%`;
    const deltaColor = summary.accuracy >= 70 ? '#6ee7b7' : '#fca5a5';

    masteryBanner.style.borderColor = summary.accuracy >= 70 ? 'var(--accent-green)' : 'var(--accent-red)';
    masteryBanner.innerHTML = `📈 Évolution de la Maîtrise : <span style="color: ${deltaColor}; font-weight: 800;">${deltaVal}</span> (${summary.accuracy}% de précision sur cette session)`;

    const levelupEl = document.getElementById('res-levelup-banner');
    levelupEl.style.display = summary.leveledUp ? 'block' : 'none';

    let unverifiedBanner = document.getElementById('res-unverified-banner');
    if (!unverifiedBanner) {
      unverifiedBanner = document.createElement('div');
      unverifiedBanner.id = 'res-unverified-banner';
      unverifiedBanner.style.padding = '0.75rem';
      unverifiedBanner.style.marginTop = '1rem';
      unverifiedBanner.style.borderRadius = '8px';
      unverifiedBanner.style.backgroundColor = 'rgba(255, 204, 0, 0.1)';
      unverifiedBanner.style.border = '1px solid #ffcc00';
      unverifiedBanner.style.color = '#ffcc00';
      unverifiedBanner.style.textAlign = 'center';
      unverifiedBanner.innerHTML = '⏳ <b>Paquet en attente de vérification :</b> Vos pièces et XP sont enregistrés en réserve. Dès que ce cours sera validé par la communauté, vous recevrez automatiquement toutes vos récompenses rétroactivement !';
      levelupEl.parentNode.insertBefore(unverifiedBanner, levelupEl.nextSibling);
    }
    unverifiedBanner.style.display = summary.isUnverified ? 'block' : 'none';

    this.switchView('results-view');

    document.getElementById('btn-results-retry').onclick = () => {
      this.startQuiz(this.currentSubjectId, 'classic');
    };
    document.getElementById('btn-results-home').onclick = () => {
      this.switchView('subjects-view');
    };
  }

  renderShop() {
    const profile = StorageManager.getProfile();

    // Deduplicate customRewards by id (fix corrupted profiles from the double-init bug)
    if (profile.customRewards && profile.customRewards.length > 0) {
      const seen = new Set();
      const deduped = profile.customRewards.filter(r => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });
      if (deduped.length !== profile.customRewards.length) {
        profile.customRewards = deduped;
        StorageManager.saveProfile(profile);
      }
    }

    const customContainer = document.getElementById('custom-rewards-container');
    customContainer.innerHTML = '';

    if (!profile.customRewards || profile.customRewards.length === 0) {
      customContainer.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-secondary); padding: 1.5rem; text-align: center; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">Aucune récompense personnelle ajoutée pour le moment. Cliquez sur "🎁 Ajouter une Récompense Perso" pour en créer une !</div>`;
    } else {
      profile.customRewards.forEach(rew => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        const iconHtml = `<div class="shop-icon">🎁</div>`;

        card.innerHTML = `
          ${iconHtml}
          <div class="shop-item-title">${rew.title}</div>
          <div class="shop-item-desc">Débloqué ${rew.redeemedCount || 0} fois (${rew.cost} 🪙)</div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; width: 100%;">
            <button class="btn-primary btn-redeem" data-id="${rew.id}" style="flex: 1;">
              Utiliser (${rew.cost} 🪙)
            </button>
            <button class="btn-secondary btn-delete-reward" data-id="${rew.id}" style="color: var(--accent-red); border-color: rgba(239, 68, 68, 0.4); padding: 0.4rem 0.75rem;">
              🗑️
            </button>
          </div>
        `;
        customContainer.appendChild(card);
      });
    }

    customContainer.querySelectorAll('.btn-redeem').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const reward = profile.customRewards.find(r => r.id === id);
        if (!reward) return;

        const res = GamificationEngine.redeemCustomReward(profile, id);
        
        if (res.success) {
          const showModal = document.getElementById('modal-show-reward');
          if (showModal) {
            document.getElementById('show-reward-title').innerText = `Vous avez débloqué :\n${reward.title}`;
            const imgContainer = document.getElementById('show-reward-image-container');
            const imgTag = document.getElementById('show-reward-image');
            
            if (reward.image) {
              const url = await getRewardImageUrl(reward.image);
              imgTag.src = url || '';
              imgContainer.style.display = url ? 'block' : 'none';
            } else {
              imgTag.src = '';
              imgContainer.style.display = 'none';
            }
            
            showModal.classList.add('active');
          } else {
            alert(res.message);
          }
        } else {
          alert(res.message);
        }
        
        this.updateHeaderStats();
        this.renderShop();
      });
    });

    customContainer.querySelectorAll('.btn-delete-reward').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const rew = profile.customRewards.find(r => r.id === id);
        if (rew && confirm(`Supprimer la récompense "${rew.title}" ?`)) {
          profile.customRewards = profile.customRewards.filter(r => r.id !== id);
          profile.deletedCustomRewards = profile.deletedCustomRewards || [];
          if (!profile.deletedCustomRewards.includes(id)) {
            profile.deletedCustomRewards.push(id);
          }
          StorageManager.saveProfile(profile);
          this.renderShop();
        }
      });
    });

    const catalogContainer = document.getElementById('shop-catalog-container');
    catalogContainer.innerHTML = '';

    SHOP_ITEMS.forEach(item => {
      const isOwned = profile.purchasedItems.includes(item.id);
      const isEquipped = profile.theme === item.id || profile.avatar === item.icon;

      const card = document.createElement('div');
      card.className = 'shop-card';
      let buttonHtml = '';
      let disabledAttr = '';
      
      if (item.type === 'theme' || item.type === 'avatar') {
        if (isEquipped) {
          buttonHtml = 'Équipé';
          disabledAttr = 'disabled';
        } else if (isOwned) {
          buttonHtml = 'Équiper';
        } else {
          buttonHtml = `Acheter (${item.cost} 🪙)`;
        }
      } else if (item.type === 'emoji') {
        if (isOwned || item.cost === 0) {
          buttonHtml = 'Débloqué ✓';
          disabledAttr = 'disabled';
        } else {
          buttonHtml = `Acheter (${item.cost} 🪙)`;
        }
      } else {
        buttonHtml = `Acheter (${item.cost} 🪙)`;
      }

      card.innerHTML = `
        <div class="shop-icon">${item.icon}</div>
        <div class="shop-item-title">${item.title}</div>
        <div class="shop-item-desc">${item.desc}</div>
        <button class="btn-primary btn-buy-shop" data-id="${item.id}" style="width: 100%;" ${disabledAttr}>
          ${buttonHtml}
        </button>
      `;
      catalogContainer.appendChild(card);
    });

    catalogContainer.querySelectorAll('.btn-buy-shop').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-id');
        const res = GamificationEngine.buyItem(profile, itemId);
        alert(res.message);
        this.applyUserTheme();
        this.updateHeaderStats();
        this.renderShop();
      });
    });
  }

  renderProfile() {
    const profile = StorageManager.getProfile();
    document.getElementById('prof-avatar').textContent = profile.avatar || '🎓';
    document.getElementById('prof-name').textContent = profile.name || 'Réviseur Pro';
    document.getElementById('prof-title').textContent = GamificationEngine.getLevelTitle(profile.level);
    document.getElementById('prof-level-info').textContent = `Niveau ${profile.level} (${profile.xp} / ${GamificationEngine.getRequiredXP(profile.level)} XP)`;

    const equippedBadgesContainer = document.getElementById('prof-equipped-badges');
    if (equippedBadgesContainer) {
      equippedBadgesContainer.innerHTML = '';
      const selected = profile.selectedBadges || [];
      if (selected.length > 0) {
        selected.forEach(achId => {
          const ach = ACHIEVEMENTS.find(a => a.id === achId);
          if (ach) {
            const badgeEl = document.createElement('div');
            badgeEl.className = 'level-badge';
            badgeEl.style.cssText = 'background: rgba(139, 92, 246, 0.15); border: 1px solid var(--accent-purple); color: white; display: flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.65rem; font-size: 0.80rem; font-weight: 600; border-radius: var(--radius-full);';
            badgeEl.innerHTML = `<span>${ach.icon}</span> <span>${ach.title}</span>`;
            equippedBadgesContainer.appendChild(badgeEl);
          }
        });
      } else {
        equippedBadgesContainer.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-secondary); font-style: italic;">Aucun badge affiché. Cliquez sur "Afficher sur le profil" ci-dessous pour en équiper !</span>`;
      }
    }

    const cloudStatus = document.getElementById('cloud-sync-status');
    if (cloudStatus && profile.cloudAccount) {
      cloudStatus.style.color = 'var(--accent-green)';
      cloudStatus.textContent = `🟢 Connecté au Compte Cloud : ${profile.cloudAccount.username}`;
    }

    const stats = profile.stats || {};
    document.getElementById('stat-games').textContent = stats.gamesPlayed || 0;
    document.getElementById('stat-correct').textContent = stats.correctAnswers || 0;
    document.getElementById('stat-maxstreak').textContent = profile.maxStreak || 0;
    document.getElementById('stat-perfects').textContent = stats.perfectGames || 0;

    const achContainer = document.getElementById('achievements-container');
    achContainer.innerHTML = '';
    const unlocked = new Set(profile.unlockedAchievements || []);
    const selectedBadges = profile.selectedBadges || [];

    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = unlocked.has(ach.id);
      const isSelected = selectedBadges.includes(ach.id);
      
      const card = document.createElement('div');
      card.className = `shop-card ${isSelected ? 'selected-badge' : ''}`;
      if (!isUnlocked) card.style.opacity = '0.4';
      if (isSelected) card.style.borderColor = 'var(--accent-purple)';

      let selectBtnHTML = '';
      if (isUnlocked) {
         selectBtnHTML = `<button class="btn-secondary btn-select-badge" data-id="${ach.id}" style="margin-top:0.5rem; font-size:0.75rem; padding: 0.3rem 0.5rem; width: 100%; border-color: ${isSelected ? 'var(--accent-red)' : 'var(--accent-cyan)'}; color: ${isSelected ? 'var(--accent-red)' : 'var(--accent-cyan)'};">${isSelected ? 'Retirer du profil' : 'Afficher sur le profil'}</button>`;
      }

      card.innerHTML = `
        <div class="shop-icon">${ach.icon}</div>
        <div class="shop-item-title">${ach.title}</div>
        <div class="shop-item-desc">${ach.desc}</div>
        <div class="level-badge" style="margin-bottom: 0.5rem;">${isUnlocked ? 'Débloqué ✓' : 'Verrouillé 🔒'}</div>
        ${selectBtnHTML}
      `;
      achContainer.appendChild(card);
    });

    // Wire up select badge buttons
    achContainer.querySelectorAll('.btn-select-badge').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const achId = btn.dataset.id;
        let sBadges = [...(profile.selectedBadges || [])];
        if (sBadges.includes(achId)) {
          sBadges = sBadges.filter(id => id !== achId);
        } else {
          if (sBadges.length >= 3) {
            alert('Vous ne pouvez afficher que 3 badges maximum sur votre profil.');
            return;
          }
          sBadges.push(achId);
        }
        profile.selectedBadges = sBadges;
        StorageManager.saveProfile(profile);
        this.renderProfile();
      });
    });
  }

  async renderCommunitySubjects() {
    const container = document.getElementById('community-list-container');
    if (!container) return;
    container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">Chargement des paquets...</div>';
    
    const subjects = await fetchAcceptedCommunitySubjects();
    this.checkAndVerifyLocalDecks(subjects);
    if (subjects.length === 0) {
      container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">Aucun paquet communautaire disponible pour le moment.</div>';
      return;
    }

    container.innerHTML = '';
    const searchQuery = (document.getElementById('community-search-input')?.value || '').toLowerCase().trim();

    subjects.forEach(sub => {
      if (searchQuery) {
        const nameMatch = sub.subject_name.toLowerCase().includes(searchQuery);
        const authorMatch = sub.author.toLowerCase().includes(searchQuery);
        const catMatch = sub.category.toLowerCase().includes(searchQuery);
        if (!nameMatch && !authorMatch && !catMatch) return;
      }

      const card = document.createElement('div');
      card.style.background = 'var(--bg-card)';
      card.style.border = '1px solid var(--border-color)';
      card.style.padding = '1.25rem';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.style.flexWrap = 'wrap';
      card.style.gap = '1rem';

      const itemDesc = `Taille non calculée (charger pour voir)`;
      const itemIcon = '📦';

      let adminDeleteBtn = '';
      const profile = StorageManager.getProfile();
      if (profile && profile.name && profile.name.toLowerCase() === 'admin') {
        adminDeleteBtn = `<button class="btn-primary btn-delete-community" data-id="${sub.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem; background-color: var(--accent-red); margin-left: 0.5rem;">🗑️ Supprimer</button>`;
      }

      card.innerHTML = `
        <div style="flex: 1;">
          <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; color: white;">${itemIcon} ${sub.subject_name}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Par <strong>${sub.author}</strong> • ${sub.category}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem; border-left: 2px solid var(--accent-cyan); padding-left: 0.5rem;">
            Aperçu non disponible. Téléchargez le contenu pour y accéder.
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="btn-primary btn-import-community" data-id="${sub.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">⬇️ Importer</button>
          ${adminDeleteBtn}
        </div>
      `;

      const btn = card.querySelector('.btn-import-community');
      btn.onclick = async () => {
        btn.textContent = '⏳ Chargement...';
        btn.disabled = true;
        const questionsData = await fetchCommunitySubjectData(sub.id);
        
        if (!questionsData) {
            btn.textContent = '❌ Erreur';
            alert('Impossible de télécharger le contenu du paquet.');
            return;
        }

        const isFolder = questionsData.is_folder === true;

        if (isFolder) {
          questionsData.subjects.forEach((nestedSub, idx) => {
            const newSubject = {
              ...nestedSub,
              id: `community_sub_${sub.id}_${idx}_${Date.now()}`,
              description: `Importé depuis la communauté (Auteur: ${sub.author}).`,
              verified: true
            };
            StorageManager.addSubject(newSubject);
          });
        } else {
          const newSubject = {
            id: `community_sub_${sub.id}_${Date.now()}`,
            name: sub.subject_name,
            pathParts: [sub.category, sub.subject_name],
            icon: '🌐',
            category: sub.category,
            description: `Importé depuis la communauté (Auteur: ${sub.author}).`,
            verified: true,
            questions: questionsData
          };
          StorageManager.addSubject(newSubject);
        }
        
        btn.textContent = '✅ Importé !';
        btn.style.backgroundColor = 'var(--accent-green)';
      };

      const btnDelete = card.querySelector('.btn-delete-community');
      if (btnDelete) {
        btnDelete.onclick = async () => {
          if (!confirm(`Supprimer définitivement le paquet "${sub.subject_name}" de la communauté ?`)) return;
          btnDelete.disabled = true;
          btnDelete.textContent = 'Suppression...';
          const ok = await deleteCommunitySubject(sub.id);
          if (ok) {
            alert('Paquet supprimé de la communauté.');
            this.renderCommunitySubjects();
          } else {
            alert('Erreur lors de la suppression.');
            btnDelete.disabled = false;
            btnDelete.textContent = '🗑️ Supprimer';
          }
        };
      }

      container.appendChild(card);
    });
  }

  openAdminPreview(sub) {
    const modal = document.getElementById('modal-admin-qcm-preview');
    const content = document.getElementById('admin-qcm-preview-content');
    
    if (!sub || !sub.questions_data) {
      content.innerHTML = '<div style="color: var(--accent-red);">Erreur : données de questions manquantes.</div>';
      modal.classList.add('active');
      return;
    }
    
    content.innerHTML = '';
    
    const questionsData = sub.questions_data || [];
    const isFolder = questionsData && questionsData.is_folder === true;
    
    if (isFolder) {
      const subjectsCount = questionsData.subjects?.length || 0;
      content.innerHTML = `<h3 style="color: var(--accent-cyan); margin-bottom: 1rem;">Dossier : ${sub.subject_name} (${subjectsCount} cours)</h3>`;
      const subjects = questionsData.subjects || [];
      subjects.forEach((nestedSub, idx) => {
        let html = `<div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1rem;">`;
        html += `<h4 style="margin-bottom: 0.5rem; color: white;">Cours ${idx + 1} : ${nestedSub.name}</h4>`;
        if (nestedSub.questions) {
          nestedSub.questions.forEach((q, qIdx) => {
            const ans = q.correct !== undefined ? q.correct : (q.correct_answer || 'N/A');
            const wrongAns = q.options ? q.options.filter(opt => opt !== ans).join(', ') : (q.incorrect ? q.incorrect.join(', ') : (q.incorrect_answers ? q.incorrect_answers.join(', ') : ''));
            const explanation = q.explanation || q.feedback || '';
            
            html += `<div style="font-size: 0.85rem; margin-bottom: 0.75rem; border-left: 2px solid var(--accent-green); padding-left: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 6px;">`;
            html += `<div style="margin-bottom: 0.25rem;"><span style="color: var(--text-secondary);">Q${qIdx+1}:</span> ${escapeHTML(q.question)}</div>`;
            html += `<div><span style="color: var(--text-secondary);">Vrai:</span> <span style="color: var(--accent-green);">${escapeHTML(ans)}</span></div>`;
            if (wrongAns) {
              html += `<div style="color: var(--accent-red); opacity: 0.8; font-size: 0.8rem; margin-top: 0.2rem;"><strong>Faux:</strong> ${escapeHTML(wrongAns)}</div>`;
            }
            if (explanation) {
              html += `<div style="color: var(--accent-blue); font-size: 0.8rem; margin-top: 0.2rem;"><strong>Explication:</strong> ${escapeHTML(explanation)}</div>`;
            }
            html += `</div>`;
          });
        }
        html += `</div>`;
        content.innerHTML += html;
      });
    } else {
      const questionsCount = Array.isArray(questionsData) ? questionsData.length : 0;
      content.innerHTML = `<h3 style="color: var(--accent-cyan); margin-bottom: 1rem;">Paquet : ${escapeHTML(sub.subject_name)} (${questionsCount} questions)</h3>`;
      if (Array.isArray(questionsData)) {
        questionsData.forEach((q, qIdx) => {
          const ans = q.correct !== undefined ? q.correct : (q.correct_answer || 'N/A');
          const wrongAns = q.options ? q.options.filter(opt => opt !== ans).join(', ') : (q.incorrect ? q.incorrect.join(', ') : (q.incorrect_answers ? q.incorrect_answers.join(', ') : ''));
          const explanation = q.explanation || q.feedback || '';
          
          let html = `<div style="font-size: 0.9rem; margin-bottom: 0.75rem; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 6px;">`;
          html += `<div style="margin-bottom: 0.25rem;"><strong>Q${qIdx+1}:</strong> ${escapeHTML(q.question)}</div>`;
          html += `<div style="color: var(--accent-green);"><strong>Vrai:</strong> ${escapeHTML(ans)}</div>`;
          if (wrongAns) {
            html += `<div style="color: var(--accent-red); opacity: 0.8; font-size: 0.8rem; margin-top: 0.2rem;"><strong>Faux:</strong> ${escapeHTML(wrongAns)}</div>`;
          }
          if (explanation) {
            html += `<div style="color: var(--accent-blue); font-size: 0.85rem; margin-top: 0.3rem;"><strong>Explication:</strong> ${escapeHTML(explanation)}</div>`;
          }
          html += `</div>`;
          content.innerHTML += html;
        });
      }
    }

    modal.classList.add('active');
    this.triggerMathJax();
  }

  async renderAdminSubjects() {
    const container = document.getElementById('admin-list-container');
    if (!container) return;
    container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">Chargement des propositions en attente...</div>';
    
    const subjects = await fetchPendingCommunitySubjects();
    if (subjects.length === 0) {
      container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">Aucune proposition en attente ! 🎉</div>';
      return;
    }

    container.innerHTML = '';
    subjects.forEach(sub => {
      const card = document.createElement('div');
      card.style.background = 'var(--bg-card)';
      card.style.border = '1px solid var(--accent-amber)';
      card.style.padding = '1.25rem';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.marginBottom = '1rem';

      const questionsData = sub.questions_data || [];
      const isFolder = questionsData && questionsData.is_folder === true;
      const qCount = isFolder ? (questionsData.subjects?.length || 0) : (Array.isArray(questionsData) ? questionsData.length : 0);
      const qPreview = isFolder 
        ? `${qCount} cours inclus.`
        : (Array.isArray(questionsData) ? questionsData.slice(0, 2).map(q => `Q: ${q.question} | R: ${q.correct !== undefined ? q.correct : (q.correct_answer || 'N/A')}`).join('<br>') : 'N/A');

      card.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <div style="font-size: 1.1rem; font-weight: 700; color: white;">${sub.subject_name} <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-secondary);">par ${sub.author}</span></div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${qCount} questions</div>
          <div style="background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-family: monospace; color: var(--accent-cyan); margin-bottom: 1rem; max-height: 100px; overflow-y: auto;">
            ${qPreview} ...
          </div>
          <label style="font-size: 0.85rem; color: var(--text-secondary);">Catégorie :</label>
          <input type="text" class="admin-cat-input" value="${sub.category}" style="padding: 0.4rem; background: var(--bg-input); border: 1px solid var(--border-color); color: white; border-radius: var(--radius-sm); width: 150px; margin-left: 0.5rem;">
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn-primary btn-preview" style="background: var(--accent-blue); border-color: var(--accent-blue);">👀 Voir Détaillé</button>
          <button class="btn-primary btn-accept" style="background: var(--accent-green); border-color: var(--accent-green);">✅ Accepter</button>
          <button class="btn-primary btn-reject" style="background: var(--accent-red); border-color: var(--accent-red);">❌ Refuser</button>
        </div>
      `;

      card.querySelector('.btn-preview').onclick = () => {
        this.openAdminPreview(sub);
      };

      card.querySelector('.btn-accept').onclick = async () => {
        const cat = card.querySelector('.admin-cat-input').value;
        await updateCommunitySubjectCategory(sub.id, cat);
        await updateCommunitySubjectStatus(sub.id, 'accepted');
        card.remove();
      };

      card.querySelector('.btn-reject').onclick = async () => {
        if(confirm("Refuser et supprimer définitivement cette proposition ?")) {
          await updateCommunitySubjectStatus(sub.id, 'rejected');
          card.remove();
        }
      };

      container.appendChild(card);
    });
  }

  setupCSVImporter() {
    const dropZone = document.getElementById('drop-zone-csv');
    const fileInput = document.getElementById('input-csv-file');
    const folderInput = document.getElementById('input-csv-folder');

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--accent-cyan)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = 'var(--border-color)';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--border-color)';
      if (e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.csv') || f.name.endsWith('.txt'));
        if (files.length > 0) this.processCSVFiles(files);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        const files = Array.from(fileInput.files).filter(f => f.name.endsWith('.csv') || f.name.endsWith('.txt'));
        if (files.length > 0) this.processCSVFiles(files);
      }
    });

    if (folderInput) {
      folderInput.addEventListener('change', () => {
        if (folderInput.files.length > 0) {
          const files = Array.from(folderInput.files).filter(f => f.name.endsWith('.csv') || f.name.endsWith('.txt'));
          if (files.length > 0) this.processCSVFiles(files);
        }
      });
    }
  }

  async processCSVFiles(files) {
    const resultBox = document.getElementById('csv-result-box');
    resultBox.style.display = 'block';
    resultBox.innerHTML = '<div style="color: var(--accent-cyan);">Importation en cours...</div>';

    let successCount = 0;
    let errorCount = 0;
    
    const importMode = document.querySelector('input[name="csv-import-mode"]:checked')?.value || 'update';
    let updatedCount = 0;

    for (const file of files) {
      try {
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file, 'UTF-8');
        });

        const res = CSVParser.parse(text);
        if (res.success) {
          let name = file.name.replace(/\.[^/.]+$/, ""); // remove extension
          name = name.replace(/\[CSV\]/g, '').trim(); // remove [CSV] flag

          let relativeFolders = [];
          if (file.webkitRelativePath) {
            const parts = file.webkitRelativePath.split('/');
            if (parts.length > 1) {
              relativeFolders = parts.slice(0, parts.length - 1);
            }
          }

          const newSubject = {
            id: `sub_${Date.now()}_${Math.floor(Math.random()*1000)}`,
            name: name,
            originalFileName: file.name,
            pathParts: [...this.currentFolderPath, ...relativeFolders, name],
            icon: '📄',
            category: res.isAnkiDeck ? 'Paquet Anki' : 'Mes Cours',
            description: `Importé depuis ${file.name} (${res.questions.length} cartes)`,
            verified: false,
            questions: res.questions
          };

          if (importMode === 'update') {
            const upsertRes = StorageManager.upsertSubjectWithProgress(newSubject);
            if (upsertRes.updated) updatedCount++;
          } else {
            StorageManager.addSubject(newSubject);
          }
          successCount++;
        } else {
          errorCount++;
          console.error(`Erreur d'importation pour ${file.name}:`, res.error);
        }
      } catch (err) {
        errorCount++;
        console.error(`Erreur de lecture pour ${file.name}:`, err);
      }
    }

    this.renderCategoryFilters();
    this.renderSubjects();

    // Trigger instant cloud push so imported decks are immediately available on mobile
    StorageManager.autoSyncCloud();

    resultBox.innerHTML = `
      <h4 style="color: var(--accent-green); margin-bottom: 0.5rem;">✅ Importation terminée</h4>
      <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><strong>${successCount}</strong> fichier(s) traité(s) avec succès ${updatedCount > 0 ? `(dont <strong>${updatedCount}</strong> paquet(s) mis à jour avec conservation des scores)` : ''}.</p>
      <p style="color: var(--accent-cyan); font-size: 0.85rem; margin-bottom: 0.5rem;">☁️ Synchronisation Cloud effectuée instantanément.</p>
      ${errorCount > 0 ? `<p style="color: var(--accent-red);">❌ <strong>${errorCount}</strong> fichier(s) ont échoué.</p>` : ''}
    `;
  }

  processCSVFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const res = CSVParser.parse(text);

      const resultBox = document.getElementById('csv-result-box');
      resultBox.style.display = 'block';

      if (res.success) {
        const defaultName = file.name.replace(/\.[^/.]+$/, '');
        const subjectName = prompt('Nom de la matière pour ce paquet :', defaultName);
        if (!subjectName) return;

        const importMode = document.querySelector('input[name="csv-import-mode"]:checked')?.value || 'update';

        const newSubject = {
          id: `custom_sub_${Date.now()}`,
          name: subjectName,
          pathParts: [subjectName],
          icon: res.isAnkiDeck ? '🎴' : '📑',
          category: res.isAnkiDeck ? 'Paquet Anki' : 'Mes Cours',
          description: res.isAnkiDeck
            ? `Importé depuis Anki (${res.count} cartes avec fausses réponses auto-générées).`
            : `Cours importé avec ${res.count} questions.`,
          verified: false,
          questions: res.questions
        };

        let isUpdated = false;
        if (importMode === 'update') {
          const upsertRes = StorageManager.upsertSubjectWithProgress(newSubject);
          isUpdated = upsertRes.updated;
        } else {
          StorageManager.addSubject(newSubject);
        }

        resultBox.innerHTML = `
          <h4 style="color: var(--accent-green);">✅ ${isUpdated ? 'Mise à jour réussie !' : 'Importation réussie !'}</h4>
          <p>${isUpdated ? `Le paquet "${subjectName}" a été mis à jour (${res.count} questions). Vos scores et votre progression SRS ont été précieusement conservés !` : `${res.count} cartes/questions ajoutées avec succès à la matière "${subjectName}".`}</p>
          <button id="btn-submit-community" class="btn-primary" style="margin-top: 1rem; width: 100%; font-size: 0.9rem;">
            🌐 Soumettre à la communauté
          </button>
        `;
        
        const btnSubmit = document.getElementById('btn-submit-community');
        if (btnSubmit) {
          btnSubmit.onclick = async () => {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Envoi en cours...';
            const profile = StorageManager.getProfile();
            const author = profile.cloudAccount?.username || 'Anonyme';
            const category = res.isAnkiDeck ? 'Anki' : 'Mes Cours';
            const success = await submitCommunitySubject(subjectName, author, category, newSubject.questions);
            if (success) {
              btnSubmit.style.backgroundColor = 'var(--accent-green)';
              btnSubmit.textContent = '✅ Envoyé pour modération !';
            } else {
              btnSubmit.disabled = false;
              btnSubmit.textContent = '❌ Erreur lors de l\'envoi (Réessayer)';
            }
          };
        }

        this.renderCategoryFilters();
        this.renderSubjects();
      } else {
        resultBox.innerHTML = `
          <h4 style="color: var(--accent-red);">❌ Erreur d'importation</h4>
          <p>${res.error}</p>
        `;
      }
    };
    reader.readAsText(file, 'UTF-8');
  }

  setupEventListeners() {
    if (this._eventListenersSetup) return;
    this._eventListenersSetup = true;

    // Auto-sync when switching back to this tab/app on phone or PC
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        const updated = await StorageManager.syncFromCloudSilent();
        if (updated) {
          this.updateHeaderStats();
          this.updatePausedBanner();
          if (document.getElementById('subjects-view')?.classList.contains('active')) {
            this.renderSubjects();
          }
        }
      }
    });

    // Quiz Pause & Resume Buttons

    // --- Selection Mode ---
    safeOn('btn-toggle-select', 'click', () => {
      this.isSelectMode = !this.isSelectMode;
      if (!this.isSelectMode) this.selectedSubjects.clear();
      this.renderSubjects();
    });

    safeOn('btn-selection-cancel', 'click', () => {
      this.isSelectMode = false;
      this.selectedSubjects.clear();
      this.renderSubjects();
    });

    safeOn('btn-selection-delete', 'click', () => {
      if (this.selectedSubjects.size === 0) return;
      if (confirm(`Voulez-vous vraiment supprimer les ${this.selectedSubjects.size} éléments sélectionnés ?`)) {
        const subjects = StorageManager.getSubjects();
        this.selectedSubjects.forEach(id => delete subjects[id]);
        StorageManager.saveSubjects(subjects);
        this.selectedSubjects.clear();
        this.isSelectMode = false;
        this.renderSubjects();
      }
    });

    safeOn('btn-selection-move', 'click', () => {
      if (this.selectedSubjects.size === 0) return;
      
      this.openFolderSelector((selectedPath) => {
        const subjects = StorageManager.getSubjects();
        this.selectedSubjects.forEach(id => {
          if (subjects[id]) {
            const subjectName = subjects[id].pathParts ? subjects[id].pathParts[subjects[id].pathParts.length - 1] : subjects[id].name;
            subjects[id].pathParts = [...selectedPath, subjectName];
          }
        });
        StorageManager.saveSubjects(subjects);
        this.selectedSubjects.clear();
        this.isSelectMode = false;
        this.renderSubjects();
      });
    });

    // --- Custom Folder Creation ---
    safeOn('btn-create-folder', 'click', () => {
      const folderName = prompt('Nom du nouveau dossier :');
      if (!folderName) return;
      const folderIcon = prompt('Émoji / Icône pour ce dossier (ex: 📁, 📐) :', '📁') || '📁';
      
      const profile = StorageManager.getProfile();
      if (!profile.customFolders) profile.customFolders = [];
      profile.customFolders.push({
        pathParts: [...this.currentFolderPath, folderName.trim()],
        icon: folderIcon
      });
      StorageManager.saveProfile(profile);
      this.renderSubjects();
    });

    safeOn('header-cloud-btn', 'click', () => {
      const modal = document.getElementById('modal-cloud-login');
      if (modal) modal.classList.add('active');
    });

    const btnStartRev = document.getElementById('btn-start-revision');
    if (btnStartRev) btnStartRev.onclick = () => this.startRevisionQuiz();

    safeOn('quiz-save-exit-btn', 'click', () => this.saveAndExitQuizSession());
    safeOn('btn-resume-banner', 'click', () => this.resumeQuizSession());
    safeOn('btn-discard-banner', 'click', () => this.discardPausedSession());
    safeOn('btn-confirm-cancel', 'click', () => this.closeOverwriteModal());
    safeOn('btn-confirm-overwrite', 'click', () => {
      this.closeOverwriteModal();
      if (this.pendingNewQuiz) {
        this.startQuiz(this.pendingNewQuiz.subjectId, this.pendingNewQuiz.mode, true);
        this.pendingNewQuiz = null;
      }
    });

    // Cloud Account Modal Trigger Button
    const btnOpenCloudModal = document.getElementById('btn-open-cloud-modal');
    if (btnOpenCloudModal) {
      btnOpenCloudModal.addEventListener('click', () => {
        const modal = document.getElementById('modal-cloud-login');
        if (modal) modal.classList.add('active');
      });
    }

    // Change Username Button
    const btnChangeUser = document.getElementById('btn-change-username');
    if (btnChangeUser) {
      btnChangeUser.addEventListener('click', () => {
        const profile = StorageManager.getProfile();
        const newName = prompt('Entrez votre nouveau nom d\'affichage (Amis & Duels) :', profile.name);
        if (newName && newName.trim()) {
          profile.name = newName.trim();
          StorageManager.saveProfile(profile);
          this.renderProfile();
          this.renderDuelsView();
          alert('Nom d\'affichage mis à jour avec succès !');
        }
      });
    }

    // === DUEL SYSTEM EVENT LISTENERS ===

    // Wager toggle
    const wagerToggle = document.getElementById('duel-wager-toggle');
    if (wagerToggle) {
      wagerToggle.addEventListener('change', () => {
        const opts = document.getElementById('duel-wager-options');
        const label = document.getElementById('duel-wager-disabled-label');
        if (wagerToggle.checked) {
          if (opts) opts.style.display = 'block';
          if (label) label.style.display = 'none';
        } else {
          if (opts) opts.style.display = 'none';
          if (label) label.style.display = 'block';
        }
      });
    }

    // Show join code input
    safeOn('btn-join-duel-show', 'click', () => {
      const box = document.getElementById('duel-join-box');
      if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
    });

    const ensureValidSession = async () => {
      const db = getDB();
      if (!db) return false;
      const { data: { session }, error } = await db.auth.getSession();
      if (error || !session) {
        const p = StorageManager.getProfile();
        p.cloudAccount = null;
        StorageManager.saveProfile(p);
        alert("Votre session a expiré ou le mot de passe a été modifié. Veuillez vous reconnecter.");
        const modal = document.getElementById('modal-cloud-login');
        if (modal) modal.classList.add('active');
        return false;
      }
      return true;
    };

    // Matchmaking Auto
    safeOn('btn-matchmaking', 'click', async () => {
      const profile = StorageManager.getProfile();
      if (!profile.cloudAccount?.username) {
        const warn = document.getElementById('duel-cloud-warning');
        if (warn) warn.style.display = 'block';
        return;
      }
      if (!(await ensureValidSession())) return;
      const subjectId = document.getElementById('duel-subject-select').value;
      const subjects = StorageManager.getSubjects();
      const sub = subjects[subjectId];
      if (!sub || !sub.questions || sub.questions.length < 4) {
        alert('Cette matière n\'a pas assez de questions pour un duel (minimum 4).');
        return;
      }

      const wagerToggle = document.getElementById('duel-wager-toggle');
      const wager = wagerToggle?.checked ? parseInt(document.getElementById('duel-wager-select').value, 10) : 0;

      if (wager > 0 && profile.coins < wager) {
        alert(`Pièces insuffisantes pour ce pari ! (${profile.coins} 🪙 dispo, ${wager} 🪙 requis)`);
        return;
      }

      // Show matchmaking screen
      this.showDuelScreen('matchmaking');
      document.getElementById('matchmaking-status-text').textContent = `Recherche sur : ${sub.name}`;

      const res = await MultiplayerEngine.startMatchmaking(sub, wager);
      if (!res.success) {
        alert(res.message);
        this.showDuelScreen('menu');
        return;
      }

      if (res.matched) {
        // Directly matched! Go to lobby
        this.enterDuelLobby(res.battle);
      } else {
        // Waiting for opponent — poll every 2s
        this.matchmakingPollInterval = setInterval(async () => {
          const battle = await MultiplayerEngine.getBattle(res.battle.id);
          if (battle && battle.player2_id) {
            clearInterval(this.matchmakingPollInterval);
            this.matchmakingPollInterval = null;
            this.enterDuelLobby(battle);
          }
        }, 2000);
      }
    });

    // Cancel matchmaking
    safeOn('btn-cancel-matchmaking', 'click', async () => {
      if (this.matchmakingPollInterval) {
        clearInterval(this.matchmakingPollInterval);
        this.matchmakingPollInterval = null;
      }
      if (this.duelState?.battleId) {
        await MultiplayerEngine.cancelMatchmaking(this.duelState.battleId);
      }
      this.duelState = null;
      this.showDuelScreen('menu');
    });

    // Leave Lobby
    safeOn('btn-duel-leave-lobby', 'click', async () => {
      if (this.duelState && !this.duelState.started && this.duelState.channel) {
        MultiplayerEngine.broadcastEvent(this.duelState.channel, 'player_left_lobby', {
          playerNum: this.duelState.playerNum
        });
        await MultiplayerEngine.cancelMatchmaking(this.duelState.battleId);
        this.duelState.channel.unsubscribe();
        this.duelState = null;
        this.showDuelScreen('menu');
      }
    });

    // Create Private Room
    safeOn('btn-create-duel', 'click', async () => {
      const profile = StorageManager.getProfile();
      if (!profile.cloudAccount?.username) {
        const warn = document.getElementById('duel-cloud-warning');
        if (warn) warn.style.display = 'block';
        return;
      }
      const subjectId = document.getElementById('duel-subject-select').value;
      const subjects = StorageManager.getSubjects();
      const sub = subjects[subjectId];
      if (!sub || !sub.questions || sub.questions.length < 4) {
        alert('Pas assez de questions (minimum 4).');
        return;
      }

      const wagerToggle = document.getElementById('duel-wager-toggle');
      const wager = wagerToggle?.checked ? parseInt(document.getElementById('duel-wager-select').value, 10) : 0;

      const res = await MultiplayerEngine.createPrivateRoom(sub, wager);
      if (!res.success) { alert(res.message); return; }

      alert(`🔒 Salon Privé créé !\n\nCode : ${res.code}\n\nDonnez ce code à votre adversaire !`);

      // Subscribe and wait for player 2
      this.showDuelScreen('matchmaking');
      document.getElementById('matchmaking-status-text').textContent = `En attente d'un adversaire... Code : ${res.code}`;

      const channel = MultiplayerEngine.subscribeToBattle(res.battle.id, {
        onPlayerJoined: (data) => {
          this.enterDuelLobby({ ...res.battle, ...data });
        }
      });

      this.duelState = { battleId: res.battle.id, channel, battle: res.battle };

      // Also poll in case broadcast is missed
      this.matchmakingPollInterval = setInterval(async () => {
        const battle = await MultiplayerEngine.getBattle(res.battle.id);
        if (battle && battle.player2_id) {
          clearInterval(this.matchmakingPollInterval);
          this.matchmakingPollInterval = null;
          this.enterDuelLobby(battle);
        }
      }, 2000);
    });

    // Join Private Room
    safeOn('btn-join-duel', 'click', async () => {
      const profile = StorageManager.getProfile();
      if (!profile.cloudAccount?.username) {
        const warn = document.getElementById('duel-cloud-warning');
        if (warn) warn.style.display = 'block';
        return;
      }
      if (!(await ensureValidSession())) return;
      const codeInput = document.getElementById('input-duel-code').value.trim().toUpperCase();
      if (!codeInput) { alert('Veuillez entrer un code de salon !'); return; }

      const res = await MultiplayerEngine.joinPrivateRoom(codeInput);
      if (!res.success) { alert(res.message); return; }

      // Notify host via broadcast
      const channel = MultiplayerEngine.subscribeToBattle(res.battle.id, {});
      MultiplayerEngine.broadcastEvent(channel, 'player_joined', {
        player2_id: res.battle.player2_id,
        player2_name: res.battle.player2_name,
        player2_avatar: res.battle.player2_avatar
      });

      this.enterDuelLobby(res.battle, channel);
    });

    // Duel Ready button
    safeOn('btn-duel-ready', 'click', async () => {
      if (!this.duelState) return;
      const btn = document.getElementById('btn-duel-ready');
      if (btn) { btn.disabled = true; btn.textContent = '⏳ En attente de l\'adversaire...'; }

      const playerNum = this.duelState.playerNum;
      await MultiplayerEngine.markReady(this.duelState.battleId, playerNum);

      // Broadcast ready
      MultiplayerEngine.broadcastEvent(this.duelState.channel, 'player_ready', { playerNum });

      // Check if both ready
      const el = playerNum === 1 ? document.getElementById('lobby-p1-ready') : document.getElementById('lobby-p2-ready');
      if (el) { el.textContent = '✅ Prêt !'; el.style.color = 'var(--accent-green)'; }

      const battle = await MultiplayerEngine.getBattle(this.duelState.battleId);
      if (battle && battle.player1_ready && battle.player2_ready) {
        this.startDuelCountdown();
      }
    });

    // Duel back home
    safeOn('btn-duel-back-home', 'click', () => {
      this.cleanupDuel();
      this.showDuelScreen('menu');
    });

    safeOn('btn-quick-play', 'click', () => {
      const subjects = Object.keys(StorageManager.getSubjects());
      const randomSub = subjects[Math.floor(Math.random() * subjects.length)];
      this.startQuiz(randomSub, 'classic');
    });

    safeOn('btn-daily-quests', 'click', () => {
      this.renderDailyQuestsModal();
      document.getElementById('modal-daily-quests').classList.add('active');
    });

    document.querySelectorAll('.powerup-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const puType = btn.getAttribute('data-pu');
        const res = this.quizEngine.usePowerup(puType);
        if (res.success) {
          SoundFX.playClick();
          this.updatePowerupButtons();
          if (res.nextQuestion) {
            this.renderCurrentQuestion(res.nextQuestion);
          }
        } else {
          alert(res.message);
        }
      });
    });

    safeOn('btn-export-data', 'click', () => {
      StorageManager.exportAllData();
    });

    safeOn('input-import-data', 'change', (e) => {
      if (e.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = StorageManager.importData(event.target.result);
          if (res.success) {
            alert('Sauvegarde restaurée avec succès !');
            // Refresh all views without re-running init (avoids duplicate listeners)
            this.applyUserTheme();
            this.updateHeaderStats();
            this.renderSubjects();
            this.renderShop();
            this.renderProfile();
            this.updatePausedBanner();
          } else {
            alert(`Erreur de restauration : ${res.error}`);
          }
        };
        reader.readAsText(e.target.files[0]);
      }
    });

    safeOn('btn-reset-data', 'click', async () => {
      const profile = StorageManager.getProfile();
      if (profile.cloudAccount) {
        const pass = prompt('🔐 Entrez votre mot de passe Cloud pour confirmer la réinitialisation :');
        if (!pass) return;
        const hashed = await StorageManager._hashPasscodeCheck(pass);
        if (hashed !== profile.cloudAccount.hashedKey) {
          alert('❌ Mot de passe incorrect. Réinitialisation annulée.');
          return;
        }
      } else {
        if (!confirm('Voulez-vous vraiment réinitialiser toutes vos données (points, cours, progression) ?')) return;
      }
      StorageManager.resetAllData();
      location.reload();
    });

    const modal = document.getElementById('modal-custom-reward');
    const imgInput = document.getElementById('input-reward-image');
    const imgPreviewDiv = document.getElementById('preview-reward-image');
    const imgPreviewTag = imgPreviewDiv ? imgPreviewDiv.querySelector('img') : null;
    let currentCompressedImage = null;

    function resetRewardModal() {
      document.getElementById('input-reward-title').value = '';
      document.getElementById('input-reward-cost').value = '';
      if (imgInput) imgInput.value = '';
      if (imgPreviewDiv) imgPreviewDiv.style.display = 'none';
      if (imgPreviewTag) imgPreviewTag.src = '';
      currentCompressedImage = null;
    }

    if (imgInput) {
      imgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
          if (imgPreviewDiv) imgPreviewDiv.style.display = 'none';
          currentCompressedImage = null;
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to WebP or JPEG
            const dataUrl = canvas.toDataURL('image/webp', 0.9);
            currentCompressedImage = dataUrl;

            if (imgPreviewDiv && imgPreviewTag) {
              imgPreviewTag.src = dataUrl;
              imgPreviewDiv.style.display = 'block';
            }
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    safeOn('btn-add-custom-reward', 'click', () => {
      resetRewardModal();
      if (modal) modal.classList.add('active');
    });

    safeOn('btn-modal-cancel', 'click', () => {
      if (modal) modal.classList.remove('active');
    });

    safeOn('btn-modal-save-reward', 'click', async () => {
      const titleInput = document.getElementById('input-reward-title');
      const costInput = document.getElementById('input-reward-cost');
      const btn = document.getElementById('btn-modal-save-reward');
      if (!titleInput || !costInput || !btn) return;

      const title = titleInput.value.trim();
      const cost = parseInt(costInput.value, 10);

      if (!title || isNaN(cost) || cost <= 0) {
        alert('Veuillez spécifier un titre et un coût valide.');
        return;
      }

      const profile = StorageManager.getProfile();
      let imagePath = currentCompressedImage;
      
      if (currentCompressedImage) {
        btn.disabled = true;
        btn.textContent = "Upload en cours...";
        const username = profile.cloudAccount?.username || 'anonyme';
        const path = await uploadRewardImage(currentCompressedImage, username);
        if (path) {
          imagePath = path;
        } else {
          alert("Erreur lors de l'upload de l'image. Elle sera stockée localement uniquement.");
        }
        btn.disabled = false;
        btn.textContent = "Créer la récompense";
      }

      profile.customRewards.push({
        id: `rew_${Date.now()}`,
        title: title,
        cost: cost,
        image: imagePath,
        redeemedCount: 0
      });

      StorageManager.saveProfile(profile);
      if (modal) modal.classList.remove('active');
      this.renderShop();
    });
  }

  buildFolderTree() {
    const tree = { name: "Accueil", pathParts: [], children: {} };
    const subjects = StorageManager.getSubjects();
    const profile = StorageManager.getProfile();
    
    const addPathToTree = (pathParts) => {
      let current = tree;
      let currentPath = [];
      for (const part of pathParts) {
        currentPath.push(part);
        if (!current.children[part]) {
          current.children[part] = { name: part, pathParts: [...currentPath], children: {} };
        }
        current = current.children[part];
      }
    };

    Object.values(subjects).forEach(sub => {
      if (sub.pathParts && sub.pathParts.length > 1) {
        addPathToTree(sub.pathParts.slice(0, -1));
      }
    });

    if (profile.customFolders) {
      profile.customFolders.forEach(cf => {
        if (cf.pathParts) addPathToTree(cf.pathParts);
      });
    }

    return tree;
  }

  openFolderSelector(callback, subjectName = null) {
    const modal = document.getElementById('modal-folder-selector');
    const treeContainer = document.getElementById('folder-selector-tree');
    
    let selectedPath = [];
    const tree = this.buildFolderTree();

    const renderNode = (node, depth = 0) => {
      const el = document.createElement('div');
      el.style.paddingLeft = `${depth * 1.5}rem`;
      el.style.paddingTop = '0.5rem';
      el.style.paddingBottom = '0.5rem';
      el.style.cursor = 'pointer';
      el.style.borderRadius = '4px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.gap = '0.5rem';

      const isSelected = JSON.stringify(node.pathParts) === JSON.stringify(selectedPath);
      if (isSelected) {
        el.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
        el.style.border = '1px solid var(--accent-green)';
      } else {
        el.style.border = '1px solid transparent';
      }

      const icon = depth === 0 ? '🏠' : '📁';
      el.innerHTML = `<span>${icon}</span><span>${node.name}</span>`;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedPath = node.pathParts;
        renderTree();
      });

      return el;
    };

    const renderTreeRecursive = (node, depth, container) => {
      container.appendChild(renderNode(node, depth));
      Object.values(node.children).forEach(child => {
        renderTreeRecursive(child, depth + 1, container);
      });
    };

    const renderTree = () => {
      treeContainer.innerHTML = '';
      renderTreeRecursive(tree, 0, treeContainer);
    };

    renderTree();

    const handleConfirm = () => {
      let finalPath = [...selectedPath];
      if (subjectName) finalPath.push(subjectName);
      callback(finalPath);
      modal.classList.remove('active');
    };

    const handleNew = () => {
      const folderName = prompt('Nom du nouveau sous-dossier dans ' + (selectedPath.length > 0 ? selectedPath[selectedPath.length - 1] : 'Accueil') + ' :');
      if (folderName && folderName.trim() !== '') {
        selectedPath.push(folderName.trim());
        const profile = StorageManager.getProfile();
        if (!profile.customFolders) profile.customFolders = [];
        profile.customFolders.push({ pathParts: [...selectedPath], customIcon: '📁' });
        StorageManager.saveProfile(profile);
        
        const newTree = this.buildFolderTree();
        Object.assign(tree, newTree);
        renderTree();
      }
    };

    // Fix event listeners
    const btnConfirmOld = document.getElementById('btn-folder-selector-confirm');
    const btnNewOld = document.getElementById('btn-folder-selector-new');
    
    const btnConfirm = btnConfirmOld.cloneNode(true);
    const btnNew = btnNewOld.cloneNode(true);
    
    btnConfirmOld.parentNode.replaceChild(btnConfirm, btnConfirmOld);
    btnNewOld.parentNode.replaceChild(btnNew, btnNewOld);

    btnConfirm.addEventListener('click', handleConfirm);
    btnNew.addEventListener('click', handleNew);

    modal.classList.add('active');
  }

  async checkAndVerifyLocalDecks(accepted) {
    try {
      if (!accepted) {
        accepted = await fetchAcceptedCommunitySubjects();
      }
      if (!accepted || accepted.length === 0) return;

      const subjects = StorageManager.getSubjects();
      let modified = false;
      let totalClaimedXP = 0;
      let totalClaimedCoins = 0;
      let verifiedCount = 0;

      const profile = StorageManager.getProfile();
      profile.stats = profile.stats || {};
      const pendingRewards = profile.stats.pendingRewards || {};

      Object.entries(subjects).forEach(([subId, sub]) => {
        if (sub.verified === false) {
          const cleanName = (sub.pathParts ? sub.pathParts[sub.pathParts.length - 1] : sub.name).replace(/\[CSV\]/g, '').trim().toLowerCase();
          
          const match = accepted.find(ac => ac.subject_name.toLowerCase() === cleanName);
          if (match) {
            sub.verified = true;
            modified = true;
            verifiedCount++;

            // Retroactively claim pending XP and Coins earned while unverified
            if (pendingRewards[subId]) {
              totalClaimedXP += (pendingRewards[subId].xp || 0);
              totalClaimedCoins += (pendingRewards[subId].coins || 0);
              delete pendingRewards[subId];
            }

            console.log(`Local deck "${sub.name}" has been recognized a posteriori by the community and is now verified!`);
          }
        }
      });

      if (modified) {
        StorageManager.saveSubjects(subjects);
        profile.stats.pendingRewards = pendingRewards;

        if (totalClaimedXP > 0 || totalClaimedCoins > 0) {
          const { profile: updatedProf, leveledUp } = GamificationEngine.addReward(profile, 0, totalClaimedXP, totalClaimedCoins);
          GamificationEngine.checkAchievements(updatedProf);
          this.updateHeaderStats();
          alert(`🎉 Félicitations !\n${verifiedCount} de vos paquets de révision ont été vérifiés par la communauté !\n\nVous recevez rétroactivement vos récompenses réservées :\n+${totalClaimedXP} XP ⚡\n+${totalClaimedCoins} Pièces 🪙`);
        } else {
          StorageManager.saveProfile(profile);
        }

        this.renderSubjects();
      }
    } catch (e) {
      console.log('checkAndVerifyLocalDecks failed:', e.message);
    }
  }
}

function startApp() {
  // CRITICAL GUARD: never run twice (readyState race condition)
  if (window._appStarted) return;
  window._appStarted = true;

  const app = new AppController();
  window.appInstance = app;
  app.init();

  window.addEventListener('beforeunload', () => {
    if (window.appInstance?.duelState && window.appInstance.duelState.channel) {
      if (!window.appInstance.duelState.started) {
        MultiplayerEngine.broadcastEvent(window.appInstance.duelState.channel, 'player_left_lobby', {
          playerNum: window.appInstance.duelState.playerNum
        });
      } else if (!window.appInstance.duelState.resolved) {
        MultiplayerEngine.broadcastEvent(window.appInstance.duelState.channel, 'player_abandoned', {
          playerNum: window.appInstance.duelState.playerNum
        });
      }
    }
  });

  const dbClient = getDB();
  if (dbClient) {
    dbClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        const modal = document.getElementById('modal-cloud-reset-password');
        if (modal) modal.classList.add('active');
      }
    });
  }

  safeOn('form-cloud-reset-password', 'submit', async (e) => {
    e.preventDefault();
    const newPass = document.getElementById('modal-cloud-new-pass').value;
    if (!newPass || newPass.length < 6) {
      alert('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    const db = getDB();
    if (!db) return;
    const { error } = await db.auth.updateUser({ password: newPass });
    if (error) {
      alert('Erreur lors de la réinitialisation : ' + error.message);
    } else {
      alert('Mot de passe mis à jour avec succès ! Vous pouvez maintenant vous connecter.');
      document.getElementById('modal-cloud-reset-password').classList.remove('active');
      const loginModal = document.getElementById('modal-cloud-login');
      if (loginModal) loginModal.classList.add('active');
    }
  });

  // Show Cloud Login popup on first visit if no account
  const profile = StorageManager.getProfile();
  if (!profile || !profile.cloudAccount || !profile.cloudAccount.username) {
    setTimeout(() => {
      const modal = document.getElementById('modal-cloud-login');
      if (modal) modal.classList.add('active');
    }, 300);
  }

  // Cloud login modal tabs
  let cloudLoginMode = 'login';
  safeOn('tab-cloud-login', 'click', () => {
    cloudLoginMode = 'login';
    document.getElementById('tab-cloud-login').style.borderBottom = '2px solid var(--accent-cyan)';
    document.getElementById('tab-cloud-login').style.color = 'var(--accent-cyan)';
    document.getElementById('tab-cloud-login').style.fontWeight = '700';
    document.getElementById('tab-cloud-signup').style.borderBottom = '2px solid transparent';
    document.getElementById('tab-cloud-signup').style.color = 'var(--text-secondary)';
    document.getElementById('tab-cloud-signup').style.fontWeight = 'normal';
    document.getElementById('modal-cloud-user').style.display = 'none';
    document.getElementById('btn-modal-cloud-login-submit').innerHTML = '🚀 Se connecter';
  });

  safeOn('tab-cloud-signup', 'click', () => {
    cloudLoginMode = 'signup';
    document.getElementById('tab-cloud-signup').style.borderBottom = '2px solid var(--accent-cyan)';
    document.getElementById('tab-cloud-signup').style.color = 'var(--accent-cyan)';
    document.getElementById('tab-cloud-signup').style.fontWeight = '700';
    document.getElementById('tab-cloud-login').style.borderBottom = '2px solid transparent';
    document.getElementById('tab-cloud-login').style.color = 'var(--text-secondary)';
    document.getElementById('tab-cloud-login').style.fontWeight = 'normal';
    document.getElementById('modal-cloud-user').style.display = 'block';
    document.getElementById('btn-modal-cloud-login-submit').innerHTML = '🚀 Créer un compte';
  });

  safeOn('btn-modal-cloud-forgot', 'click', async () => {
    const emailInput = document.getElementById('modal-cloud-email');
    if (!emailInput || !emailInput.value.trim()) {
      alert('Veuillez saisir votre adresse email pour réinitialiser le mot de passe.');
      return;
    }
    const res = await StorageManager.resetCloudPassword(emailInput.value.trim());
    if (res.success) {
      alert('Un email de réinitialisation a été envoyé (vérifiez vos spams).');
    } else {
      alert('Erreur: ' + (res.message || 'Impossible d\'envoyer l\'email.'));
    }
  });
  // Sanitize username input
  const modalCloudUser = document.getElementById('modal-cloud-user');
  if (modalCloudUser) {
    modalCloudUser.addEventListener('input', (e) => {
      e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_éèêëàâäôöûüùîïçœæ-]/g, '');
    });
  }

  // Cloud login modal events
  safeOn('form-cloud-login', 'submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('modal-cloud-email');
    const userInput = document.getElementById('modal-cloud-user');
    const passInput = document.getElementById('modal-cloud-pass');
    
    if (!emailInput || !passInput) return;
    
    const email = emailInput.value.trim();
    const passcode = passInput.value.trim();
    const username = userInput ? userInput.value.trim() : '';
    
    if (!email || !passcode) { alert('Veuillez saisir un email et un mot de passe !'); return; }
    if (cloudLoginMode === 'signup' && !username) { alert('Veuillez saisir un pseudo pour votre compte !'); return; }
    
    let res;
    const btn = document.getElementById('btn-modal-cloud-login-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Chargement...';
    btn.disabled = true;

    try {
      if (cloudLoginMode === 'signup') {
        res = await StorageManager.registerCloudAccount(email, passcode, username);
      } else {
        res = await StorageManager.loginCloudAccount(email, passcode);
      }
    } catch (e) {
      res = { success: false, message: e.message };
    }

    btn.innerHTML = originalText;
    btn.disabled = false;

    if (res.success) {
      const modal = document.getElementById('modal-cloud-login');
      if (modal) modal.classList.remove('active');
      SoundFX.playLevelUp();
      
      // Check daily login for the newly loaded cloud profile
      GamificationEngine.checkDailyLogin(StorageManager.getProfile()).then((loginReward) => {
        app.updateHeaderStats();
        if (loginReward) {
          app.showDailyRewardPopup(loginReward);
        }
      });

      // Refresh views without re-running init (avoids duplicate listeners)
      app.switchView('subjects-view');
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      const activeNav = document.querySelector('.nav-btn[data-target="subjects-view"]');
      if (activeNav) activeNav.classList.add('active');
      
      app.applyUserTheme();
      app.renderSubjects();
      app.renderShop();
      app.renderProfile();
      app.updatePausedBanner();
      app.pollFriendNotifications();
      app.renderFriends();
    } else {
      alert('Erreur : ' + (res.message || 'Identifiants incorrects.'));
    }
  });

  safeOn('btn-modal-cloud-skip', 'click', () => {
    const modal = document.getElementById('modal-cloud-login');
    if (modal) modal.classList.remove('active');
  });

  safeOn('btn-open-cloud-modal', 'click', () => {
    const modal = document.getElementById('modal-cloud-login');
    if (modal) modal.classList.add('active');
  });

  safeOn('btn-open-legal-modal', 'click', () => {
    const modal = document.getElementById('modal-legal-notice');
    if (modal) modal.classList.add('active');
  });

  safeOn('btn-profile-open-legal', 'click', () => {
    const modal = document.getElementById('modal-legal-notice');
    if (modal) modal.classList.add('active');
  });

  safeOn('btn-close-legal-modal', 'click', () => {
    const modal = document.getElementById('modal-legal-notice');
    if (modal) modal.classList.remove('active');
  });

  safeOn('btn-copy-ai-prompt', 'click', () => {
    const promptText = document.getElementById('ai-prompt-content')?.innerText || '';
    if (promptText) {
      navigator.clipboard.writeText(promptText).then(() => {
        const status = document.getElementById('copy-ai-prompt-status');
        if (status) {
          status.style.display = 'block';
          setTimeout(() => { status.style.display = 'none'; }, 3000);
        }
      }).catch(() => {
        alert('Prompt copié !');
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp, { once: true });
} else {
  startApp();
}


})();
