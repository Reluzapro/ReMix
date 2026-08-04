// Real-time WebRTC Multiplayer Engine using PeerJS for cross-network 1v1 Duels
import { StorageManager } from './storage.js';
import { SoundFX } from './audio.js';

export class MultiplayerEngine {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.activeRoom = null;
  }

  static generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `DUEL-${code}`;
  }

  static getLeaderboard() {
    const profile = StorageManager.getProfile();

    const defaultBots = [
      { name: 'Sophie_ATS', level: 24, coins: 4800, wins: 42, avatar: '🧙‍♀️' },
      { name: 'Lucas_Meca', level: 19, coins: 3200, wins: 31, avatar: '🥷' },
      { name: 'Emma_Thermo', level: 15, coins: 2450, wins: 23, avatar: '🤖' },
      { name: 'Thomas_Elec', level: 12, coins: 1800, wins: 18, avatar: '🎓' },
      { name: 'Camille_Maths', level: 9, coins: 1100, wins: 11, avatar: '📐' }
    ];

    const userEntry = {
      name: profile.name || 'Réviseur Pro',
      level: profile.level || 1,
      coins: profile.coins || 0,
      wins: profile.stats?.duelWins || 0,
      avatar: profile.avatar || '🎓',
      isUser: true
    };

    let allPlayers = [...defaultBots, userEntry];

    try {
      const customData = localStorage.getItem('remix_global_leaderboard');
      if (customData) {
        const extra = JSON.parse(customData);
        extra.forEach(p => {
          if (p.name !== userEntry.name) allPlayers.push(p);
        });
      }
    } catch (e) {}

    allPlayers.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.coins - a.coins;
    });

    return allPlayers;
  }

  initHostPeer(roomCode, roomData, onPlayerJoinedCallback, onDataReceivedCallback) {
    const peerId = `remix_${roomCode.replace('-', '_').toLowerCase()}`;

    if (window.Peer) {
      try {
        this.peer = new window.Peer(peerId);

        this.peer.on('open', (id) => {
          console.log('PeerJS Host Ready:', id);
        });

        this.peer.on('connection', (connection) => {
          this.conn = connection;

          this.conn.on('open', () => {
            console.log('Player connected over WebRTC!');
            // Send initial room setup data to guest
            this.conn.send({ type: 'ROOM_SETUP', room: roomData });
            if (onPlayerJoinedCallback) onPlayerJoinedCallback(this.conn);
          });

          this.conn.on('data', (data) => {
            if (onDataReceivedCallback) onDataReceivedCallback(data);
          });
        });

        this.peer.on('error', (err) => {
          console.log('PeerJS Host Error / Fallback:', err);
        });
      } catch (e) {
        console.error('PeerJS init failed:', e);
      }
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
            console.log('Connected to Host WebRTC Peer!');
            const profile = StorageManager.getProfile();
            this.conn.send({
              type: 'GUEST_JOINED',
              guest: { name: profile.name, avatar: profile.avatar }
            });
            if (onConnectedCallback) onConnectedCallback(this.conn);
          });

          this.conn.on('data', (data) => {
            if (onDataReceivedCallback) onDataReceivedCallback(data);
          });
        });

        this.peer.on('error', (err) => {
          console.log('PeerJS Guest Error / Fallback:', err);
        });
      } catch (e) {
        console.error('PeerJS guest init failed:', e);
      }
    }
  }

  sendWebRTCData(payload) {
    if (this.conn && this.conn.open) {
      this.conn.send(payload);
    }
  }

  static createRoom({ subject, wager, questionCount = 5 }) {
    const profile = StorageManager.getProfile();
    if (profile.coins < wager) {
      return { success: false, message: `Vous n'avez pas assez de pièces (${profile.coins} 🪙) pour parier ${wager} 🪙 !` };
    }

    const roomCode = this.generateRoomCode();
    const questions = [...subject.questions].sort(() => Math.random() - 0.5).slice(0, questionCount);

    const room = {
      code: roomCode,
      subjectId: subject.id,
      subjectName: subject.name,
      wager: wager,
      host: {
        name: profile.name,
        avatar: profile.avatar,
        score: 0,
        currentIdx: 0,
        finished: false
      },
      guest: null,
      questions: questions,
      status: 'WAITING_FOR_PLAYER',
      createdTime: Date.now()
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
      const firstSubKey = Object.keys(subjects)[0];
      const sub = subjects[firstSubKey];

      const simRoom = {
        code: formattedCode,
        subjectId: sub.id,
        subjectName: sub.name,
        wager: 100,
        host: { name: 'Adversaire_En_Ligne', avatar: '⚔️', score: 0, currentIdx: 0, finished: false },
        guest: { name: profile.name, avatar: profile.avatar, score: 0, currentIdx: 0, finished: false },
        questions: [...sub.questions].sort(() => Math.random() - 0.5).slice(0, 5),
        status: 'PLAYING',
        createdTime: Date.now()
      };

      if (profile.coins < 100) {
        return { success: false, message: 'Pièces insuffisantes (100 🪙 requis pour ce duel) !' };
      }

      profile.coins -= 100;
      StorageManager.saveProfile(profile);

      return { success: true, room: simRoom };
    }

    const room = JSON.parse(roomData);
    if (profile.coins < room.wager) {
      return { success: false, message: `Pièces insuffisantes ! Il vous faut ${room.wager} 🪙.` };
    }

    profile.coins -= room.wager;
    StorageManager.saveProfile(profile);

    room.guest = {
      name: profile.name,
      avatar: profile.avatar,
      score: 0,
      currentIdx: 0,
      finished: false
    };
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
      SoundFX.playLevelUp();
    } else if (userScore === botScore) {
      profile.coins += room.wager;
      result = 'DRAW';
    } else {
      profile.stats.duelLosses = (profile.stats.duelLosses || 0) + 1;
      result = 'DEFEAT';
      SoundFX.playWrong();
    }

    StorageManager.saveProfile(profile);

    return {
      result,
      pot,
      wager: room.wager,
      coinsEarned: result === 'VICTORY' ? pot : (result === 'DRAW' ? room.wager : 0),
      userScore,
      botScore
    };
  }
}
