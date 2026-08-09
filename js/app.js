// Main application controller linking UI, QuizEngine, Gamification, Storage, Audio, and Multiplayer
import { StorageManager } from './storage.js';
import { QuizEngine } from './quizEngine.js';
import { GamificationEngine, SHOP_ITEMS, ACHIEVEMENTS, EXCLUSIVE_EMOJIS } from './gamification.js';
import { CSVParser } from './csvParser.js';
import { SoundFX } from './audio.js';
import { MultiplayerEngine } from './multiplayer.js';
import { lookupByFriendId, addFriend, getFriends, removeFriend, sendFriendNotification, getMyNotifications, markNotificationRead, getDB, submitCommunitySubject, fetchPendingCommunitySubjects, fetchAcceptedCommunitySubjects, updateCommunitySubjectStatus, updateCommunitySubjectCategory, uploadRewardImage, getRewardImageUrl, deleteCommunitySubject } from './cloudDB.js';

const safeOn = (id, event, fn) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
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

  init() {
    const profile = StorageManager.getProfile();
    
    // Unlock everything for admin
    if (profile.name && profile.name.toLowerCase() === 'admin') {
      import('./gamification.js').then(({ SHOP_ITEMS }) => {
        let dirty = false;
        SHOP_ITEMS.forEach(item => {
          if (!profile.purchasedItems.includes(item.id)) {
            profile.purchasedItems.push(item.id);
            dirty = true;
          }
        });
        if (dirty) StorageManager.saveProfile(profile);
      });
    }

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
    this.renderCategoryFilters();
    this.renderSubjects();
    this.updatePausedBanner();
    this.renderShop();
    this.renderProfile();
    this.setupCSVImporter();
    this.setupEventListeners();

    this.setupFriendSystem();

    // Periodic 5-minute silent background cloud sync heartbeat (heavy profile sync)
    setInterval(async () => {
      const updated = await StorageManager.syncFromCloudSilent();
      if (updated) {
        this.updateHeaderStats();
        this.updatePausedBanner();
        if (document.getElementById('subjects-view')?.classList.contains('active')) {
          this.renderSubjects();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

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

    subfoldersMap.forEach(folder => {
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
            <button class="btn-secondary btn-delete-folder" data-folder="${folder.name}" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);" title="Supprimer ce dossier">🗑️</button>
            <button class="btn-primary btn-open-folder" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Ouvrir 📂</button>
          </div>
        </div>
      `;

      card.querySelector('.btn-share-folder').addEventListener('click', (e) => {
        e.stopPropagation();
        this.shareFolderToCommunity(folder.name, folder.decks);
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

    directDecks.forEach(sub => {
      this.renderDeckCard(container, sub);
    });

    this.triggerMathJax();
  }

  renderDeckCard(container, sub) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    const qCount = sub.questions ? sub.questions.length : 0;
    const cleanName = sub.pathParts ? sub.pathParts[sub.pathParts.length - 1] : sub.name;

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
                <h3 class="subject-title" style="font-size: 1.1rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${cleanName}</h3>
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
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn-secondary btn-organize-deck" data-sub="${sub.id}" style="padding: 0.4rem 0.5rem; font-size: 0.8rem;" title="Déplacer vers un dossier">⚙️ Organiser</button>
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
      if (confirm(`Voulez-vous vraiment supprimer le paquet "${sub.name}" ?`)) {
        const subjects = StorageManager.getSubjects();
        delete subjects[sub.id];
        StorageManager.saveSubjects(subjects);
        this.renderSubjects();
      }
    });

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
        const badgeEl = document.createElement('div');
        badgeEl.style.padding = '0.3rem 0.6rem';
        badgeEl.style.background = 'rgba(255,255,255,0.1)';
        badgeEl.style.borderRadius = 'var(--radius-sm)';
        badgeEl.style.fontSize = '0.8rem';
        badgeEl.style.display = 'flex';
        badgeEl.style.alignItems = 'center';
        badgeEl.style.gap = '0.3rem';
        
        let icon = '🏅';
        if (bId.includes('perfect')) icon = '🌟';
        if (bId.includes('streak')) icon = '🔥';
        if (bId.includes('level')) icon = '👑';
        if (bId.includes('coins')) icon = '💰';
        
        badgeEl.innerHTML = `<span>${icon}</span> <span>${bId.split('_').pop()}</span>`;
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

    if (nextBtn) nextBtn.style.display = 'none';
    if (saveExitBtn) saveExitBtn.style.display = 'none';
    if (expBox) expBox.style.display = 'none';

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
    if (questionTextEl) questionTextEl.innerHTML = question.question;

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      question.shuffledOptions.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.setAttribute('data-option', opt);
        if (question.disabledOptions.includes(opt)) {
          card.classList.add('disabled');
        }

        card.innerHTML = `<span>${opt}</span><span class="opt-check"></span>`;
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

        // Append explicit red wrong text inside card
        if (!targetCard.querySelector('.wrong-tag')) {
          const tag = document.createElement('div');
          tag.className = 'wrong-tag';
          tag.style.cssText = 'color: #fca5a5; font-size: 0.85rem; font-weight: 700; margin-top: 0.35rem;';
          tag.textContent = '❌ Votre réponse (Incorrecte -5 pts)';
          targetCard.appendChild(tag);
        }
      }

      // Highlight exact correct answer in vibrant green
      allCards.forEach(c => {
        const optVal = c.getAttribute('data-option');
        const textVal = c.querySelector('span')?.textContent || c.textContent;
        if (optVal === result.correctAnswer || textVal.trim().includes(result.correctAnswer.trim()) || result.correctAnswer.trim().includes(textVal.trim())) {
          c.classList.add('correct');
          c.style.setProperty('background-color', 'rgba(16, 185, 129, 0.4)', 'important');
          c.style.setProperty('border', '3px solid #10b981', 'important');
          c.style.setProperty('box-shadow', '0 0 25px rgba(16, 185, 129, 0.7)', 'important');
          c.style.setProperty('color', '#ffffff', 'important');
          const checkEl = c.querySelector('.opt-check');
          if (checkEl) checkEl.textContent = '✓';

          if (!c.querySelector('.correct-tag')) {
            const tag = document.createElement('div');
            tag.className = 'correct-tag';
            tag.style.cssText = 'color: #6ee7b7; font-size: 0.85rem; font-weight: 700; margin-top: 0.35rem;';
            tag.textContent = '✅ Bonne réponse';
            c.appendChild(tag);
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
        expText.innerHTML = result.explanation;
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
        targetCard.style.setProperty('background-color', 'rgba(16, 185, 129, 0.4)', 'important');
        targetCard.style.setProperty('border', '3px solid #10b981', 'important');
      }
      SoundFX.playCorrect();
    } else {
      if (targetCard) {
        targetCard.style.setProperty('background-color', 'rgba(239, 68, 68, 0.5)', 'important');
        targetCard.style.setProperty('border', '3px solid #ef4444', 'important');
      }
      SoundFX.playWrong();

      // Show correct answer
      allCards.forEach(c => {
        if (c.getAttribute('data-option') === result.correctAnswer) {
          c.style.setProperty('background-color', 'rgba(16, 185, 129, 0.4)', 'important');
          c.style.setProperty('border', '3px solid #10b981', 'important');
        }
      });
    }

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

      if (result.isFinished || this.duelState.questionIndex >= this.duelState.questions.length) {
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
      unverifiedBanner.innerHTML = '⚠️ <b>Mode Entraînement :</b> Ce paquet n\'est pas vérifié par la communauté. Vous ne gagnez ni pièces ni XP.';
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

      const isFolder = sub.questions_data.is_folder === true;
      const qPreview = isFolder 
        ? `${sub.questions_data.subjects.length} cours inclus dans ce dossier.`
        : sub.questions_data.slice(0, 2).map(q => `Q: ${q.question} | R: ${q.correct !== undefined ? q.correct : (q.correct_answer || 'N/A')}`).join('<br>');
      
      const itemDesc = isFolder ? `${sub.questions_data.subjects.length} cours` : `${sub.questions_data.length} questions`;
      const itemIcon = isFolder ? '📁' : '📄';

      let adminDeleteBtn = '';
      const profile = StorageManager.getProfile();
      if (profile && profile.name && profile.name.toLowerCase() === 'admin') {
        adminDeleteBtn = `<button class="btn-primary btn-delete-community" data-id="${sub.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem; background-color: var(--accent-red); margin-left: 0.5rem;">🗑️ Supprimer</button>`;
      }

      card.innerHTML = `
        <div style="flex: 1;">
          <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; color: white;">${itemIcon} ${sub.subject_name}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">Par <strong>${sub.author}</strong> • ${itemDesc} • ${sub.category}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem; border-left: 2px solid var(--accent-cyan); padding-left: 0.5rem;">
            ${qPreview} ${isFolder ? '' : '...'}
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="btn-primary btn-import-community" data-id="${sub.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">⬇️ Importer</button>
          ${adminDeleteBtn}
        </div>
      `;

      const btn = card.querySelector('.btn-import-community');
      btn.onclick = () => {
        if (isFolder) {
          sub.questions_data.subjects.forEach((nestedSub, idx) => {
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
            questions: sub.questions_data
          };
          StorageManager.addSubject(newSubject);
        }
        
        btn.textContent = '✅ Importé !';
        btn.style.backgroundColor = 'var(--accent-green)';
        btn.disabled = true;
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
    
    content.innerHTML = '';
    
    const isFolder = sub.questions_data.is_folder === true;
    
    if (isFolder) {
      content.innerHTML = `<h3 style="color: var(--accent-cyan); margin-bottom: 1rem;">Dossier : ${sub.subject_name} (${sub.questions_data.subjects.length} cours)</h3>`;
      sub.questions_data.subjects.forEach((nestedSub, idx) => {
        let html = `<div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1rem;">`;
        html += `<h4 style="margin-bottom: 0.5rem; color: white;">Cours ${idx + 1} : ${nestedSub.name}</h4>`;
        if (nestedSub.questions) {
          nestedSub.questions.forEach((q, qIdx) => {
            const ans = q.correct !== undefined ? q.correct : (q.correct_answer || 'N/A');
            html += `<div style="font-size: 0.85rem; margin-bottom: 0.25rem; border-left: 2px solid var(--accent-green); padding-left: 0.5rem;"><span style="color: var(--text-secondary);">Q${qIdx+1}:</span> ${q.question} <br> <span style="color: var(--text-secondary);">R:</span> <span style="color: var(--accent-green);">${ans}</span></div>`;
          });
        }
        html += `</div>`;
        content.innerHTML += html;
      });
    } else {
      content.innerHTML = `<h3 style="color: var(--accent-cyan); margin-bottom: 1rem;">Paquet : ${sub.subject_name} (${sub.questions_data.length} questions)</h3>`;
      sub.questions_data.forEach((q, qIdx) => {
        const ans = q.correct !== undefined ? q.correct : (q.correct_answer || 'N/A');
        const wrongAns = q.incorrect ? q.incorrect.join(', ') : (q.incorrect_answers ? q.incorrect_answers.join(', ') : '');
        let html = `<div style="font-size: 0.9rem; margin-bottom: 0.75rem; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 6px;">`;
        html += `<div style="margin-bottom: 0.25rem;"><strong>Q${qIdx+1}:</strong> ${q.question}</div>`;
        html += `<div style="color: var(--accent-green);"><strong>Vrai:</strong> ${ans}</div>`;
        if (wrongAns) {
          html += `<div style="color: var(--accent-red); opacity: 0.8; font-size: 0.8rem;"><strong>Faux:</strong> ${wrongAns}</div>`;
        }
        html += `</div>`;
        content.innerHTML += html;
      });
    }

    modal.classList.add('active');
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

      const isFolder = sub.questions_data.is_folder === true;
      const qPreview = isFolder 
        ? `${sub.questions_data.subjects.length} cours inclus.`
        : sub.questions_data.slice(0, 2).map(q => `Q: ${q.question} | R: ${q.correct !== undefined ? q.correct : (q.correct_answer || 'N/A')}`).join('<br>');

      card.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <div style="font-size: 1.1rem; font-weight: 700; color: white;">${sub.subject_name} <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-secondary);">par ${sub.author}</span></div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${sub.questions_data.length} questions</div>
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
        this.processCSVFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        this.processCSVFile(fileInput.files[0]);
      }
    });
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

        const newSubject = {
          id: `custom_sub_${Date.now()}`,
          name: subjectName,
          pathParts: [subjectName],
          icon: res.isAnkiDeck ? '🎴' : '📑',
          category: res.isAnkiDeck ? 'Paquet Anki' : 'Mes Cours CSV',
          description: res.isAnkiDeck
            ? `Importé depuis Anki (${res.count} cartes avec fausses réponses auto-générées).`
            : `Cours importé avec ${res.count} questions.`,
          verified: false,
          questions: res.questions
        };

        StorageManager.addSubject(newSubject);
        resultBox.innerHTML = `
          <h4 style="color: var(--accent-green);">✅ Importation réussie !</h4>
          <p>${res.count} cartes/questions ajoutées avec succès à la matière "${subjectName}".</p>
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
            const category = res.isAnkiDeck ? 'Anki' : 'CSV';
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
      app.switchView('home-view');
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp, { once: true });
} else {
  startApp();
}
