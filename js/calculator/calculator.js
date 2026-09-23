/**
 * Moteur de calcul du configurateur.
 * Règles simples, pédagogiques — pas de précision médicale.
 * Toujours présenter les résultats comme des estimations indicatives.
 */

function clamp(value, min, max) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------
// 1) CIBLES NUTRITIONNELLES RECOMMANDÉES (estimation indicative)
// ---------------------------------------------------------------
function estimateTargets(profile) {
  const { sex, age, height, weight, activityId, goalId } = profile;
  const a = ACTIVITIES.find((x) => x.id === activityId) || ACTIVITIES[1];

  // Mifflin-St Jeor
  let bmr;
  if (sex === "femme") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }
  bmr = clamp(bmr, 900, 3000);
  const tdee = bmr * a.factor;

  const goalConfig = {
    energy: { calorieFraction: 0.25, proteinPerKg: 0.3 },
    muscle: { calorieFraction: 0.28, proteinPerKg: 0.45 },
    maintain: { calorieFraction: 0.24, proteinPerKg: 0.3 },
    control: { calorieFraction: 0.22, proteinPerKg: 0.35 },
    performance: { calorieFraction: 0.27, proteinPerKg: 0.4 }
  };
  const g = goalConfig[goalId] || goalConfig.maintain;

  const calories = clamp(Math.round(tdee * g.calorieFraction), 400, 1000);
  const protein = clamp(Math.round(weight * g.proteinPerKg), 15, 60);

  const proteinKcal = protein * 4;
  const remaining = Math.max(calories - proteinKcal, 0);
  const carbs = clamp(Math.round((remaining * 0.65) / 4), 10, 160);
  const fat = clamp(Math.round((remaining * 0.35) / 9), 5, 60);

  return { calories, protein, carbs, fat, tdee: Math.round(tdee) };
}

// ---------------------------------------------------------------
// 2) FILTRAGE SELON CONTRAINTES / ALLERGÈNES
// ---------------------------------------------------------------
function filterIngredients(constraints) {
  const active = constraints || [];
  const excludedAllergens = active
    .map((c) => CONSTRAINT_ALLERGEN_MAP[c])
    .filter(Boolean);
  const requireVegan = active.includes("vegan");

  const filtered = INGREDIENTS.filter((ing) => {
    if (requireVegan && !ing.tags.includes("vegan")) return false;
    if (excludedAllergens.some((a) => ing.allergens.includes(a))) return false;
    return true;
  });

  const byCategory = { base: [], protein: [], fruit: [], topping: [], spice: [] };
  filtered.forEach((ing) => {
    if (byCategory[ing.category]) byCategory[ing.category].push(ing);
  });

  // Garde-fou : si une catégorie est vidée par les contraintes, on retombe
  // sur l'ingrédient le moins allergène de la catégorie d'origine.
  Object.keys(byCategory).forEach((cat) => {
    if (byCategory[cat].length === 0) {
      const fallback = INGREDIENTS.filter((i) => i.category === cat).sort(
        (x, y) => x.allergens.length - y.allergens.length
      )[0];
      if (fallback) byCategory[cat].push(fallback);
    }
  });

  return byCategory;
}

// ---------------------------------------------------------------
// 3) SÉLECTION DE L'INGRÉDIENT LE PLUS PERTINENT PAR CATÉGORIE
// ---------------------------------------------------------------
function pickBest(list, flavors, texture) {
  let best = list[0];
  let bestScore = -Infinity;
  list.forEach((ing) => {
    let score = 0;
    flavors.forEach((f) => {
      if (ing.flavorTags.includes(f)) score += 10;
    });
    if (texture && ing.texture && ing.texture.includes(texture)) score += 4;
    score += (ing.protein / 100) * 0.5; // léger biais densité protéique
    if (score > bestScore) {
      bestScore = score;
      best = ing;
    }
  });
  return best;
}

const SPICE_DEFAULT_GRAMS = {
  "cocoa-powder": 8,
  cinnamon: 1,
  "vanilla-powder": 1,
  "instant-coffee": 3
};

const TASTE_MATCH_CATEGORIES = ["base", "protein", "fruit", "topping", "spice"];

