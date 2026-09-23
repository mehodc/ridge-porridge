/**
 * Ridge — configurateur de porridge personnalisé.
 * Contrôleur principal : état, navigation, rendu, calculs.
 */
(function () {
  "use strict";

  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const fmtEuro = (n) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

  const TOTAL_STEPS = 7;

  const STEP_MESSAGES = {
    1: "",
    2: "Parfait.",
    3: "Maintenant, parlons de ton objectif.",
    4: "Super, regardons les chiffres.",
    5: "Maintenant, faisons-le vraiment bon.",
    6: "Une dernière chose…",
    7: "Nous avons ta recette."
  };

  const PORTION_TIERS = [
    { count: 7, price: 29.9 },
    { count: 30, price: 89.9, popular: true },
    { count: 60, price: 159 }
  ];

  // Photos libres de droits (Unsplash License — usage commercial libre, sans attribution requise).
  const HERO_PHOTOS = [
    { url: "https://images.unsplash.com/photo-1563231412-f4a21fd3084e?auto=format&fit=crop&w=1920&q=75", credit: "Unsplash" },
    { url: "https://images.unsplash.com/photo-1715706107718-4a0cc4f0335c?auto=format&fit=crop&w=1920&q=75", credit: "Unsplash" },
    { url: "https://images.unsplash.com/photo-1533324050617-905a80c167eb?auto=format&fit=crop&w=1920&q=75", credit: "Unsplash" },
    { url: "https://images.unsplash.com/photo-1744000043352-eabd36a2ecb8?auto=format&fit=crop&w=1920&q=75", credit: "Unsplash" },
    { url: "https://images.unsplash.com/photo-1686182689848-283fdd34e72f?auto=format&fit=crop&w=1920&q=75", credit: "Unsplash" },
    { url: "https://images.unsplash.com/photo-1753465351776-4632500cc4c1?auto=format&fit=crop&w=1920&q=75", credit: "Unsplash" }
  ];
  const HERO_SLIDE_DURATION = 6000;

  // -----------------------------------------------------------
  // State
  // -----------------------------------------------------------
  const state = {
    view: "intro", // intro | quiz
    step: 1,
    profile: {
      sex: null,
      age: null,
      height: null,
      weight: null,
      activityId: null,
      goalId: null,
      calorieTarget: null,
      proteinTarget: null,
      flavors: [],
      texture: null,
      constraints: []
    },
    sliderTouched: { calories: false, protein: false },
    result: null,
    portionCount: 30,
    plan: "subscription"
  };

  // -----------------------------------------------------------
  // DOM refs
  // -----------------------------------------------------------
  const dom = {
    heroSlideshow: $("#hero-slideshow"),
    heroSlideshowToggle: $("#hero-slideshow-toggle"),
    heroSlideshowDots: $("#hero-slideshow-dots"),
    introPanel: $('[data-view="intro"]'),
    quizPanel: $('[data-view="quiz"]'),
    stepCurrent: $("#step-current"),
    encouragement: $("#step-encouragement"),
    progressFill: $("#progress-fill"),
    steps: $$(".quiz-step"),
    quizNav: $("#quiz-nav"),
    navBack: $("#nav-back"),
    navContinue: $("#nav-continue"),
    stickyBar: $("#sticky-bar"),
    stickyBarQuiz: $("#sticky-bar-quiz"),
    stickyBarResult: $("#sticky-bar-result"),
    stickyStepText: $("#sticky-step-text"),
    stickyBack: $("#sticky-back"),
    stickyContinue: $("#sticky-continue"),
    stickyResultText: $("#sticky-result-text"),
    stickyModify: $("#sticky-modify"),
    stickyOrder: $("#sticky-order"),

    activityOptions: $("#activity-options"),
    goalOptions: $("#goal-options"),
    flavorOptions: $("#flavor-options"),
    textureOptions: $("#texture-options"),
    constraintOptions: $("#constraint-options"),

    targetCalories: $("#target-calories"),
    targetProtein: $("#target-protein"),
    targetCarbs: $("#target-carbs"),
    targetFat: $("#target-fat"),
    calorieSlider: $("#calorie-slider"),
    proteinSlider: $("#protein-slider"),
    calorieOutput: $("#calorie-output"),
    proteinOutput: $("#protein-output"),

    loadingState: $("#loading-state"),
    loadingText: $("#loading-text"),
    resultState: $("#result-state"),
    resultName: $("#result-name"),
    resultBowl: $("#result-bowl .bowl-content"),
    macroCalories: $("#macro-calories"),
    macroProtein: $("#macro-protein"),
    macroCarbs: $("#macro-carbs"),
    macroFat: $("#macro-fat"),
    macroFiber: $("#macro-fiber"),
    ingredientList: $("#ingredient-list"),
    costNote: $("#cost-note"),
    explanationText: $("#explanation-text"),
    scoreOverall: $("#score-overall"),
    scoreBars: $("#score-bars"),
    scoreFeedback: $("#score-feedback"),

    portionOptions: $("#portion-options"),
    planOptions: $("#plan-options"),
    pricePerPortion: $("#price-per-portion"),
    priceTotal: $("#price-total"),
    priceSavings: $("#price-savings"),
    orderBtn: $("#order-btn"),
    amazonOrderBtn: $("#amazon-order-btn"),
    shareBtn: $("#share-btn"),

    modalOverlay: $("#modal-overlay"),
    modalBody: $("#modal-body"),
    modalClose: $("#modal-close")
  };

  // -----------------------------------------------------------
  // Init static option lists
  // -----------------------------------------------------------
  function renderStaticOptions() {
    dom.activityOptions.innerHTML = ACTIVITIES.map(
      (a) => `
      <button type="button" class="option-card" data-value="${a.id}" aria-pressed="false">
        <span class="option-icon" aria-hidden="true">${a.icon}</span>
        <span class="option-body">
          <span class="option-title">${a.label}</span>
          <span class="option-desc">${a.desc}</span>
        </span>
      </button>`
    ).join("");

    dom.goalOptions.innerHTML = GOALS.map(
      (g) => `
      <button type="button" class="option-card" data-value="${g.id}" aria-pressed="false">
        <span class="option-icon" aria-hidden="true">${g.icon}</span>
        <span class="option-body">
          <span class="option-title">${g.label}</span>
          <span class="option-desc">${g.desc}</span>
        </span>
      </button>`
    ).join("");

    dom.flavorOptions.innerHTML = FLAVORS.map(
      (f) => `
      <button type="button" class="flavor-card" data-value="${f.id}" aria-pressed="false">
        <span class="flavor-icon" aria-hidden="true">${f.icon}</span>
        <span class="flavor-name">${f.label}</span>
      </button>`
    ).join("");

    dom.textureOptions.innerHTML = TEXTURES.map(
      (t) => `<button type="button" class="option-pill" data-value="${t.id}" aria-pressed="false">${t.icon} ${t.label}</button>`
    ).join("");

    dom.constraintOptions.innerHTML = CONSTRAINTS.map(
      (c) => `
      <button type="button" class="constraint-card" data-value="${c.id}" aria-pressed="false">
        <span class="constraint-icon" aria-hidden="true">${c.icon}</span>
        <span class="constraint-name">${c.label}</span>
      </button>`
    ).join("");

    dom.portionOptions.innerHTML = PORTION_TIERS.map(
      (p) => `
      <button type="button" class="portion-card" data-count="${p.count}" aria-pressed="false">
        ${p.popular ? '<span class="portion-badge">Le plus populaire</span>' : ""}
        <span class="portion-count">${p.count}</span>
        <span class="portion-unit">portions</span>
        <span class="portion-price">${fmtEuro(p.price)}</span>
      </button>`
    ).join("");
  }

  // -----------------------------------------------------------
  // Generic single/multi select toggling
  // -----------------------------------------------------------
  function bindSingleSelect(container, onSelect) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-value]");
      if (!btn || !container.contains(btn)) return;
      $$("[data-value]", container).forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      onSelect(btn.dataset.value);
    });
  }

  function bindMultiSelect(container, onToggle) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-value]");
      if (!btn || !container.contains(btn)) return;
      const pressed = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", String(!pressed));
      onToggle(btn.dataset.value, !pressed);
    });
  }

  // -----------------------------------------------------------
  // Navigation
  // -----------------------------------------------------------
  function updateContinueState() {
    dom.navContinue.disabled = !validateStep(state.step);
    dom.stickyContinue.disabled = !validateStep(state.step);
  }

  function validateStep(step) {
    const p = state.profile;
    switch (step) {
      case 1:
        return !!p.sex && isFinite(p.age) && p.age >= 14 && p.age <= 90 &&
          isFinite(p.height) && p.height >= 120 && p.height <= 230 &&
          isFinite(p.weight) && p.weight >= 35 && p.weight <= 200;
      case 2:
        return !!p.activityId;
      case 3:
        return !!p.goalId;
      case 4:
        return true;
      case 5:
        return p.flavors.length > 0 && !!p.texture;
      case 6:
        return true;
      default:
        return true;
    }
  }

  function showStep(n) {
    state.step = n;
    dom.steps.forEach((s) => s.classList.toggle("active", Number(s.dataset.step) === n));
    dom.stepCurrent.textContent = n;
    dom.progressFill.style.width = (n / TOTAL_STEPS) * 100 + "%";
    dom.encouragement.textContent = STEP_MESSAGES[n] || "";
    dom.stickyStepText.textContent = `Étape ${n} sur ${TOTAL_STEPS}`;

    dom.navBack.style.visibility = n === 1 ? "hidden" : "visible";
    dom.stickyBack.style.visibility = n === 1 ? "hidden" : "visible";

    const isResult = n === TOTAL_STEPS;
    dom.quizNav.classList.toggle("show", !isResult);
    dom.stickyBarQuiz.hidden = isResult;
    dom.stickyBarResult.hidden = !isResult || !state.result;
    dom.stickyBar.hidden = false;

    if (n === 4) refreshTargets();
    if (n === TOTAL_STEPS) enterResultStep();

    updateContinueState();

    // Focus management for accessibility. Deferred to the next frame so it
    // doesn't race with (and cut short) an in-flight smooth-scroll animation.
    requestAnimationFrame(() => {
      const activeSection = $(`.quiz-step[data-step="${n}"]`);
      if (!activeSection) return;
      const heading = activeSection.querySelector(".step-title, .result-name");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    });
  }

  function nextStep() {
    if (!validateStep(state.step)) {
      updateContinueState();
      return;
    }
    if (state.step === 1) trackEvent("profile_completed", { ...state.profile });
    if (state.step === 3) trackEvent("goal_selected", { goalId: state.profile.goalId });
    if (state.step === 5) trackEvent("taste_selected", { flavors: state.profile.flavors, texture: state.profile.texture });
    if (state.step < TOTAL_STEPS) {
      showStep(state.step + 1);
      scrollToConfigurator(true);
    }
  }

  function prevStep() {
    if (state.step > 1) {
      showStep(state.step - 1);
      scrollToConfigurator(true);
    }
  }

  function beginQuiz() {
    state.view = "quiz";
    dom.introPanel.hidden = true;
    dom.quizPanel.hidden = false;
    trackEvent("quiz_started", {});
    showStep(1);
  }

  // -----------------------------------------------------------
  // Step 1 — profile inputs
  // -----------------------------------------------------------
  function bindProfileInputs() {
    bindSingleSelect($('[data-field="sex"]'), (val) => {
      state.profile.sex = val;
      updateContinueState();
    });

    ["age", "height", "weight"].forEach((field) => {
      const input = $(`input[name="${field}"]`);
      input.addEventListener("input", () => {
        const val = parseFloat(input.value);
        state.profile[field] = isFinite(val) ? val : null;
        updateContinueState();
      });
    });
  }

  // -----------------------------------------------------------
  // Step 2 / 3 — activity / goal
  // -----------------------------------------------------------
  function bindActivityGoal() {
    bindSingleSelect(dom.activityOptions, (val) => {
      state.profile.activityId = val;
      updateContinueState();
    });
    bindSingleSelect(dom.goalOptions, (val) => {
      state.profile.goalId = val;
      updateContinueState();
    });
  }

  // -----------------------------------------------------------
  // Step 4 — nutrition targets
  // -----------------------------------------------------------
  function refreshTargets() {
    const p = state.profile;
    if (!p.age || !p.height || !p.weight || !p.activityId || !p.goalId) return;
    const targets = estimateTargets(p);

    dom.targetCalories.textContent = targets.calories + " kcal";
    dom.targetProtein.textContent = targets.protein + " g";
    dom.targetCarbs.textContent = targets.carbs + " g";
    dom.targetFat.textContent = targets.fat + " g";

    if (!state.sliderTouched.calories) {
      p.calorieTarget = targets.calories;
      dom.calorieSlider.value = targets.calories;
      dom.calorieOutput.textContent = targets.calories + " kcal";
    }
    if (!state.sliderTouched.protein) {
      p.proteinTarget = targets.protein;
      dom.proteinSlider.value = targets.protein;
      dom.proteinOutput.textContent = targets.protein + " g";
    }
  }

  function bindSliders() {
    dom.calorieSlider.addEventListener("input", () => {
      state.sliderTouched.calories = true;
      state.profile.calorieTarget = Number(dom.calorieSlider.value);
      dom.calorieOutput.textContent = dom.calorieSlider.value + " kcal";
    });
    dom.proteinSlider.addEventListener("input", () => {
      state.sliderTouched.protein = true;
      state.profile.proteinTarget = Number(dom.proteinSlider.value);
      dom.proteinOutput.textContent = dom.proteinSlider.value + " g";
    });
  }

  // -----------------------------------------------------------
  // Step 5 — flavors / texture
  // -----------------------------------------------------------
  function bindFlavors() {
    bindMultiSelect(dom.flavorOptions, (val, active) => {
      const flavors = state.profile.flavors;
      if (active) {
        if (!flavors.includes(val)) flavors.push(val);
      } else {
        state.profile.flavors = flavors.filter((f) => f !== val);
      }
      updateContinueState();
    });
    bindSingleSelect(dom.textureOptions, (val) => {
      state.profile.texture = val;
      updateContinueState();
    });
  }

  // -----------------------------------------------------------
  // Step 6 — constraints
  // -----------------------------------------------------------
  function bindConstraints() {
    bindMultiSelect(dom.constraintOptions, (val, active) => {
      const c = state.profile.constraints;
      if (active) {
        if (!c.includes(val)) c.push(val);
      } else {
        state.profile.constraints = c.filter((x) => x !== val);
      }
    });
  }

  // -----------------------------------------------------------
  // Step 7 — result
  // -----------------------------------------------------------
  const LOADING_MESSAGES = ["Analyse de ton profil…", "Sélection des ingrédients…", "Ajustement des quantités…"];

  function enterResultStep() {
    dom.loadingState.hidden = false;
    dom.resultState.hidden = true;
    dom.stickyBarResult.hidden = true;

    let i = 0;
    dom.loadingText.textContent = LOADING_MESSAGES[0];
    const interval = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? null : setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      dom.loadingText.textContent = LOADING_MESSAGES[i];
    }, 550);

    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1500;
    setTimeout(() => {
      if (interval) clearInterval(interval);
      generateAndRenderRecipe();
      dom.loadingState.hidden = true;
      dom.resultState.hidden = false;
      dom.stickyBarResult.hidden = false;
      // Result content is much taller than the loading spinner — now that it's
      // in the DOM there's room to scroll all the way to the top of the step.
      scrollToConfigurator(true);
    }, delay);
  }

  function generateAndRenderRecipe() {
    const output = generatePorridge(state.profile);
    state.result = output;
    renderResult(output);
    trackEvent("recipe_generated", { name: output.name, nutrition: output.nutrition });
    updatePriceSummary();
  }

  function animateCountUp(el, target, suffix) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = target + (suffix || "");
      return;
    }
    const duration = 700;
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + (suffix || "");
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function renderResult(output) {
    const { recipe, nutrition, score, name, explanation, cost } = output;

    dom.resultName.textContent = name;

    animateCountUp(dom.macroCalories, nutrition.calories);
    dom.macroProtein.textContent = nutrition.protein + "g";
    dom.macroCarbs.textContent = nutrition.carbs + "g";
    dom.macroFat.textContent = nutrition.fat + "g";
    dom.macroFiber.textContent = nutrition.fiber + "g";

    // bowl animation
    dom.resultBowl.innerHTML = "";
    recipe.items.forEach((it, idx) => {
      const span = document.createElement("span");
      span.className = "ingredient-emoji";
      span.style.animationDelay = idx * 0.12 + "s";
      span.textContent = it.ingredient.icon;
      span.setAttribute("aria-hidden", "true");
      dom.resultBowl.appendChild(span);
    });

    dom.ingredientList.innerHTML = recipe.items
      .map(
        (it) => `
      <li>
        <span class="ing-icon" aria-hidden="true">${it.ingredient.icon}</span>
        <span class="ing-name">${it.ingredient.name}</span>
        <span class="ing-grams">${it.grams} g</span>
      </li>`
      )
      .join("");
    dom.costNote.textContent = `Coût indicatif des ingrédients : ${fmtEuro(cost)} / portion.`;

    dom.explanationText.innerHTML = explanation.map((s) => `<p>${s}</p>`).join("");

    animateCountUp(dom.scoreOverall, score.overall);
    const scoreRows = [
      { label: "Protéines", value: score.protein },
      { label: "Énergie", value: score.energy },
      { label: "Fibres", value: score.fiber },
      { label: "Équilibre", value: score.balance },
      { label: "Goût", value: score.taste }
    ];
    dom.scoreBars.innerHTML = scoreRows
      .map(
        (r) => `
      <div class="score-bar-row">
        <span class="score-bar-label">${r.label}</span>
        <span class="score-bar-track"><span class="score-bar-fill" style="width:${r.value}%"></span></span>
        <span class="score-bar-pct">${r.value}%</span>
      </div>`
      )
      .join("");
    requestAnimationFrame(() => {
      $$(".score-bar-fill", dom.scoreBars).forEach((el) => {
        const w = el.style.width;
        el.style.width = "0%";
        requestAnimationFrame(() => (el.style.width = w));
      });
    });
    dom.scoreFeedback.textContent =
      score.overall >= 85
        ? "Excellent équilibre pour ton objectif."
        : score.overall >= 70
        ? "Bon équilibre pour ton objectif."
        : "Un équilibre correct — ajustable à tout moment.";

    dom.stickyResultText.textContent = `${nutrition.calories} kcal · ${state.portionCount} portions`;
  }

  // Quick tune buttons
  function bindTuneButtons() {
    $$(".btn-tune").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tune = btn.dataset.tune;
        const p = state.profile;
        if (tune === "gourmand") p.texture = "gourmand";
        if (tune === "protein") {
          p.proteinTarget = Math.min(60, (p.proteinTarget || 30) + 10);
          state.sliderTouched.protein = true;
        }
        if (tune === "light") {
          p.texture = "leger";
          p.calorieTarget = Math.max(400, (p.calorieTarget || 650) - 100);
          state.sliderTouched.calories = true;
        }
        if (tune === "calories") {
          p.calorieTarget = Math.min(1000, (p.calorieTarget || 650) + 100);
          state.sliderTouched.calories = true;
        }
        generateAndRenderRecipe();
        trackEvent("recipe_modified", { tune });
      });
    });
  }

  // -----------------------------------------------------------
  // Checkout
  // -----------------------------------------------------------
  function updatePriceSummary() {
    const tier = PORTION_TIERS.find((t) => t.count === state.portionCount) || PORTION_TIERS[1];
    const basePrice = tier.price;
    const isSub = state.plan === "subscription";
    const finalPrice = isSub ? Math.round(basePrice * 0.9 * 100) / 100 : basePrice;
    const perPortion = finalPrice / tier.count;

    dom.pricePerPortion.textContent = fmtEuro(perPortion);
    dom.priceTotal.textContent = fmtEuro(finalPrice) + (isSub ? " / mois" : "");

    if (isSub) {
      const savings = Math.round((basePrice - finalPrice) * 100) / 100;
      dom.priceSavings.hidden = false;
      dom.priceSavings.textContent = `Tu économises ${fmtEuro(savings)} vs achat unique.`;
    } else {
      dom.priceSavings.hidden = true;
    }

    if (state.result) {
      dom.stickyResultText.textContent = `${state.result.nutrition.calories} kcal · ${state.portionCount} portions`;
    }
  }

  function bindCheckout() {
    dom.portionOptions.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-count]");
      if (!btn) return;
      $$("[data-count]", dom.portionOptions).forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      state.portionCount = Number(btn.dataset.count);
      updatePriceSummary();
    });

    dom.planOptions.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-plan]");
      if (!btn) return;
      $$("[data-plan]", dom.planOptions).forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      state.plan = btn.dataset.plan;
      trackEvent("subscription_selected", { plan: state.plan });
      updatePriceSummary();
    });

    dom.orderBtn.addEventListener("click", openOrderModal);
    dom.stickyOrder.addEventListener("click", openOrderModal);
    dom.stickyModify.addEventListener("click", () => {
      const tuneRow = $(".tune-row");
      if (tuneRow) tuneRow.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    dom.shareBtn.addEventListener("click", openShareModal);
    dom.amazonOrderBtn.addEventListener("click", openAmazonOrderModal);
  }

  function formatQuantity(gramsPerPortion) {
    const total = gramsPerPortion * state.portionCount;
    return total >= 1000 ? (total / 1000).toFixed(1).replace(".", ",") + " kg" : Math.round(total) + " g";
  }

  function amazonSearchUrl(ingredientName) {
    return "https://www.amazon.fr/s?k=" + encodeURIComponent(ingredientName);
  }

  function openAmazonOrderModal() {
    if (!state.result) return;
    trackEvent("amazon_order_opened", { portions: state.portionCount });
    const items = state.result.recipe.items;

    const rows = items
      .map((it) => {
        const url = amazonSearchUrl(it.ingredient.name);
        return `
        <li class="amazon-ing-row">
          <span class="ing-icon" aria-hidden="true">${it.ingredient.icon}</span>
          <span class="ing-name">${it.ingredient.name}<br><span class="ing-qty">${formatQuantity(it.grams)} au total</span></span>
          <a class="btn btn-outdoor btn-sm amazon-link" href="${url}" target="_blank" rel="noopener noreferrer" data-ingredient="${it.ingredient.name}">Amazon →</a>
        </li>`;
      })
      .join("");

    dom.modalBody.innerHTML = `
      <div class="modal-body">
        <h3>🛒 Commander les ingrédients</h3>
        <p>Quantités calculées pour ${state.portionCount} portions. Chaque bouton ouvre une recherche Amazon pour l'ingrédient — choisis la marque ou le format que tu préfères, puis ajoute-le à ton panier.</p>
        <ul class="amazon-ing-list">${rows}</ul>
        <p style="font-size:12.5px;color:var(--text-faint)">Prototype — ces liens pointent vers des résultats de recherche Amazon réels ; nous n'avons pas (encore) de panier pré-rempli automatique.</p>
      </div>`;
    openModal();

    $$(".amazon-link", dom.modalBody).forEach((link) => {
      link.addEventListener("click", () => {
        trackEvent("amazon_item_clicked", { ingredient: link.dataset.ingredient });
      });
    });
  }

  function openOrderModal() {
    trackEvent("checkout_started", { portions: state.portionCount, plan: state.plan });
    trackEvent("purchase_clicked", { portions: state.portionCount, plan: state.plan });
    const tier = PORTION_TIERS.find((t) => t.count === state.portionCount) || PORTION_TIERS[1];
    const isSub = state.plan === "subscription";
    const finalPrice = isSub ? Math.round(tier.price * 0.9 * 100) / 100 : tier.price;
    const name = state.result ? state.result.name : "Ton porridge";

    dom.modalBody.innerHTML = `
      <div class="modal-body">
        <h3>Commande simulée ✓</h3>
        <p>Ceci est un prototype — aucune commande ni paiement réel n'a été effectué.</p>
        <div class="modal-summary">
          <div><span>Recette</span><strong>${name}</strong></div>
          <div><span>Portions</span><strong>${tier.count}</strong></div>
          <div><span>Formule</span><strong>${isSub ? "Abonnement mensuel" : "Achat unique"}</strong></div>
          <div><span>Total</span><strong>${fmtEuro(finalPrice)}${isSub ? " / mois" : ""}</strong></div>
        </div>
        <p style="font-size:12.5px;color:var(--text-faint)">Dans une prochaine version, cette étape se connectera à un paiement réel (Stripe) et à la création d'un compte.</p>
      </div>`;
    openModal();
  }

  function openShareModal() {
    const name = state.result ? state.result.name : "Mon porridge";
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const fakeUrl = `ridge.app/r/${slug}-${Math.random().toString(36).slice(2, 7)}`;
    trackEvent("recipe_shared", { name });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fakeUrl).catch(() => {
        /* clipboard unavailable — ignore, link still shown in modal */
      });
    }

    dom.modalBody.innerHTML = `
      <div class="modal-body">
        <h3>Lien copié (simulation)</h3>
        <p>Dans une version connectée, ce lien mènerait vers la page publique de ta recette.</p>
        <div class="modal-summary"><div><span>Lien</span><strong>${fakeUrl}</strong></div></div>
      </div>`;
    openModal();
  }

  function openModal() {
    dom.modalOverlay.hidden = false;
    dom.modalClose.focus();
  }
  function closeModal() {
    dom.modalOverlay.hidden = true;
  }

  function bindModal() {
    dom.modalClose.addEventListener("click", closeModal);
    dom.modalOverlay.addEventListener("click", (e) => {
      if (e.target === dom.modalOverlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !dom.modalOverlay.hidden) closeModal();
    });
  }

  // -----------------------------------------------------------
  // Global nav bindings
  // -----------------------------------------------------------
  function scrollToConfigurator(instant) {
    const target = $("#configurator");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced || instant ? "auto" : "smooth", block: "start" });
  }

  function bindNav() {
    $$('[data-action="start-configurator"]').forEach((btn) =>
      btn.addEventListener("click", () => {
        // Mutate first, then scroll: kicking off the smooth-scroll animation
        // before the step DOM/CSS-animation swap settles causes it to fall
        // short of its target.
        if (state.view === "intro") beginQuiz();
        scrollToConfigurator();
      })
    );
    $('[data-action="scroll-how"]').addEventListener("click", () => {
      const target = $("#how-it-works");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
    $('[data-action="begin-quiz"]').addEventListener("click", beginQuiz);

    dom.navBack.addEventListener("click", prevStep);
    dom.navContinue.addEventListener("click", nextStep);
    dom.stickyBack.addEventListener("click", prevStep);
    dom.stickyContinue.addEventListener("click", nextStep);
  }

  // -----------------------------------------------------------
  // Scroll reveal
  // -----------------------------------------------------------
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
  }

  // -----------------------------------------------------------
  // Hero photo slideshow
  // -----------------------------------------------------------
  const heroState = { index: 0, timer: null, playing: true };

  function goToHeroSlide(i) {
    const slides = $$(".hero-slide", dom.heroSlideshow);
    const dots = $$(".hero-dot", dom.heroSlideshowDots);
    heroState.index = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("active", idx === heroState.index));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === heroState.index));
  }

  function startHeroSlideshow() {
    if (heroState.timer) return;
    heroState.timer = setInterval(() => goToHeroSlide(heroState.index + 1), HERO_SLIDE_DURATION);
  }

  function stopHeroSlideshow() {
    if (heroState.timer) {
      clearInterval(heroState.timer);
      heroState.timer = null;
    }
  }

  function initHeroSlideshow() {
    if (!dom.heroSlideshow || !HERO_PHOTOS.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    dom.heroSlideshow.innerHTML = HERO_PHOTOS.map(
      (p, i) => `<div class="hero-slide${i === 0 ? " active" : ""}" style="background-image:url('${p.url}')"></div>`
    ).join("");
    dom.heroSlideshowDots.innerHTML = HERO_PHOTOS.map(
      (p, i) => `<button type="button" class="hero-dot${i === 0 ? " active" : ""}" aria-label="Aller à la photo ${i + 1}"></button>`
    ).join("");

    dom.heroSlideshowDots.addEventListener("click", (e) => {
      const dot = e.target.closest(".hero-dot");
      if (!dot) return;
      const dots = $$(".hero-dot", dom.heroSlideshowDots);
      goToHeroSlide(dots.indexOf(dot));
      if (heroState.playing) {
        stopHeroSlideshow();
        startHeroSlideshow();
      }
    });

    heroState.playing = !reduced;
    if (reduced) {
      dom.heroSlideshowToggle.hidden = true;
    } else {
      startHeroSlideshow();
    }

    dom.heroSlideshowToggle.addEventListener("click", () => {
      heroState.playing = !heroState.playing;
      if (heroState.playing) {
        startHeroSlideshow();
        dom.heroSlideshowToggle.textContent = "⏸";
        dom.heroSlideshowToggle.setAttribute("aria-label", "Mettre en pause le diaporama");
        dom.heroSlideshowToggle.setAttribute("aria-pressed", "false");
      } else {
        stopHeroSlideshow();
        dom.heroSlideshowToggle.textContent = "▶";
        dom.heroSlideshowToggle.setAttribute("aria-label", "Reprendre le diaporama");
        dom.heroSlideshowToggle.setAttribute("aria-pressed", "true");
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopHeroSlideshow();
      else if (heroState.playing) startHeroSlideshow();
    });
  }

  // -----------------------------------------------------------
  // Default selections (sensible premium defaults for a fast demo)
  // -----------------------------------------------------------
  function setDefaultPortionAndPlan() {
    const popularBtn = $(`[data-count="${state.portionCount}"]`, dom.portionOptions);
    if (popularBtn) popularBtn.setAttribute("aria-pressed", "true");
    const planBtn = $(`[data-plan="${state.plan}"]`, dom.planOptions);
    if (planBtn) planBtn.setAttribute("aria-pressed", "true");
  }

  // -----------------------------------------------------------
  // Init
  // -----------------------------------------------------------
  function syncHeaderHeight() {
    const header = $(".site-header");
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  function init() {
    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight);
    renderStaticOptions();
    bindProfileInputs();
    bindActivityGoal();
    bindSliders();
    bindFlavors();
    bindConstraints();
    bindTuneButtons();
    bindCheckout();
    bindModal();
    bindNav();
    initReveal();
    initHeroSlideshow();
    setDefaultPortionAndPlan();
    updatePriceSummary();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
