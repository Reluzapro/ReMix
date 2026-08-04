// Main application controller linking UI, QuizEngine, Gamification, Storage, Audio, and Multiplayer
import { StorageManager } from './storage.js';
import { QuizEngine } from './quizEngine.js';
import { GamificationEngine, SHOP_ITEMS, ACHIEVEMENTS } from './gamification.js';
import { CSVParser } from './csvParser.js';
import { SoundFX } from './audio.js';
import { MultiplayerEngine } from './multiplayer.js';

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
  }

  init() {
    this.applyUserTheme();
    this.updateHeaderStats();
    this.setupNavigation();
    this.renderCategoryFilters();
    this.renderSubjects();
    this.renderShop();
    this.renderProfile();
    this.setupCSVImporter();
    this.setupEventListeners();
    this.setupProfileAdminTrigger();
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
      alert("✅ +1 000 Pièces ajoutées !");
    } else if (choice === "2") {
      profile.coins += 50000;
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
      alert("✅ +1 000 Pièces ajoutées par défaut !");
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
  }

  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetViewId = btn.getAttribute('data-target');
        this.switchView(targetViewId);

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

    if (viewId === 'subjects-view') this.renderSubjects();
    if (viewId === 'duels-view') this.renderDuelsView();
    if (viewId === 'shop-view') this.renderShop();
    if (viewId === 'profile-view') this.renderProfile();
    if (viewId === 'flashcard-view') this.startFlashcardMode();

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
          <button class="btn-secondary btn-start-fc" data-sub="${sub.id}" style="padding: 0.4rem 0.65rem; font-size: 0.8rem;">🎴 Flashcard</button>
          <button class="btn-primary btn-start-quiz" data-sub="${sub.id}">Quiz ➔</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-start-quiz').addEventListener('click', (e) => {
      e.stopPropagation();
      this.startQuiz(sub.id, 'classic');
    });

    card.querySelector('.btn-start-fc').addEventListener('click', (e) => {
      e.stopPropagation();
      this.startFlashcardMode(sub.id);
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


  startQuiz(subjectId, mode = 'classic') {
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

    document.getElementById('quiz-subject-badge').textContent = sub.name;
    this.switchView('quiz-view');
    this.renderCurrentQuestion(firstQuestion);
    this.startTimer();
  }

  renderCurrentQuestion(question) {
    if (!question) return;

    const container = document.getElementById('quiz-question-container');
    const optionsContainer = document.getElementById('quiz-options-container');
    const nextBtn = document.getElementById('quiz-next-btn');
    const expBox = document.getElementById('quiz-explanation-box');

    nextBtn.style.display = 'none';
    expBox.style.display = 'none';

    document.getElementById('quiz-counter').textContent = `Question ${question.currentIndex + 1}/${question.totalQuestions}`;
    
    const session = this.quizEngine.currentSession;
    const sessionTimeLeft = session ? session.sessionTimer : 180;
    const fillPercent = Math.min(100, Math.max(0, (sessionTimeLeft / 180) * 100));
    document.getElementById('quiz-progress-bar').style.width = `${fillPercent}%`;

    document.getElementById('quiz-score-badge').textContent = `${this.quizEngine.currentSession?.score || 0} Pts`;

    container.innerHTML = `
      <div class="question-card">
        <h3 class="question-title">${question.question}</h3>
      </div>
    `;

    optionsContainer.innerHTML = '';

    this.updatePowerupButtons();

    question.shuffledOptions.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'option-card';
      if (question.disabledOptions.includes(opt)) {
        card.classList.add('disabled');
      }

      card.innerHTML = `<span>${opt}</span><span class="opt-check"></span>`;
      card.addEventListener('click', () => {
        if (card.classList.contains('disabled') || card.classList.contains('selected')) return;
        this.handleAnswerSelection(card, opt);
      });

      optionsContainer.appendChild(card);
    });

    this.triggerMathJax();
  }

  handleAnswerSelection(selectedCard, selectedOption) {
    const result = this.quizEngine.submitAnswer(selectedOption);

    const allCards = document.querySelectorAll('.option-card');
    allCards.forEach(c => c.style.pointerEvents = 'none');

    if (result.wasCorrect) {
      selectedCard.classList.add('correct');
      selectedCard.querySelector('.opt-check').textContent = '✓';
    } else {
      if (selectedCard) {
        selectedCard.classList.add('wrong');
        selectedCard.querySelector('.opt-check').textContent = '✗';
      }

      allCards.forEach(c => {
        const text = c.querySelector('span')?.textContent || c.textContent;
        if (text.includes(result.correctAnswer) || c.innerHTML.includes(result.correctAnswer)) {
          c.classList.add('correct');
          const checkEl = c.querySelector('.opt-check');
          if (checkEl) checkEl.textContent = '✓';
        }
      });
    }

    this.updateHeaderStats();

    const currentQ = this.quizEngine.currentSession?.questions[this.quizEngine.currentSession.currentIndex - 1];
    if (currentQ) {
      const expBox = document.getElementById('quiz-explanation-box');
      const expText = document.getElementById('quiz-explanation-text');

      if (!result.wasCorrect) {
        let msg = `❌ <strong>Réponse incorrecte (-10 pts)</strong><br>`;
        msg += `✅ La bonne réponse était : <strong>${result.correctAnswer}</strong>`;
        if (currentQ.explanation) {
          msg += `<br><br>💡 <em>${currentQ.explanation}</em>`;
        }
        msg += `<br><br><span style="color: var(--accent-cyan); font-weight: 600;">🔄 Cette carte réapparaîtra 20 questions plus tard !</span>`;

        expText.innerHTML = msg;
        expBox.style.display = 'block';
        this.triggerMathJax();
      } else if (currentQ.explanation) {
        expText.innerHTML = `💡 <em>${currentQ.explanation}</em>`;
        expBox.style.display = 'block';
        this.triggerMathJax();
      }
    }

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'inline-block';

    nextBtn.onclick = () => {
      if (result.isFinished) {
        this.showResults(result.summary);
      } else {
        this.renderCurrentQuestion(result.nextQuestion);
        this.startTimer();
      }
    };

    this.triggerMathJax();
  }

  startFlashcardMode(subjectId = null) {
    const subjects = StorageManager.getSubjects();
    let sub = null;
    if (subjectId) sub = subjects[subjectId];
    else {
      const keys = Object.keys(subjects);
      sub = subjects[keys[0]];
    }

    if (!sub || !sub.questions || sub.questions.length === 0) return;

    const allSRS = StorageManager.getSRSData();
    const now = Date.now();
    const sortedQuestions = [...sub.questions].sort((a, b) => {
      const srsA = allSRS[a.id];
      const srsB = allSRS[b.id];
      const dueA = srsA ? (srsA.nextDue <= now ? 0 : 1) : 0;
      const dueB = srsB ? (srsB.nextDue <= now ? 0 : 1) : 0;
      if (dueA !== dueB) return dueA - dueB;
      const mA = srsA ? srsA.mastery : -1;
      const mB = srsB ? srsB.mastery : -1;
      return mA - mB;
    });

    this.flashcardSession = {
      subject: sub,
      questions: sortedQuestions,
      currentIndex: 0
    };

    this.renderFlashcardCard();
  }

  renderFlashcardCard() {
    if (!this.flashcardSession) return;
    const session = this.flashcardSession;

    if (session.currentIndex >= session.questions.length) {
      alert('Toutes les flashcards de ce paquet ont été révisées !');
      this.switchView('subjects-view');
      return;
    }

    const q = session.questions[session.currentIndex];
    document.getElementById('fc-subject-badge').textContent = session.subject.name;
    document.getElementById('fc-progress').textContent = `Carte ${session.currentIndex + 1}/${session.questions.length}`;

    document.getElementById('fc-question-text').innerHTML = q.question;
    document.getElementById('fc-correct-text').innerHTML = `Réponse : ${q.correct}`;
    document.getElementById('fc-explanation-text').innerHTML = q.explanation ? q.explanation : `Règle / Explication : ${q.correct}`;

    document.getElementById('fc-answer-box').style.display = 'block';

    const nextFC = (isCorrect) => {
      StorageManager.updateCardSRS(q.id, isCorrect);
      session.currentIndex += 1;
      this.renderFlashcardCard();
    };

    document.getElementById('btn-fc-again').onclick = () => nextFC(false);
    document.getElementById('btn-fc-good').onclick = () => nextFC(true);
    document.getElementById('btn-fc-easy').onclick = () => nextFC(true);

    this.triggerMathJax();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    const session = this.quizEngine.currentSession;
    if (!session) return;

    const timerEl = document.getElementById('quiz-timer');

    this.timerInterval = setInterval(() => {
      if (session.sessionTimer !== undefined) {
        session.sessionTimer -= 1;
        const m = Math.floor(Math.max(0, session.sessionTimer) / 60);
        const s = Math.floor(Math.max(0, session.sessionTimer) % 60);
        const timeStr = `⏱️ ${m}:${s < 10 ? '0' : ''}${s}`;

        if (timerEl) timerEl.textContent = timeStr;

        const fillPercent = Math.min(100, Math.max(0, (session.sessionTimer / 180) * 100));
        const progressBar = document.getElementById('quiz-progress-bar');
        if (progressBar) progressBar.style.width = `${fillPercent}%`;

        if (session.sessionTimer <= 0) {
          clearInterval(this.timerInterval);
          this.showResults(this.quizEngine.finishSession());
        }
      }
    }, 1000);
  }

  updatePowerupButtons() {
    const profile = StorageManager.getProfile();
    const inv = profile.inventory || {};

    const elFifty = document.getElementById('pu-count-fifty');
    if (elFifty) elFifty.textContent = inv.powerup_fifty || 0;

    const elTime = document.getElementById('pu-count-time');
    if (elTime) elTime.textContent = inv.powerup_time || 0;

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

    const customContainer = document.getElementById('custom-rewards-container');
    customContainer.innerHTML = '';

    if (!profile.customRewards || profile.customRewards.length === 0) {
      customContainer.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-secondary); padding: 1.5rem; text-align: center; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">Aucune récompense personnelle ajoutée pour le moment. Cliquez sur "🎁 Ajouter une Récompense Perso" pour en créer une !</div>`;
    } else {
      profile.customRewards.forEach(rew => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.innerHTML = `
          <div class="shop-icon">🎁</div>
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
        const res = GamificationEngine.redeemCustomReward(profile, id);
        alert(res.message);
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
      card.innerHTML = `
        <div class="shop-icon">${item.icon}</div>
        <div class="shop-item-title">${item.title}</div>
        <div class="shop-item-desc">${item.desc}</div>
        <button class="btn-primary btn-buy-shop" data-id="${item.id}" style="width: 100%;" ${isEquipped ? 'disabled' : ''}>
          ${isEquipped ? 'Équipé' : isOwned ? 'Équiper' : `Acheter (${item.cost} 🪙)`}
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

    // Create Duel Room
    const btnCreateDuel = document.getElementById('btn-create-duel');
    if (btnCreateDuel) {
      btnCreateDuel.addEventListener('click', () => {
        const subjectId = document.getElementById('duel-subject-select').value;
        const wager = parseInt(document.getElementById('duel-wager-select').value, 10);
        const subjects = StorageManager.getSubjects();
        const sub = subjects[subjectId];

        const res = MultiplayerEngine.createRoom({ subject: sub, wager: wager });
        if (res.success) {
          this.currentDuelRoom = res.room;

          const arenaBox = document.getElementById('duel-arena-box');
          arenaBox.style.display = 'block';

          document.getElementById('arena-user-avatar').textContent = res.room.host.avatar;
          document.getElementById('arena-user-name').textContent = res.room.host.name;
          document.getElementById('arena-user-score').textContent = '0 Pts';

          document.getElementById('arena-opp-avatar').textContent = '⚔️';
          document.getElementById('arena-opp-name').textContent = 'Adversaire (Code: ' + res.roomCode + ')';
          document.getElementById('arena-opp-score').textContent = '0 Pts';

          document.getElementById('arena-pot-badge').textContent = `Pot Total : ${wager * 2} 🪙`;
          document.getElementById('arena-room-code').textContent = `CODE DUEL : ${res.roomCode}`;

          alert(`🥊 Salon de Duel créé ! Donnez le Code "${res.roomCode}" à votre adversaire pour qu'il rejoigne le pari !`);
          this.updateHeaderStats();
        } else {
          alert(res.message);
        }
      });
    }

    // Join Duel Room
    const btnJoinDuel = document.getElementById('btn-join-duel');
    if (btnJoinDuel) {
      btnJoinDuel.addEventListener('click', () => {
        const codeInput = document.getElementById('input-duel-code').value.trim();
        if (!codeInput) {
          alert('Veuillez entrer un code de salon DUEL-XXXX !');
          return;
        }

        const res = MultiplayerEngine.joinRoom({ roomCode: codeInput });
        if (res.success) {
          this.currentDuelRoom = res.room;

          const arenaBox = document.getElementById('duel-arena-box');
          arenaBox.style.display = 'block';

          document.getElementById('arena-user-avatar').textContent = res.room.guest ? res.room.guest.avatar : '🎓';
          document.getElementById('arena-user-name').textContent = res.room.guest ? res.room.guest.name : 'Vous';
          document.getElementById('arena-user-score').textContent = '0 Pts';

          document.getElementById('arena-opp-avatar').textContent = res.room.host ? res.room.host.avatar : '⚔️';
          document.getElementById('arena-opp-name').textContent = res.room.host ? res.room.host.name : 'Host';
          document.getElementById('arena-opp-score').textContent = '0 Pts';

          document.getElementById('arena-pot-badge').textContent = `Pot Total : ${res.room.wager * 2} 🪙`;
          document.getElementById('arena-room-code').textContent = `CODE DUEL : ${res.room.code}`;

          alert(`⚔️ Vous avez rejoint le duel ${res.room.code} ! Pari engagé : ${res.room.wager} 🪙.`);
          this.updateHeaderStats();
        } else {
          alert(res.message);
        }
      });
    }

    // Start Arena Duel Match
    const btnArenaStart = document.getElementById('btn-arena-start-match');
    if (btnArenaStart) {
      btnArenaStart.addEventListener('click', () => {
        if (!this.currentDuelRoom) return;
        const room = this.currentDuelRoom;

        this.quizEngine.startSession({
          subjectId: room.subjectId,
          questions: room.questions,
          mode: 'classic',
          timerSeconds: 15,
          questionCount: room.questions.length
        });

        document.getElementById('quiz-subject-badge').textContent = `⚔️ DUEL 1v1 (${room.code})`;
        this.switchView('quiz-view');
        this.renderCurrentQuestion(this.quizEngine.getCurrentQuestion());
        this.startTimer();
      });
    }

    const safeOn = (id, event, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener(event, fn);
    };

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
            this.init();
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
    safeOn('btn-add-custom-reward', 'click', () => {
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
        redeemedCount: 0
      });

      StorageManager.saveProfile(profile);
      if (modal) modal.classList.remove('active');
      this.renderShop();
    });
  }
}

function startApp() {
  const app = new AppController();
  app.init();

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
      app.init();
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
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