// ---------------------------------------------------------------
// 4) GÉNÉRATION DE LA RECETTE
// ---------------------------------------------------------------
function generatePorridge(profile) {
  const targets = estimateTargets(profile);
  const calorieTarget = clamp(profile.calorieTarget || targets.calories, 400, 1000);
  const proteinTarget = clamp(profile.proteinTarget || targets.protein, 15, 60);
  const flavors = profile.flavors && profile.flavors.length ? profile.flavors : [];
  const texture = profile.texture || "cremeux";

  const byCategory = filterIngredients(profile.constraints);

  const base = pickBest(byCategory.base, flavors, texture);
  const protein = pickBest(byCategory.protein, flavors, texture);
  const fruit = pickBest(byCategory.fruit, flavors, texture);
  const topping = pickBest(byCategory.topping, flavors, texture);
  const spice = pickBest(byCategory.spice, flavors, texture);

  // --- Quantités ---
  const spiceGrams = SPICE_DEFAULT_GRAMS[spice.id] || 2;

  let fruitGrams = clamp(Math.round((calorieTarget * 0.12) / fruit.kcal * 100), 15, 45);
  let toppingGrams = clamp(Math.round((calorieTarget * 0.13) / topping.kcal * 100), 10, 30);
  if (texture === "croquant") toppingGrams = clamp(toppingGrams + 5, 10, 35);
  if (texture === "leger") toppingGrams = clamp(toppingGrams - 5, 8, 30);

  const otherProtein =
    (fruit.protein * fruitGrams) / 100 +
    (topping.protein * toppingGrams) / 100 +
    (spice.protein * spiceGrams) / 100;

  const neededFromSource = Math.max(proteinTarget - otherProtein, 5);
  let proteinGrams = clamp(
    Math.round((neededFromSource * 100) / Math.max(protein.protein, 1)),
    15,
    60
  );

  const usedCalories =
    (protein.kcal * proteinGrams) / 100 +
    (fruit.kcal * fruitGrams) / 100 +
    (topping.kcal * toppingGrams) / 100 +
    (spice.kcal * spiceGrams) / 100;

  const remainingCalories = Math.max(calorieTarget - usedCalories, 0);
  let baseGrams = clamp(Math.round((remainingCalories / base.kcal) * 100), 40, 220);

  const items = [
    { ingredient: base, grams: baseGrams },
    { ingredient: protein, grams: proteinGrams },
    { ingredient: fruit, grams: fruitGrams },
    { ingredient: topping, grams: toppingGrams },
    { ingredient: spice, grams: spiceGrams }
  ];

  const nutrition = items.reduce(
    (acc, it) => {
      const f = it.grams / 100;
      acc.calories += it.ingredient.kcal * f;
      acc.protein += it.ingredient.protein * f;
      acc.carbs += it.ingredient.carbs * f;
      acc.fat += it.ingredient.fat * f;
      acc.fiber += it.ingredient.fiber * f;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
  nutrition.calories = Math.round(nutrition.calories);
  nutrition.protein = Math.round(nutrition.protein);
  nutrition.carbs = Math.round(nutrition.carbs);
  nutrition.fat = Math.round(nutrition.fat);
  nutrition.fiber = Math.round(nutrition.fiber);

  const cost = items.reduce(
    (sum, it) => sum + (it.ingredient.costPer100g * it.grams) / 100,
    0
  );

  const allergens = Array.from(
    new Set(items.flatMap((it) => it.ingredient.allergens))
  );

  const recipe = { items, base, protein, fruit, topping, spice, allergens };
  const score = computeScore(nutrition, { calories: calorieTarget, protein: proteinTarget }, recipe, flavors);
  const name = generateRecipeName(profile, recipe);
  const explanation = generateExplanation(profile, recipe, targets);

  return {
    recipe,
    nutrition,
    targets: { calories: calorieTarget, protein: proteinTarget },
    cost: Math.round(cost * 100) / 100,
    score,
    name,
    explanation
  };
}

// ---------------------------------------------------------------
// 5) SCORE (pédagogique / UX — pas un score médical)
// ---------------------------------------------------------------
function computeScore(nutrition, targets, recipe, flavors) {
  const proteinScore = clamp(
    Math.round((nutrition.protein / Math.max(targets.protein, 1)) * 100),
    40,
    100
  );

  const calorieDeviation = Math.abs(nutrition.calories - targets.calories) / Math.max(targets.calories, 1);
  const energyScore = clamp(Math.round(100 - calorieDeviation * 100), 40, 100);

  const recommendedFiber = (targets.calories / 1000) * 14;
  const fiberScore = clamp(
    Math.round((nutrition.fiber / Math.max(recommendedFiber, 1)) * 100),
    40,
    100
  );

  const totalKcal = Math.max(nutrition.calories, 1);
  const proteinPct = ((nutrition.protein * 4) / totalKcal) * 100;
  const carbsPct = ((nutrition.carbs * 4) / totalKcal) * 100;
  const fatPct = ((nutrition.fat * 9) / totalKcal) * 100;
  const dist = (val, min, max) => (val < min ? min - val : val > max ? val - max : 0);
  const balanceDeviation =
    dist(proteinPct, 15, 30) + dist(carbsPct, 40, 60) + dist(fatPct, 20, 35);
  const balanceScore = clamp(Math.round(100 - balanceDeviation * 1.5), 40, 100);

  const matchedCategories = TASTE_MATCH_CATEGORIES.filter((cat) => {
    const ing = recipe[cat];
    return ing && flavors.some((f) => ing.flavorTags.includes(f));
  }).length;
  const tasteScore = flavors.length
    ? clamp(Math.round(40 + (matchedCategories / TASTE_MATCH_CATEGORIES.length) * 60), 40, 100)
    : 75;

  const overall = Math.round(
    (proteinScore + energyScore + fiberScore + balanceScore + tasteScore) / 5
  );

  return {
    overall,
    protein: proteinScore,
    energy: energyScore,
    fiber: fiberScore,
    balance: balanceScore,
    taste: tasteScore
  };
}

// ---------------------------------------------------------------
// 6) NOM DE RECETTE
// ---------------------------------------------------------------
const FLAVOR_WORD_MAP = {
  chocolat: "Choco",
  vanille: "Vanilla",
  banane: "Banana",
  fraise: "Berry",
  "pomme-cannelle": "Apple Cinnamon",
  cacahuete: "Peanut",
  noisette: "Hazelnut",
  coco: "Coconut",
  cafe: "Coffee",
  "fruits-rouges": "Berry"
};

const TOPPING_WORD_MAP = {
  "peanut-butter": "Peanut",
  walnuts: "Walnut",
  almonds: "Almond",
  hazelnuts: "Hazelnut",
  "coconut-flakes": "Coconut",
  "chia-seeds": "Crunch"
};

const GOAL_SUFFIX_MAP = {
  energy: "Energy",
  muscle: "Power",
  maintain: "Balance",
  control: "Focus",
  performance: "Performance"
};

function generateRecipeName(profile, recipe) {
  const chosenFlavors = profile.flavors && profile.flavors.length
    ? profile.flavors
    : [recipe.base.flavorTags[0] || "vanille"];

  const word1 = FLAVOR_WORD_MAP[chosenFlavors[0]] || "Signature";
  let word2 = chosenFlavors[1] ? FLAVOR_WORD_MAP[chosenFlavors[1]] : null;
  if (!word2) word2 = TOPPING_WORD_MAP[recipe.topping.id] || null;

  const suffix = GOAL_SUFFIX_MAP[profile.goalId] || "Balance";

  const words = [word1, word2, suffix].filter(Boolean);
  const unique = Array.from(new Set(words));
  return unique.slice(0, 3).join(" ");
}

// ---------------------------------------------------------------
// 7) EXPLICATION DYNAMIQUE
// ---------------------------------------------------------------
const GOAL_PHRASES = {
  energy: "de l'énergie dès le matin",
  muscle: "davantage de protéines pour accompagner tes efforts",
  maintain: "un équilibre simple entre les macronutriments",
  control: "des portions claires et maîtrisées",
  performance: "de l'énergie durable pour l'entraînement"
};

const TEXTURE_LABELS = { cremeux: "crémeuse", gourmand: "gourmande", croquant: "croquante", leger: "légère" };

function generateExplanation(profile, recipe, targets) {
  const activity = ACTIVITIES.find((a) => a.id === profile.activityId);
  const goalPhrase = GOAL_PHRASES[profile.goalId] || GOAL_PHRASES.maintain;
  const textureLabel = TEXTURE_LABELS[profile.texture] || "équilibrée";

  const s1 = `Ton niveau d'activité${activity ? ` (${activity.label.toLowerCase()})` : ""} et ton objectif nous orientent vers un petit-déjeuner qui privilégie ${goalPhrase}.`;
  const s2 = `Nous avons associé ${recipe.base.name.toLowerCase()} et ${recipe.protein.name.toLowerCase()} pour une texture ${textureLabel}, avec ${recipe.fruit.name.toLowerCase()} et ${recipe.topping.name.toLowerCase()} pour le goût.`;
  const s3 = `Estimation indicative — les besoins réels peuvent varier selon la personne.`;

  return [s1, s2, s3];
}
