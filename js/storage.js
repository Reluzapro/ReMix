// Storage module for persistent user data, custom subjects, SRS spacing (Anki decay intervals), and statistics
import { DEFAULT_SUBJECTS } from './questionsData.js';

const STORAGE_KEYS = {
  SUBJECTS: 'rev_game_subjects_v6',
  USER_PROFILE: 'rev_game_profile_v3',
  REVISION_ITEMS: 'rev_game_revision_items_v2',
  CARD_SRS: 'rev_game_card_srs_v2',
  SETTINGS: 'rev_game_settings_v2'
};

const DEFAULT_PROFILE = {
  id: 'default_user',
  name: 'Réviseur Pro',
  avatar: '🎓',
  level: 1,
  xp: 0,
  coins: 50,
  streak: 0,
  maxStreak: 0,
  lastPlayedDate: null,
  theme: 'theme-cyberpunk',
  purchasedItems: ['theme-cyberpunk', 'avatar-student'],
  inventory: {
    powerup_fifty: 2,
    powerup_time: 2,
    powerup_skip: 1
  },
  customRewards: [],
  unlockedAchievements: [],
  stats: {
    gamesPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    skippedAnswers: 0,
    perfectGames: 0,
    subjectStats: {}
  }
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  volume: 0.7,
  timerDuration: 20,
  questionsPerSession: 10
};

// Anki-style interval ladder (in days)
const ANKI_INTERVAL_LADDER = [1, 3, 7, 15, 30, 90, 180, 365, 730];

