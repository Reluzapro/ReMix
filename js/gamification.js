// Gamification module: XP, Levels, Coins, Shop, Achievements, and Power-ups
import { StorageManager } from './storage.js';
import { SoundFX } from './audio.js';

export const ACHIEVEMENTS = [
  { id: 'ach_first', title: '🎓 Premiers Pas', desc: 'Compléter votre première session de révision.', icon: '🎯' },
  { id: 'ach_perfect', title: '🌟 Sans Faute', desc: 'Obtenir 100% de réponses correctes sur une session.', icon: '🏆' },
  { id: 'ach_streak_5', title: '🔥 Sur une Lance', desc: 'Atteindre un combo de 5 bonnes réponses d\'affilée.', icon: '⚡' },
  { id: 'ach_streak_10', title: '⚡ Inarrêtable', desc: 'Atteindre un combo de 10 bonnes réponses d\'affilée.', icon: '🚀' },
  { id: 'ach_level_5', title: '🧠 Savant Fou', desc: 'Atteindre le niveau 5.', icon: '👑' },
  { id: 'ach_coins_500', title: '💰 Chasseur de Pièces', desc: 'Accumuler un total de 500 pièces.', icon: '🪙' },
  { id: 'ach_shop_buy', title: '🛍️ Client VIP', desc: 'Acheter un élément dans la boutique.', icon: '💎' },
  { id: 'ach_custom_subject', title: '📝 Professeur', desc: 'Importer votre propre cours via CSV.', icon: '📚' }
];

export const SHOP_ITEMS = [
  // Themes
  { id: 'theme-cyberpunk', type: 'theme', title: 'Cyberpunk Neon', desc: 'Style sombre néon violet et cyan', cost: 0, icon: '🌆' },
  { id: 'theme-midnight', type: 'theme', title: 'Midnight Synthwave', desc: 'Ambiance rétro-futuriste bleu profond', cost: 150, icon: '🌃' },
  { id: 'theme-emerald', type: 'theme', title: 'Emerald Forest', desc: 'Design apaisant vert émeraude et or', cost: 200, icon: '🌲' },
  { id: 'theme-solar', type: 'theme', title: 'Solar Flare', desc: 'Mode chaud orange et ambre dynamisant', cost: 250, icon: '☀️' },

  // Avatars
  { id: 'avatar-student', type: 'avatar', title: 'Étudiant Assidu', desc: 'Avatar classique de révision', cost: 0, icon: '🎓' },
  { id: 'avatar-wizard', type: 'avatar', title: 'Mage du Savoir', desc: 'Avatar magique', cost: 100, icon: '🧙‍♂️' },
  { id: 'avatar-robot', type: 'avatar', title: 'IA Réductrice', desc: 'Avatar futuriste', cost: 150, icon: '🤖' },
  { id: 'avatar-ninja', type: 'avatar', title: 'Ninja de la Thermo', desc: 'Rapide et précis', cost: 200, icon: '🥷' },

  // Power-ups
  { id: 'powerup_fifty', type: 'powerup', title: '50 / 50', desc: 'Élimine 2 mauvaises réponses', cost: 40, icon: '✂️' },

  { id: 'powerup_skip', type: 'powerup', title: 'Joker (Passer)', desc: 'Passe la question sans perdre de streak', cost: 60, icon: '⏭️' }
];

export class GamificationEngine {
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
    ACHIEVEMENTS.forEach(ach => {
      if (profile.unlockedAchievements.includes(ach.id)) return;

      let conditionMet = false;
      if (ach.id === 'ach_first' && profile.stats.gamesPlayed >= 1) conditionMet = true;
      if (ach.id === 'ach_perfect' && profile.stats.perfectGames >= 1) conditionMet = true;
      if (ach.id === 'ach_streak_5' && profile.maxStreak >= 5) conditionMet = true;
      if (ach.id === 'ach_streak_10' && profile.maxStreak >= 10) conditionMet = true;
      if (ach.id === 'ach_level_5' && profile.level >= 5) conditionMet = true;
      if (ach.id === 'ach_coins_500' && (profile.totalCoinsEarned || profile.coins) >= 500) conditionMet = true;
      if (ach.id === 'ach_shop_buy' && profile.purchasedItems.length > 2) conditionMet = true;

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

    if (profile.purchasedItems.includes(itemId) && (item.type === 'theme' || item.type === 'avatar')) {
      if (item.type === 'theme') {
        profile.theme = itemId;
        StorageManager.saveProfile(profile);
        return { success: true, message: `Thème "${item.title}" équipé !` };
      } else if (item.type === 'avatar') {
        profile.avatar = item.icon;
        StorageManager.saveProfile(profile);
        return { success: true, message: `Avatar "${item.title}" équipé !` };
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
}
