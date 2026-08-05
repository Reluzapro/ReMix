// Quiz Engine module managing game modes, question shuffling, timers, and powerups
import { StorageManager } from './storage.js';
import { GamificationEngine } from './gamification.js';
import { SoundFX } from './audio.js';

export class QuizEngine {
  constructor() {
    this.currentSession = null;
    this.timerInterval = null;
  }

  startSession({ subjectId, questions, mode = 'classic', sessionTimerSeconds = 180 }) {
    if (!questions || questions.length === 0) {
      throw new Error('Aucune question disponible pour ce sujet.');
    }

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

    let finalQuestions = sortedQuestions;
    if (mode === 'classic') {
      finalQuestions = sortedQuestions.slice(0, 10);
    }

    const prepared = finalQuestions.map(q => this.prepareQuestion(q));

    this.currentSession = {
      subjectId: subjectId,
      mode: mode,
      originalQuestions: [...questions],
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
      if (this.currentSession.mode === 'infinite') {
        const pool = this.currentSession.originalQuestions || [];
        if (pool.length > 0) {
          const extra = [...pool].sort(() => Math.random() - 0.5).map(q => this.prepareQuestion(q));
          this.currentSession.questions.push(...extra);
        } else {
          return null;
        }
      } else {
        return null; // End of questions for non-infinite modes
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
      const points = GamificationEngine.calculatePoints(
        true,
        this.currentSession.streak,
        this.currentSession.powerupDoubleActive
      );
      this.currentSession.score += points;
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
    } else if (powerupType === 'powerup_time') {
      if (this.currentSession.sessionTimer !== undefined) {
        this.currentSession.sessionTimer += 15;
      }
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

    const xpEarned = Math.max(0, Math.floor(this.currentSession.score / 4));
    const coinsEarned = Math.round(correct * 3) + (accuracy === 100 ? 25 : 0);

    const profile = StorageManager.getProfile();

    profile.stats.gamesPlayed += 1;
    profile.stats.correctAnswers += correct;
    profile.stats.wrongAnswers += this.currentSession.wrongCount;
    profile.stats.skippedAnswers += this.currentSession.skippedCount;

    if (accuracy === 100 && totalAnswered >= 5) {
      profile.stats.perfectGames += 1;
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
      history: this.currentSession.history
    };

    this.currentSession = null;
    return summary;
  }
}