export class StorageManager {
  static getSubjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (!data) {
        this.saveSubjects(DEFAULT_SUBJECTS);
        return DEFAULT_SUBJECTS;
      }
      const custom = JSON.parse(data);
      return { ...DEFAULT_SUBJECTS, ...custom };
    } catch (e) {
      console.error('Error loading subjects:', e);
      return DEFAULT_SUBJECTS;
    }
  }

  static saveSubjects(subjects) {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error('Error saving subjects:', e);
    }
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
      if (!data) {
        this.saveProfile(DEFAULT_PROFILE);
        return { ...DEFAULT_PROFILE };
      }
      const profile = JSON.parse(data);
      return { ...DEFAULT_PROFILE, ...profile, stats: { ...DEFAULT_PROFILE.stats, ...(profile.stats || {}) } };
    } catch (e) {
      console.error('Error loading profile:', e);
      return { ...DEFAULT_PROFILE };
    }
  }

  static saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  }

  /* --- SRS Spaced Repetition Engine with Time-Decay --- */
  static getSRSData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARD_SRS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  static updateCardSRS(cardId, isCorrect) {
    const allSRS = this.getSRSData();
    const now = Date.now();

    let cardData = allSRS[cardId] || {
      reps: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      lastReviewed: null,
      nextDue: now,
      baseMastery: 0.0
    };

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
    } catch (e) {
      console.error('Error saving SRS data:', e);
    }

    return cardData;
  }

  /**
   * Calculates effective mastery for a single card taking time decay into account.
   * If a card hasn't been reviewed and is past due date, its mastery decays towards 0 over time!
   */
  static getEffectiveCardMastery(cardSRS) {
    if (!cardSRS || !cardSRS.lastReviewed) return 0.0;

    const now = Date.now();
    const baseMastery = cardSRS.baseMastery !== undefined ? cardSRS.baseMastery : 0.8;

    if (now <= cardSRS.nextDue) {
      return baseMastery;
    }

    // Days past due date
    const overdueDays = (now - cardSRS.nextDue) / (1000 * 60 * 60 * 24);

    // Exponential decay curve: 50% loss every 14 days overdue
    const decayMultiplier = Math.exp(-0.05 * overdueDays);
    const effective = Math.max(0.05, baseMastery * decayMultiplier);

    return effective;
  }

  static getDeckMastery(deck) {
    if (!deck || !deck.questions || deck.questions.length === 0) {
      return { percentage: 0, colorHex: '#9ca3af', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.1)' };
    }

    const allSRS = this.getSRSData();
    let totalMastery = 0;
    let reviewedCount = 0;

    deck.questions.forEach(q => {
      const cardSRS = allSRS[q.id];
      if (cardSRS && cardSRS.lastReviewed) {
        totalMastery += this.getEffectiveCardMastery(cardSRS);
        reviewedCount += 1;
      }
    });

    if (reviewedCount === 0) {
      return { percentage: 0, colorHex: '#6b7280', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.15)' };
    }

    const percentage = Math.round((totalMastery / deck.questions.length) * 100);

    if (percentage >= 75) {
      return {
        percentage,
        colorHex: '#10b981',
        statusText: `🟢 ${percentage}% Maîtrisé`,
        borderStyle: '1px solid #10b981',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
      };
    } else if (percentage >= 40) {
      return {
        percentage,
        colorHex: '#f59e0b',
        statusText: `🟡 ${percentage}% À réviser bientôt`,
        borderStyle: '1px solid #f59e0b',
        boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
      };
    } else {
      return {
        percentage,
        colorHex: '#ef4444',
        statusText: `🔴 ${percentage}% À réviser d'urgence`,
        borderStyle: '1px solid #ef4444',
        boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)'
      };
    }
  }

  static getFolderMastery(deckList) {
    if (!deckList || deckList.length === 0) {
      return { percentage: 0, colorHex: '#6b7280', statusText: '⚪ Non révisé', borderStyle: 'rgba(255, 255, 255, 0.15)' };
    }

    let sumMastery = 0;
    deckList.forEach(deck => {
      const res = this.getDeckMastery(deck);
      sumMastery += res.percentage;
    });

    const folderPercentage = Math.round(sumMastery / deckList.length);

    if (folderPercentage >= 75) {
      return {
        percentage: folderPercentage,
        colorHex: '#10b981',
        statusText: `🟢 ${folderPercentage}% Maîtrisé`,
        borderStyle: '1px solid #10b981',
        boxShadow: '0 0 14px rgba(16, 185, 129, 0.45)'
      };
    } else if (folderPercentage >= 40) {
      return {
        percentage: folderPercentage,
        colorHex: '#f59e0b',
        statusText: `🟡 ${folderPercentage}% En désuétude`,
        borderStyle: '1px solid #f59e0b',
        boxShadow: '0 0 14px rgba(245, 158, 11, 0.45)'
      };
    } else if (folderPercentage > 0) {
      return {
        percentage: folderPercentage,
        colorHex: '#ef4444',
        statusText: `🔴 ${folderPercentage}% À réviser d'urgence`,
        borderStyle: '1px solid #ef4444',
        boxShadow: '0 0 14px rgba(239, 68, 68, 0.45)'
      };
    } else {
      return {
        percentage: 0,
        colorHex: '#6b7280',
        statusText: '⚪ Non révisé',
        borderStyle: 'rgba(255, 255, 255, 0.15)',
        boxShadow: 'none'
      };
    }
  }

  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return { ...DEFAULT_SETTINGS };
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  static saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  static getRevisionItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISION_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static addRevisionItem(questionItem, subjectId) {
    const items = this.getRevisionItems();
    const existingIndex = items.findIndex(i => i.question === questionItem.question);
    if (existingIndex >= 0) {
      items[existingIndex].failCount = (items[existingIndex].failCount || 1) + 1;
      items[existingIndex].lastFailed = Date.now();
    } else {
      items.push({
        ...questionItem,
        subjectId: subjectId,
        failCount: 1,
        lastFailed: Date.now()
      });
    }
    localStorage.setItem(STORAGE_KEYS.REVISION_ITEMS, JSON.stringify(items));
  }

  static removeRevisionItem(questionText) {
    let items = this.getRevisionItems();
    items = items.filter(i => i.question !== questionText);
    localStorage.setItem(STORAGE_KEYS.REVISION_ITEMS, JSON.stringify(items));
  }

  static exportAllData() {
    const backup = {
      subjects: this.getSubjects(),
      profile: this.getProfile(),
      settings: this.getSettings(),
      srs: this.getSRSData(),
      revisionItems: this.getRevisionItems(),
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `revision_game_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static importData(jsonContent) {
    try {
      const data = JSON.parse(jsonContent);
      if (data.subjects) this.saveSubjects(data.subjects);
      if (data.profile) this.saveProfile(data.profile);
      if (data.settings) this.saveSettings(data.settings);
      if (data.srs) localStorage.setItem(STORAGE_KEYS.CARD_SRS, JSON.stringify(data.srs));
      if (data.revisionItems) localStorage.setItem(STORAGE_KEYS.REVISION_ITEMS, JSON.stringify(data.revisionItems));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.REVISION_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.CARD_SRS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}
