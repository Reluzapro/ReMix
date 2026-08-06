// Main application controller linking UI, QuizEngine, Gamification, Storage, Audio, and Multiplayer
import { StorageManager } from './storage.js';
import { QuizEngine } from './quizEngine.js';
import { GamificationEngine, SHOP_ITEMS, ACHIEVEMENTS } from './gamification.js';
import { CSVParser } from './csvParser.js';
import { SoundFX } from './audio.js';
import { MultiplayerEngine } from './multiplayer.js';
import { lookupByFriendId, addFriend, getFriends, removeFriend, sendFriendNotification, getMyNotifications, markNotificationRead } from './cloudDB.js';

class AppController {
  constructor() {
    this.quizEngine = new QuizEngine();
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
    GamificationEngine.checkAchievements(StorageManager.getProfile());
    this.resolveAbandonedBattles();
    this.applyUserTheme();
    this.updateHeaderStats();
    this.setupNavigation();
    this.renderCategoryFilters();
    this.renderSubjects();
    this.updatePausedBanner();
    this.renderShop();
    this.renderProfile();
    this.setupCSVImporter();
    this.setupEventListeners();
    this.setupProfileAdminTrigger();
    this.setupFriendSystem();

    // Periodic 30-second silent background cloud sync heartbeat
    setInterval(async () => {
      const updated = await StorageManager.syncFromCloudSilent();
      if (updated) {
        this.updateHeaderStats();
        this.updatePausedBanner();
        if (document.getElementById('subjects-view')?.classList.contains('active')) {
          this.renderSubjects();
        }
      }
      // Poll friend notifications
      await this.pollFriendNotifications();
    }, 30000);

    // Initial notification poll after short delay
    setTimeout(() => this.pollFriendNotifications(), 3000);
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
        <div style="font-size: 1.8rem;">${friend.avatar}</div>
        <div style="flex: 1;">
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
      alert(`✅ Invitation envoyée à ${friendName} ! Code de salon : ${result.code}`);
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

      if (n.type === 'duel_invite') {
        const payload = n.payload || {};
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
        const rew = n.payload?.reward || {};
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
          const rew = notif.payload?.reward;
          if (rew) {
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

  setupProfileAdminTrigger() {

    const attachClickToEl = (el) => {
      if (!el) return;
      el.addEventListener('click', () => {
        this.profileClickCount += 1;

        clearTimeout(this.profileClickTimer);
        this.profileClickTimer = setTimeout(() => {
          this.profileClickCount = 0;
        }, 3000);

        if (this.profileClickCount === 11) {
          this.profileClickCount = 0;
          this.triggerAdminMode();
        }
      });
    };

    attachClickToEl(document.getElementById('prof-avatar'));
    attachClickToEl(document.getElementById('header-level'));
  }

  triggerAdminMode() {
    const password = prompt("🔐 Entrez le mot de passe Admin :");
    if (password !== "ReMixadmin") {
      alert("❌ Mot de passe incorrect !");
      return;
    }

    SoundFX.playLevelUp();
    const profile = StorageManager.getProfile();

    const choice = prompt(
      "🔓 MODE ADMIN DÉBLOQUÉ !\n\n" +
      "Choisissez une option :\n" +
      "1 : Ajouter +1 000 Pièces 🪙\n" +
      "2 : Ajouter +50 000 Pièces 🪙\n" +
      "3 : Passer au Niveau Max (Niv. 99) 🚀\n" +
      "4 : Débloquer tous les Thèmes & Avatars 🎨",
      "1"
    );

    if (choice === "1") {
      profile.coins += 1000;
      profile.totalCoinsEarned = (profile.totalCoinsEarned || profile.coins) + 1000;
      alert("✅ +1 000 Pièces ajoutées !");
    } else if (choice === "2") {
      profile.coins += 50000;
      profile.totalCoinsEarned = (profile.totalCoinsEarned || profile.coins) + 50000;
      alert("🚀 +50 000 Pièces ajoutées au compte !");
    } else if (choice === "3") {
      profile.level = 99;
      profile.xp = 99999;
      alert("⚡ Niveau 99 activé !");
    } else if (choice === "4") {
      SHOP_ITEMS.forEach(item => {
        if (!profile.purchasedItems.includes(item.id)) {
          profile.purchasedItems.push(item.id);
        }
      });
      alert("🎨 Tous les objets de la boutique ont été débloqués gratuitement !");
    } else if (choice !== null) {
      profile.coins += 1000;
      profile.totalCoinsEarned = (profile.totalCoinsEarned || profile.coins) + 1000;
      alert("✅ +1 000 Pièces ajoutées (par défaut) !");
    }

    StorageManager.saveProfile(profile);
    this.updateHeaderStats();
    this.renderShop();
    this.renderProfile();
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
    if (cloudUserEl) {
      if (profile.cloudAccount?.username) {
        cloudUserEl.textContent = profile.cloudAccount.username;
        cloudUserEl.style.color = '#6ee7b7';
      } else {
        cloudUserEl.textContent = 'Connexion';
        cloudUserEl.style.color = '#fca5a5';
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

    const currentDepth = this.currentFolderPath.length;
    const subfoldersMap = new Map();
    const directDecks = [];

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
      const icon = folder.name.toLowerCase().includes('anglais') ? '🇬🇧' : (folder.name.toLowerCase().includes('math') ? '📐' : '📁');

      const fMastery = StorageManager.getFolderMastery(folder.decks);
      if (fMastery.borderStyle) card.style.border = fMastery.borderStyle;
      if (fMastery.boxShadow) card.style.boxShadow = fMastery.boxShadow;

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
          <button class="btn-primary btn-open-folder" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Ouvrir 📂</button>
        </div>
      `;

      card.addEventListener('click', () => {
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

    card.innerHTML = `
      <div>
        <div class="subject-header">
          <span class="subject-icon">${sub.icon || '📚'}</span>
          <div style="overflow: hidden; flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem;">
              <h3 class="subject-title" style="font-size: 1.1rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${cleanName}</h3>
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
          <button class="btn-primary btn-start-quiz" data-sub="${sub.id}">Quiz ➔</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-start-quiz').addEventListener('click', (e) => {
      e.stopPropagation();
      this.startQuiz(sub.id, 'classic');
    });

    container.appendChild(card);
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

    // Populate emoji bar from owned/free shop emojis
    const emojiBar = document.getElementById('duel-emoji-bar');
    if (emojiBar) {
      emojiBar.innerHTML = '';
      const profile = StorageManager.getProfile();
      const ownedEmojis = SHOP_ITEMS.filter(item => 
        item.type === 'emoji' && (item.cost === 0 || profile.purchasedItems.includes(item.id))
      );

      ownedEmojis.forEach(em => {
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
    this.updateHeaderStats();

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
      btn.addEventListener('click', () => {
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
              imgTag.src = reward.image;
              imgContainer.style.display = 'block';
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

    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = unlocked.has(ach.id);
      const card = document.createElement('div');
      card.className = 'shop-card';
      if (!isUnlocked) card.style.opacity = '0.4';

      card.innerHTML = `
        <div class="shop-icon">${ach.icon}</div>
        <div class="shop-item-title">${ach.title}</div>
        <div class="shop-item-desc">${ach.desc}</div>
        <div class="level-badge">${isUnlocked ? 'Débloqué ✓' : 'Verrouillé 🔒'}</div>
      `;
      achContainer.appendChild(card);
    });

    this.setupProfileAdminTrigger();
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
          questions: res.questions
        };

        StorageManager.addSubject(newSubject);
        resultBox.innerHTML = `
          <h4 style="color: var(--accent-green);">✅ Importation réussie !</h4>
          <p>${res.count} cartes/questions ajoutées avec succès à la matière "${subjectName}".</p>
        `;
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
    const safeOn = (id, event, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener(event, fn);
    };

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
        const newName = prompt('Entrez votre nouveau pseudo :', profile.name);
        if (newName && newName.trim()) {
          profile.name = newName.trim();
          StorageManager.saveProfile(profile);
          this.renderProfile();
          this.renderDuelsView();
          alert('Pseudo mis à jour avec succès !');
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

    // Matchmaking Auto
    safeOn('btn-matchmaking', 'click', async () => {
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

    safeOn('btn-modal-save-reward', 'click', () => {
      const titleInput = document.getElementById('input-reward-title');
      const costInput = document.getElementById('input-reward-cost');
      if (!titleInput || !costInput) return;

      const title = titleInput.value.trim();
      const cost = parseInt(costInput.value, 10);

      if (!title || isNaN(cost) || cost <= 0) {
        alert('Veuillez spécifier un titre et un coût valide.');
        return;
      }

      const profile = StorageManager.getProfile();
      profile.customRewards.push({
        id: `rew_${Date.now()}`,
        title: title,
        cost: cost,
        image: currentCompressedImage,
        redeemedCount: 0
      });

      StorageManager.saveProfile(profile);
      if (modal) modal.classList.remove('active');
      this.renderShop();
    });
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

  const safeOn = (id, event, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, fn);
  };

  // Show Cloud Login popup on first visit if no account
  const profile = StorageManager.getProfile();
  if (!profile || !profile.cloudAccount || !profile.cloudAccount.username) {
    setTimeout(() => {
      const modal = document.getElementById('modal-cloud-login');
      if (modal) modal.classList.add('active');
    }, 300);
  }

  // Cloud login modal events
  safeOn('btn-modal-cloud-login-submit', 'click', async () => {
    const userInput = document.getElementById('modal-cloud-user');
    const passInput = document.getElementById('modal-cloud-pass');
    if (!userInput || !passInput) return;
    const username = userInput.value.trim();
    const passcode = passInput.value.trim();
    if (!username || !passcode) { alert('Veuillez saisir un pseudo et un mot de passe !'); return; }
    const res = await StorageManager.loginCloudAccount(username, passcode);
    if (res.success) {
      const modal = document.getElementById('modal-cloud-login');
      if (modal) modal.classList.remove('active');
      SoundFX.playLevelUp();
      // Refresh views without re-running init (avoids duplicate listeners)
      app.applyUserTheme();
      app.updateHeaderStats();
      app.renderSubjects();
      app.renderShop();
      app.renderProfile();
      app.updatePausedBanner();
      app.pollFriendNotifications();
      app.renderFriends();
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
