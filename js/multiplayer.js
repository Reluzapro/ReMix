// Real-time WebRTC Multiplayer Engine using PeerJS for cross-network 1v1 Duels — with Supabase Global Leaderboard
import { StorageManager } from './storage.js';
import { fetchCloudLeaderboard } from './cloudDB.js';

export class MultiplayerEngine {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.activeRoom = null;
  }

  static generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return `DUEL-${code}`;
  }

  // Returns leaderboard from Supabase Cloud (real players worldwide), falls back to localStorage
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

    // Fetch from Supabase Cloud
    let cloudPlayers = await fetchCloudLeaderboard();

    // Fall back to localStorage if cloud unavailable
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
      if (!isValid) return; // Strict: skip cheated accounts

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

    // Always include local user
    if (isVerified) {
      mapPlayers.set(userEntry.name.toLowerCase(), userEntry);
    }

    return Array.from(mapPlayers.values()).sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.coins - a.coins;
    });
  }

  initHostPeer(roomCode, roomData, onPlayerJoinedCallback, onDataReceivedCallback) {
    const peerId = `remix_${roomCode.replace('-', '_').toLowerCase()}`;
    if (window.Peer) {
      try {
        this.peer = new window.Peer(peerId);
        this.peer.on('open', id => console.log('PeerJS Host Ready:', id));
        this.peer.on('connection', connection => {
          this.conn = connection;
          this.conn.on('open', () => {
            this.conn.send({ type: 'ROOM_SETUP', room: roomData });
            if (onPlayerJoinedCallback) onPlayerJoinedCallback(this.conn);
          });
          this.conn.on('data', data => { if (onDataReceivedCallback) onDataReceivedCallback(data); });
        });
        this.peer.on('error', err => console.log('PeerJS Host Error:', err));
      } catch (e) {}
    }
  }

  initGuestPeer(roomCode, onConnectedCallback, onDataReceivedCallback) {
    const hostPeerId = `remix_${roomCode.replace('-', '_').toLowerCase()}`;
    if (window.Peer) {
      try {
        this.peer = new window.Peer();
        this.peer.on('open', () => {
          this.conn = this.peer.connect(hostPeerId);
          this.conn.on('open', () => {
            const profile = StorageManager.getProfile();
            this.conn.send({ type: 'GUEST_JOINED', guest: { name: profile.name, avatar: profile.avatar } });
            if (onConnectedCallback) onConnectedCallback(this.conn);
          });
          this.conn.on('data', data => { if (onDataReceivedCallback) onDataReceivedCallback(data); });
        });
        this.peer.on('error', err => console.log('PeerJS Guest Error:', err));
      } catch (e) {}
    }
  }

  sendWebRTCData(payload) {
    if (this.conn && this.conn.open) this.conn.send(payload);
  }

  static createRoom({ subject, wager, questionCount = 5 }) {
    const profile = StorageManager.getProfile();
    if (profile.coins < wager) return { success: false, message: `Pièces insuffisantes (${profile.coins} 🪙 disponibles, ${wager} 🪙 requis) !` };
    const roomCode = this.generateRoomCode();
    const questions = [...subject.questions].sort(() => Math.random() - 0.5).slice(0, questionCount);
    const room = {
      code: roomCode, subjectId: subject.id, subjectName: subject.name, wager,
      host: { name: profile.name, avatar: profile.avatar, score: 0, currentIdx: 0, finished: false },
      guest: null, questions, status: 'WAITING_FOR_PLAYER', createdTime: Date.now()
    };
    profile.coins -= wager;
    StorageManager.saveProfile(profile);
    localStorage.setItem(`remix_room_${roomCode}`, JSON.stringify(room));
    return { success: true, roomCode, room };
  }

  static joinRoom({ roomCode }) {
    const profile = StorageManager.getProfile();
    const formattedCode = roomCode.toUpperCase().trim();
    const roomData = localStorage.getItem(`remix_room_${formattedCode}`);
    if (!roomData) {
      const subjects = StorageManager.getSubjects();
      const sub = Object.values(subjects)[0];
      if (profile.coins < 100) return { success: false, message: 'Pièces insuffisantes (100 🪙 requis) !' };
      profile.coins -= 100;
      StorageManager.saveProfile(profile);
      return { success: true, room: {
        code: formattedCode, subjectId: sub.id, subjectName: sub.name, wager: 100,
        host: { name: 'Adversaire_En_Ligne', avatar: '⚔️', score: 0, currentIdx: 0, finished: false },
        guest: { name: profile.name, avatar: profile.avatar, score: 0, currentIdx: 0, finished: false },
        questions: [...sub.questions].sort(() => Math.random() - 0.5).slice(0, 5),
        status: 'PLAYING', createdTime: Date.now()
      }};
    }
    const room = JSON.parse(roomData);
    if (profile.coins < room.wager) return { success: false, message: `Pièces insuffisantes ! Il vous faut ${room.wager} 🪙.` };
    profile.coins -= room.wager;
    StorageManager.saveProfile(profile);
    room.guest = { name: profile.name, avatar: profile.avatar, score: 0, currentIdx: 0, finished: false };
    room.status = 'PLAYING';
    localStorage.setItem(`remix_room_${formattedCode}`, JSON.stringify(room));
    return { success: true, room };
  }

  static resolveDuel(room, userScore, botScore) {
    const profile = StorageManager.getProfile();
    profile.stats = profile.stats || {};
    profile.stats.duelPlayed = (profile.stats.duelPlayed || 0) + 1;
    const pot = room.wager * 2;
    let result = '';
    if (userScore > botScore) {
      profile.coins += pot;
      profile.stats.duelWins = (profile.stats.duelWins || 0) + 1;
      profile.xp += 150;
      result = 'VICTORY';
    } else if (userScore === botScore) {
      profile.coins += room.wager;
      result = 'DRAW';
    } else {
      profile.stats.duelLosses = (profile.stats.duelLosses || 0) + 1;
      result = 'DEFEAT';
    }
    StorageManager.saveProfile(profile);
    return { result, pot, wager: room.wager, coinsEarned: result === 'VICTORY' ? pot : (result === 'DRAW' ? room.wager : 0), userScore, botScore };
  }
}
