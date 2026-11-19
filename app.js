(() => {
  "use strict";

  const ALL_QUESTIONS = Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [];
  const OPTION_LETTERS = ["A", "B", "C", "D"];

  const CORRECT_MESSAGES = [
    "Spot on, guide!",
    "Passport stamped!",
    "Right on course!",
    "Brilliant answer!",
    "You know your stuff!",
    "Smooth sailing!",
    "Expert level!"
  ];

  // ==================== STATE ====================
  const state = {
    selectedTopic: "ALL",
    selectedCount: 10,
    activeQuestions: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    mistakes: [],
    isRetryMissedMode: false
  };

  // ==================== DOM ELEMENTS ====================
  const screens = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results")
  };

  // Start screen elements
  const totalBankBadge = document.getElementById("total-bank-badge");
  const availableCountHint = document.getElementById("available-count-hint");
  const selectedCountLabel = document.getElementById("selected-count-label");
  const topicGrid = document.getElementById("topic-grid");
  const countPills = document.getElementById("count-pills");
  const customCountInput = document.getElementById("custom-count-input");
  const btnCountMinus = document.getElementById("btn-count-minus");
  const btnCountPlus = document.getElementById("btn-count-plus");
  const btnStart = document.getElementById("btn-start");

  // Quiz screen elements
  const btnQuit = document.getElementById("btn-quit");
  const hudCounter = document.getElementById("hud-counter");
  const hudScore = document.getElementById("hud-score");
  const hudStreak = document.getElementById("hud-streak");
  const streakValue = document.getElementById("streak-value");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const routeFill = document.getElementById("route-fill");
  const routeMarker = document.getElementById("route-marker");
  const streakToast = document.getElementById("streak-toast");
  const questionCard = document.getElementById("question-card");
  const questionTopic = document.getElementById("question-topic");
  const questionId = document.getElementById("question-id");
  const questionText = document.getElementById("question-text");
  const optionsList = document.getElementById("options-list");
  const feedbackBanner = document.getElementById("feedback-banner");
  const feedbackIcon = document.getElementById("feedback-icon");
  const feedbackTitle = document.getElementById("feedback-title");
  const feedbackDetail = document.getElementById("feedback-detail");
  const quizActions = document.getElementById("quiz-actions");
  const btnNext = document.getElementById("btn-next");
  const btnNextLabel = document.getElementById("btn-next-label");

  // Results screen elements
  const rankStamp = document.getElementById("rank-stamp");
  const rankEmoji = document.getElementById("rank-emoji");
  const rankTitle = document.getElementById("rank-title");
  const resultsSubtitle = document.getElementById("results-subtitle");
  const scoreRingFill = document.getElementById("score-ring-fill");
  const resPercent = document.getElementById("res-percent");
  const resScore = document.getElementById("res-score");
  const resStreak = document.getElementById("res-streak");
  const resMissed = document.getElementById("res-missed");
  const btnRetryMissed = document.getElementById("btn-retry-missed");
  const retryMissedCount = document.getElementById("retry-missed-count");
  const btnPlayAgain = document.getElementById("btn-play-again");
  const btnBackHome = document.getElementById("btn-back-home");
  const reviewHeading = document.getElementById("review-heading");
  const reviewSubtext = document.getElementById("review-subtext");
  const mistakesList = document.getElementById("mistakes-list");

  // ==================== UTILITIES ====================
  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getPoolForTopic(topic) {
    if (topic === "ALL") return ALL_QUESTIONS;
    return ALL_QUESTIONS.filter((q) => q.topic === topic);
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      el.classList.toggle("screen--active", key === name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ==================== CONFETTI ENGINE ====================
  const confetti = (() => {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let rafId = null;

    const COLORS = ["#D95D39", "#E09F3E", "#1F8A70", "#1B365D", "#F4A261", "#2A9D8F"];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    function launch(count = 75, originY = 0.25) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() * Math.PI) - Math.PI / 2;
        const speed = 4 + Math.random() * 8;
        particles.push({
          x: window.innerWidth * (0.15 + Math.random() * 0.7),
          y: window.innerHeight * originY,
          vx: Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1) + (Math.random() - 0.5) * 4,
          vy: -(3 + Math.random() * 7),
          size: 6 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 12,
          gravity: 0.22 + Math.random() * 0.08,
          alpha: 1,
          shape: Math.random() > 0.35 ? "rect" : "circle"
        });
      }
      if (!rafId) animate();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.vRot;
        if (p.y > canvas.height * 0.72) {
          p.alpha -= 0.025;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      particles = particles.filter((p) => p.alpha > 0 && p.y < canvas.height + 30);

      if (particles.length > 0) {
        rafId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafId = null;
      }
    }

    return { launch };
  })();

  // ==================== START SCREEN SETUP ====================
  function renderTopicChips() {
    const topicCounts = new Map();
    ALL_QUESTIONS.forEach((q) => {
      const t = q.topic || "General";
      topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
    });

    const topics = [
      { key: "ALL", label: "All Topics", count: ALL_QUESTIONS.length },
      ...Array.from(topicCounts.entries()).map(([label, count]) => ({
        key: label,
        label,
        count
      }))
    ];

    topicGrid.innerHTML = "";
    topics.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "topic-chip" + (state.selectedTopic === item.key ? " is-selected" : "");
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", String(state.selectedTopic === item.key));

      const labelSpan = document.createElement("span");
      labelSpan.textContent = item.label;

      const countSpan = document.createElement("span");
      countSpan.className = "topic-chip__count";
      countSpan.textContent = item.count;

      btn.appendChild(labelSpan);
      btn.appendChild(countSpan);

      btn.addEventListener("click", () => {
        state.selectedTopic = item.key;
        renderTopicChips();
        updateCountControls();
      });

      topicGrid.appendChild(btn);
    });
  }

  function updateCountControls() {
    const pool = getPoolForTopic(state.selectedTopic);
    const maxCount = pool.length;

    availableCountHint.textContent = `${maxCount} available`;
    customCountInput.max = String(maxCount);

    if (state.selectedCount > maxCount) {
      state.selectedCount = maxCount;
    }
    if (state.selectedCount < 1 && maxCount > 0) {
      state.selectedCount = Math.min(10, maxCount);
    }

    // Build preset options dynamically based on pool size
    const candidates = [10, 20, 30, 50].filter((n) => n < maxCount);
    const presets = [...candidates, maxCount];
    // Ensure a small option if pool is tiny
    if (maxCount < 10 && maxCount >= 5) {
      presets.unshift(5);
    }

    countPills.innerHTML = "";
    presets.forEach((num) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "count-pill" + (state.selectedCount === num ? " is-selected" : "");
      btn.textContent = num === maxCount ? `All (${maxCount})` : String(num);
      btn.addEventListener("click", () => {
        setSelectedCount(num);
      });
      countPills.appendChild(btn);
    });

    customCountInput.value = String(state.selectedCount);
    selectedCountLabel.textContent = `${state.selectedCount} ${state.selectedCount === 1 ? "question" : "questions"}`;
  }

  function setSelectedCount(value) {
    const maxCount = getPoolForTopic(state.selectedTopic).length;
    const clamped = Math.max(1, Math.min(maxCount, Number(value) || 1));
    state.selectedCount = clamped;
    updateCountControls();
  }

  // ==================== QUIZ LOGIC ====================
  function prepareQuestion(rawQ) {
    const indexedOptions = rawQ.options.map((text, idx) => ({
      text,
      isCorrect: idx === rawQ.correct
    }));
    const shuffledOptions = shuffle(indexedOptions);
    const newCorrectIndex = shuffledOptions.findIndex((o) => o.isCorrect);

    return {
      ...rawQ,
      shuffledOptions: shuffledOptions.map((o) => o.text),
      correctIndex: newCorrectIndex
    };
  }

  function startQuiz(customPool = null) {
    const sourcePool = customPool || getPoolForTopic(state.selectedTopic);
    const count = customPool ? customPool.length : Math.min(state.selectedCount, sourcePool.length);

    state.isRetryMissedMode = Boolean(customPool);
    state.activeQuestions = shuffle(sourcePool).slice(0, count).map(prepareQuestion);
    state.currentIndex = 0;
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.answered = false;
    state.mistakes = [];

    showScreen("quiz");
    renderCurrentQuestion();
  }

  function updateHud() {
    const total = state.activeQuestions.length;
    const currentNum = state.currentIndex + 1;

    hudCounter.textContent = `${currentNum} / ${total}`;
    hudScore.textContent = `★ ${state.score}`;
    streakValue.textContent = String(state.streak);
    hudStreak.classList.toggle("is-hot", state.streak >= 2);

    const progressPct = state.answered
      ? Math.round((currentNum / total) * 100)
      : Math.round((state.currentIndex / total) * 100);

    routeFill.style.width = `${progressPct}%`;
    routeMarker.style.left = `${progressPct}%`;
    progressBarContainer.setAttribute("aria-valuenow", String(progressPct));
  }

  function showStreakToast(streak) {
    let message = "";
    if (streak === 3) message = "🔥 3 in a row! Great momentum!";
    else if (streak === 5) message = "🔥 5-question streak! Unstoppable explorer!";
    else if (streak === 10) message = "🌟 10 streak! Master Guide energy!";
    else if (streak > 10 && streak % 5 === 0) message = `🏆 ${streak} in a row! Incredible!`;

    if (!message) return;

    streakToast.textContent = message;
    streakToast.classList.remove("is-visible");
    void streakToast.offsetWidth; // restart animation
    streakToast.classList.add("is-visible");
    confetti.launch(38, 0.3);
  }

  function hideStreakToast() {
    streakToast.classList.remove("is-visible");
  }

  function renderCurrentQuestion() {
    const q = state.activeQuestions[state.currentIndex];
    state.answered = false;

    // Trigger card enter animation
    questionCard.classList.remove("card-enter");
    void questionCard.offsetWidth;
    questionCard.classList.add("card-enter");

    hideStreakToast();
    updateHud();

    questionTopic.textContent = q.topic || "General";
    questionId.textContent = `#${q.id}`;
    questionText.textContent = q.question;

    feedbackBanner.hidden = true;
    feedbackBanner.className = "feedback-banner";
    quizActions.hidden = true;

    optionsList.innerHTML = "";
    q.shuffledOptions.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.dataset.index = String(idx);

      const letter = document.createElement("span");
      letter.className = "option-letter";
      letter.textContent = OPTION_LETTERS[idx] || String(idx + 1);

      const textSpan = document.createElement("span");
      textSpan.className = "option-text";
      textSpan.textContent = optText;

      const status = document.createElement("span");
      status.className = "option-status";
      status.setAttribute("aria-hidden", "true");

      btn.appendChild(letter);
      btn.appendChild(textSpan);
      btn.appendChild(status);

      btn.addEventListener("click", () => handleAnswer(idx));
      optionsList.appendChild(btn);
    });
  }

  function handleAnswer(selectedIndex) {
    if (state.answered) return;
    state.answered = true;

    const q = state.activeQuestions[state.currentIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    const buttons = optionsList.querySelectorAll(".option-btn");

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      const statusEl = btn.querySelector(".option-status");
      if (idx === q.correctIndex) {
        btn.classList.add("is-correct");
        statusEl.textContent = "✓";
      } else if (idx === selectedIndex && !isCorrect) {
        btn.classList.add("is-wrong");
        statusEl.textContent = "✕";
      } else {
        btn.classList.add("is-dimmed");
      }
    });

    if (isCorrect) {
      state.score += 1;
      state.streak += 1;
      if (state.streak > state.bestStreak) {
        state.bestStreak = state.streak;
      }

      // Pop streak badge
      hudStreak.classList.remove("pop");
      void hudStreak.offsetWidth;
      hudStreak.classList.add("pop");

      const praise = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      feedbackBanner.className = "feedback-banner is-correct";
      feedbackIcon.textContent = "✓";
      feedbackTitle.textContent = praise;
      feedbackDetail.textContent =
        state.streak >= 2
          ? `You're on a ${state.streak}-question streak!`
          : "Great job — keep moving along the route.";

      showStreakToast(state.streak);
    } else {
      state.streak = 0;
      const chosenText = q.shuffledOptions[selectedIndex];
      const correctText = q.shuffledOptions[q.correctIndex];

      state.mistakes.push({
        rawQuestion: ALL_QUESTIONS.find((item) => item.id === q.id) || q,
        id: q.id,
        topic: q.topic,
        question: q.question,
        chosenAnswer: chosenText,
        correctAnswer: correctText
      });

      feedbackBanner.className = "feedback-banner is-wrong";
      feedbackIcon.textContent = "!";
      feedbackTitle.textContent = "Not quite — let's lock this one in!";
      feedbackDetail.textContent = `Correct answer: ${correctText}`;
    }

    feedbackBanner.hidden = false;
    quizActions.hidden = false;

    const isLast = state.currentIndex === state.activeQuestions.length - 1;
    btnNextLabel.textContent = isLast ? "See My Results" : "Next Stop";

    updateHud();
    requestAnimationFrame(() => {
      btnNext.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function handleNext() {
    if (!state.answered) return;
    if (state.currentIndex < state.activeQuestions.length - 1) {
      state.currentIndex += 1;
      renderCurrentQuestion();
    } else {
      showResults();
    }
  }

  // ==================== RESULTS SCREEN ====================
  function getRankInfo(percent) {
    if (percent === 100) {
      return {
        emoji: "🏆",
        title: "Master Tour Guide",
        subtitle: "100% flawless! Your passport is stamped with pure gold.",
        goldStamp: true,
        ringColor: "#1F8A70"
      };
    }
    if (percent >= 85) {
      return {
        emoji: "🧭",
        title: "Master Tour Guide",
        subtitle: "Outstanding command of the material — ready to lead any group!",
        goldStamp: true,
        ringColor: "#1F8A70"
      };
    }
    if (percent >= 70) {
      return {
        emoji: "🗺️",
        title: "Senior Explorer",
        subtitle: "Great expedition! Review the few missed stops below to hit 100%.",
        goldStamp: false,
        ringColor: "#2A9D8F"
      };
    }
    if (percent >= 50) {
      return {
        emoji: "🎒",
        title: "Rising Guide",
        subtitle: "Solid progress! Study the missed questions below and try again.",
        goldStamp: false,
        ringColor: "#E09F3E"
      };
    }
    return {
      emoji: "🌍",
      title: "Apprentice Traveler",
      subtitle: "Every great guide starts somewhere! Check your study log below and go again.",
      goldStamp: false,
      ringColor: "#D95D39"
    };
  }

  function showResults() {
    const total = state.activeQuestions.length;
    const percent = Math.round((state.score / total) * 100);
    const rank = getRankInfo(percent);

    rankEmoji.textContent = rank.emoji;
    rankTitle.textContent = rank.title;
    rankStamp.classList.toggle("rank-gold", rank.goldStamp);
    resultsSubtitle.textContent = rank.subtitle;

    resPercent.textContent = `${percent}%`;
    resScore.textContent = `${state.score} / ${total}`;
    resStreak.textContent = `🔥 ${state.bestStreak}`;
    resMissed.textContent = String(state.mistakes.length);

    // Animate SVG progress ring
    const circumference = 2 * Math.PI * 50; // r = 50 -> 314.16
    scoreRingFill.style.stroke = rank.ringColor;
    scoreRingFill.style.strokeDasharray = String(circumference);
    scoreRingFill.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      const offset = circumference - (percent / 100) * circumference;
      scoreRingFill.style.strokeDashoffset = String(offset);
    });

    // Show/hide "Practice Missed Questions" button
    if (state.mistakes.length > 0) {
      btnRetryMissed.hidden = false;
      retryMissedCount.textContent = String(state.mistakes.length);
    } else {
      btnRetryMissed.hidden = true;
    }

    renderMistakesReview();
    showScreen("results");

    if (percent >= 70) {
      confetti.launch(percent === 100 ? 120 : 75, 0.22);
    }
  }

  function renderMistakesReview() {
    mistakesList.innerHTML = "";

    if (state.mistakes.length === 0) {
      reviewHeading.textContent = "Study Log — Zero Mistakes!";
      reviewSubtext.textContent = "You answered every single question correctly.";

      const banner = document.createElement("div");
      banner.className = "perfect-banner";
      banner.innerHTML = `
        <div class="perfect-banner__icon">✨</div>
        <h4 class="perfect-banner__title">Flawless Expedition!</h4>
        <p class="perfect-banner__text">Nothing to fix here — ready for a bigger challenge or more questions?</p>
      `;
      mistakesList.appendChild(banner);
      return;
    }

    reviewHeading.textContent = `Study Log — Missed Questions (${state.mistakes.length})`;
    reviewSubtext.textContent = "Compare your pick with the right answer so it sticks next time.";

    state.mistakes.forEach((item) => {
      const card = document.createElement("div");
      card.className = "mistake-card";

      const meta = document.createElement("div");
      meta.className = "mistake-meta";

      const topicTag = document.createElement("span");
      topicTag.className = "topic-tag";
      topicTag.textContent = item.topic || "General";

      const idTag = document.createElement("span");
      idTag.className = "question-id-tag";
      idTag.textContent = `#${item.id}`;

      meta.appendChild(topicTag);
      meta.appendChild(idTag);

      const qTitle = document.createElement("p");
      qTitle.className = "mistake-question";
      qTitle.textContent = item.question;

      const answersWrap = document.createElement("div");
      answersWrap.className = "mistake-answers";

      const wrongRow = document.createElement("div");
      wrongRow.className = "mistake-row mistake-row--wrong";
      const wrongBadge = document.createElement("span");
      wrongBadge.className = "mistake-row-badge";
      wrongBadge.textContent = "✕ Your answer:";
      const wrongText = document.createElement("span");
      wrongText.textContent = item.chosenAnswer;
      wrongRow.appendChild(wrongBadge);
      wrongRow.appendChild(wrongText);

      const rightRow = document.createElement("div");
      rightRow.className = "mistake-row mistake-row--correct";
      const rightBadge = document.createElement("span");
      rightBadge.className = "mistake-row-badge";
      rightBadge.textContent = "✓ Correct:";
      const rightText = document.createElement("span");
      rightText.textContent = item.correctAnswer;
      rightRow.appendChild(rightBadge);
      rightRow.appendChild(rightText);

      answersWrap.appendChild(wrongRow);
      answersWrap.appendChild(rightRow);

      card.appendChild(meta);
      card.appendChild(qTitle);
      card.appendChild(answersWrap);

      mistakesList.appendChild(card);
    });
  }

  // ==================== EVENT LISTENERS ====================
  btnCountMinus.addEventListener("click", () => {
    setSelectedCount(state.selectedCount - 1);
  });

  btnCountPlus.addEventListener("click", () => {
    setSelectedCount(state.selectedCount + 1);
  });

  customCountInput.addEventListener("change", () => {
    setSelectedCount(customCountInput.value);
  });

  btnStart.addEventListener("click", () => {
    setSelectedCount(customCountInput.value);
    startQuiz();
  });

  btnQuit.addEventListener("click", () => {
    showScreen("start");
  });

  btnNext.addEventListener("click", handleNext);

  btnRetryMissed.addEventListener("click", () => {
    const missedPool = state.mistakes.map((m) => m.rawQuestion);
    if (missedPool.length > 0) {
      startQuiz(missedPool);
    }
  });

  btnPlayAgain.addEventListener("click", () => {
    startQuiz();
  });

  btnBackHome.addEventListener("click", () => {
    showScreen("start");
  });

  // Keyboard shortcuts for desktop convenience (A/B/C or 1/2/3, Enter/Space for Next)
  document.addEventListener("keydown", (e) => {
    if (!screens.quiz.classList.contains("screen--active")) return;
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

    const key = e.key.toLowerCase();
    if (!state.answered) {
      const map = { "1": 0, a: 0, "2": 1, b: 1, "3": 2, c: 2 };
      if (key in map) {
        const idx = map[key];
        const q = state.activeQuestions[state.currentIndex];
        if (idx < q.shuffledOptions.length) {
          e.preventDefault();
          handleAnswer(idx);
        }
      }
    } else if (key === "enter" || key === " ") {
      e.preventDefault();
      handleNext();
    }
  });

  // ==================== INIT ====================
  function init() {
    totalBankBadge.textContent = `${ALL_QUESTIONS.length} Questions`;
    state.selectedCount = Math.min(10, ALL_QUESTIONS.length);
    renderTopicChips();
    updateCountControls();
  }

  init();
})();
