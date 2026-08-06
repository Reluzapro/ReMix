// Real-time Multiplayer Engine using Supabase Realtime for 1v1 Duels — with Global Leaderboard
import { StorageManager } from './storage.js';
import { fetchCloudLeaderboard } from './cloudDB.js';

// Duel emojis available to all players (no purchase needed)
export const DUEL_EMOJIS = [
  { id: 'fire', emoji: '🔥', label: 'Enflammé' },
  { id: 'brain', emoji: '🧠', label: 'Cerveau' },
  { id: 'rocket', emoji: '🚀', label: 'Fusée' },
  { id: 'lightning', emoji: '⚡', label: 'Éclair' },
  { id: 'trophy', emoji: '🏆', label: 'Trophée' },
  { id: 'laugh', emoji: '😂', label: 'Rire' },
  { id: 'cool', emoji: '😎', label: 'Cool' },
  { id: 'party', emoji: '🎉', label: 'Fête' },
  { id: 'exploding', emoji: '🤯', label: 'Mind Blown' },
  { id: 'thinking', emoji: '🤔', label: 'Réflexion' }
];

export class MultiplayerEngine {
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
        MultiplayerEngine._db = window.supabase.createClient(
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
      player1Id: profile.cloudAccount?.username || profile.name,
      player1Name: profile.name,
      player1Avatar: profile.avatar || '🎓',
      questionsData: questionsClean
    });

    if (!battle) return { success: false, message: 'Erreur serveur. Réessayez.' };
    return { success: true, battle, code };
  }

  static async joinPrivateRoom(code) {
    const profile = StorageManager.getProfile();
    const myUsername = profile.cloudAccount?.username || profile.name;

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
    const myUsername = profile.cloudAccount?.username || profile.name;

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

      if (!updated) return { success: false, message: 'Erreur matchmaking.' };
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
    return { result, coinsEarned, wager, myScore, oppScore };
  }

  // --- Leaderboard (unchanged) ---
  static async getLeaderboard() {
    const profile = StorageManager.getProfile();
    const isVerified = StorageManager.verifyAntiCheatToken(profile);

    const userEntry = {
      name: profile.name || 'Réviseur Pro',
      level: profile.level || 1,
      xp: profile.xp || 0,
      coins: profile.coins || 0,
      wins: profile.stats?.duelWins || 0,
      avatar: profile.avatar || '🎓',
      isUser: true,
      isVerified
    };

    let cloudPlayers = await fetchCloudLeaderboard();

    if (!cloudPlayers || cloudPlayers.length === 0) {
      cloudPlayers = StorageManager.getGlobalLeaderboardRegistry().map(p => ({
        name: p.name, level: p.level, xp: p.xp || 0, coins: p.coins, wins: p.wins,
        avatar: p.avatar, checksum_token: p.checksumToken
      }));
    }

    const mapPlayers = new Map();

    cloudPlayers.forEach(player => {
      const profileLike = { ...player, checksumToken: player.checksum_token, stats: { duelWins: player.wins } };
      const isValid = StorageManager.verifyAntiCheatToken(profileLike);
      if (!isValid) return;

      const isMe = player.name.toLowerCase() === userEntry.name.toLowerCase();
      mapPlayers.set(player.name.toLowerCase(), {
        name: player.name,
        level: player.level,
        xp: player.xp || 0,
        coins: player.coins,
        wins: player.wins,
        avatar: player.avatar,
        isUser: isMe,
        isVerified: true
      });
    });

    if (isVerified) {
      mapPlayers.set(userEntry.name.toLowerCase(), userEntry);
    }

    return Array.from(mapPlayers.values()).sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.coins - a.coins;
    });
  }
}
