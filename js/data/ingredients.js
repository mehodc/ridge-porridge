/**
 * Données de démonstration (prototype).
 * Valeurs nutritionnelles indicatives, non issues d'une base officielle.
 * Chaque ingrédient : kcal/protein/carbs/fat/fiber pour 100g.
 */

const INGREDIENTS = [
  // ---------- BASES ----------
  {
    id: "oats",
    name: "Flocons d'avoine",
    category: "base",
    icon: "🌾",
    kcal: 370, protein: 13, carbs: 60, fat: 7, fiber: 10,
    allergens: ["gluten"],
    tags: ["vegan", "vegetarien"],
    flavorTags: ["vanille", "cacahuete", "noisette", "pomme-cannelle", "cafe"],
    texture: ["cremeux", "gourmand"],
    costPer100g: 0.35
  },
  {
    id: "buckwheat",
    name: "Flocons de sarrasin",
    category: "base",
    icon: "🌰",
    kcal: 343, protein: 13, carbs: 71, fat: 3, fiber: 10,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["vanille", "noisette", "pomme-cannelle"],
    texture: ["leger", "croquant"],
    costPer100g: 0.55
  },
  {
    id: "quinoa-flakes",
    name: "Flocons de quinoa",
    category: "base",
    icon: "🫘",
    kcal: 368, protein: 14, carbs: 64, fat: 6, fiber: 7,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["vanille", "banane", "fruits-rouges"],
    texture: ["leger", "cremeux"],
    costPer100g: 0.68
  },

  // ---------- PROTÉINES ----------
  {
    id: "whey-chocolate",
    name: "Whey chocolat",
    category: "protein",
    icon: "🥤",
    kcal: 380, protein: 78, carbs: 8, fat: 6, fiber: 2,
    allergens: ["lactose"],
    tags: ["vegetarien"],
    flavorTags: ["chocolat", "cacahuete", "noisette"],
    texture: ["cremeux", "gourmand"],
    costPer100g: 2.9
  },
  {
    id: "whey-vanilla",
    name: "Whey vanille",
    category: "protein",
    icon: "🥤",
    kcal: 375, protein: 79, carbs: 7, fat: 5, fiber: 1,
    allergens: ["lactose"],
    tags: ["vegetarien"],
    flavorTags: ["vanille", "banane", "fruits-rouges", "cafe"],
    texture: ["cremeux", "gourmand"],
    costPer100g: 2.9
  },
  {
    id: "pea-protein-vanilla",
    name: "Protéine végétale vanille",
    category: "protein",
    icon: "🌱",
    kcal: 360, protein: 75, carbs: 6, fat: 5, fiber: 4,
    allergens: [],
    tags: ["vegan", "vegetarien"],
    flavorTags: ["vanille", "banane", "fruits-rouges"],
    texture: ["cremeux", "leger"],
    costPer100g: 3.2
  },
  {
    id: "pea-protein-chocolate",
    name: "Protéine végétale chocolat",
    category: "protein",
    icon: "🌱",
    kcal: 365, protein: 74, carbs: 7, fat: 5, fiber: 5,
    allergens: [],
    tags: ["vegan", "vegetarien"],
    flavorTags: ["chocolat", "cacahuete", "noisette", "cafe"],
    texture: ["cremeux", "leger"],
    costPer100g: 3.2
  },
  {
    id: "milk-powder",
    name: "Lait en poudre",
    category: "protein",
    icon: "🥛",
    kcal: 496, protein: 26, carbs: 38, fat: 26, fiber: 0,
    allergens: ["lactose"],
    tags: ["vegetarien"],
    flavorTags: ["vanille", "cafe", "cacahuete"],
    texture: ["cremeux", "gourmand"],
    costPer100g: 1.1
  },
  {
    id: "coconut-milk-powder",
    name: "Lait de coco en poudre",
    category: "protein",
    icon: "🥥",
    kcal: 560, protein: 6, carbs: 20, fat: 50, fiber: 6,
    allergens: [],
    tags: ["vegan", "vegetarien"],
    flavorTags: ["coco", "vanille"],
    texture: ["cremeux", "gourmand"],
    costPer100g: 1.4
  },

  // ---------- FRUITS ----------
  {
    id: "dried-banana",
    name: "Banane séchée",
    category: "fruit",
    icon: "🍌",
    kcal: 346, protein: 3, carbs: 82, fat: 1, fiber: 8,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["banane"],
    texture: ["gourmand", "cremeux"],
    costPer100g: 1.6
  },
  {
    id: "freeze-dried-strawberry",
    name: "Fraise lyophilisée",
    category: "fruit",
    icon: "🍓",
    kcal: 330, protein: 4, carbs: 76, fat: 1, fiber: 12,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["fraise", "fruits-rouges"],
    texture: ["leger", "croquant"],
    costPer100g: 2.8
  },
  {
    id: "freeze-dried-berries",
    name: "Fruits rouges lyophilisés",
    category: "fruit",
    icon: "🫐",
    kcal: 320, protein: 5, carbs: 70, fat: 2, fiber: 15,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["fruits-rouges", "fraise"],
    texture: ["leger", "croquant"],
    costPer100g: 3.1
  },
  {
    id: "dried-apple",
    name: "Pomme séchée",
    category: "fruit",
    icon: "🍎",
    kcal: 300, protein: 1, carbs: 75, fat: 1, fiber: 10,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["pomme-cannelle"],
    texture: ["croquant", "leger"],
    costPer100g: 1.3
  },

  // ---------- TOPPINGS / OLÉAGINEUX ----------
  {
    id: "peanut-butter",
    name: "Beurre de cacahuète",
    category: "topping",
    icon: "🥜",
    kcal: 588, protein: 25, carbs: 20, fat: 50, fiber: 8,
    allergens: ["arachides"],
    tags: ["vegan", "vegetarien"],
    flavorTags: ["cacahuete", "chocolat"],
    texture: ["gourmand", "cremeux"],
    costPer100g: 1.9
  },
  {
    id: "walnuts",
    name: "Noix",
    category: "topping",
    icon: "🌰",
    kcal: 654, protein: 15, carbs: 14, fat: 65, fiber: 7,
    allergens: ["fruits-a-coque"],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["noisette", "pomme-cannelle"],
    texture: ["croquant"],
    costPer100g: 2.4
  },
  {
    id: "almonds",
    name: "Amandes",
    category: "topping",
    icon: "🌰",
    kcal: 579, protein: 21, carbs: 22, fat: 50, fiber: 12,
    allergens: ["fruits-a-coque"],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["vanille", "noisette"],
    texture: ["croquant"],
    costPer100g: 2.3
  },
  {
    id: "hazelnuts",
    name: "Noisettes",
    category: "topping",
    icon: "🌰",
    kcal: 628, protein: 15, carbs: 17, fat: 61, fiber: 10,
    allergens: ["fruits-a-coque"],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["noisette", "chocolat"],
    texture: ["croquant", "gourmand"],
    costPer100g: 2.6
  },
  {
    id: "coconut-flakes",
    name: "Noix de coco râpée",
    category: "topping",
    icon: "🥥",
    kcal: 660, protein: 7, carbs: 24, fat: 65, fiber: 16,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["coco"],
    texture: ["croquant", "gourmand"],
    costPer100g: 1.7
  },
  {
    id: "chia-seeds",
    name: "Graines de chia",
    category: "topping",
    icon: "⚫",
    kcal: 486, protein: 17, carbs: 42, fat: 31, fiber: 34,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["vanille", "fruits-rouges", "pomme-cannelle"],
    texture: ["croquant", "leger"],
    costPer100g: 1.5
  },

  // ---------- ARÔMES / ÉPICES ----------
  {
    id: "cocoa-powder",
    name: "Cacao en poudre",
    category: "spice",
    icon: "🍫",
    kcal: 228, protein: 20, carbs: 58, fat: 14, fiber: 33,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["chocolat"],
    texture: ["gourmand"],
    costPer100g: 2.2
  },
  {
    id: "cinnamon",
    name: "Cannelle",
    category: "spice",
    icon: "🟤",
    kcal: 247, protein: 4, carbs: 81, fat: 1, fiber: 53,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["pomme-cannelle"],
    texture: ["leger"],
    costPer100g: 3.0
  },
  {
    id: "vanilla-powder",
    name: "Vanille en poudre",
    category: "spice",
    icon: "🌼",
    kcal: 288, protein: 0, carbs: 13, fat: 0, fiber: 4,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["vanille"],
    texture: ["leger"],
    costPer100g: 6.5
  },
  {
    id: "instant-coffee",
    name: "Café soluble",
    category: "spice",
    icon: "☕",
    kcal: 200, protein: 12, carbs: 30, fat: 0, fiber: 0,
    allergens: [],
    tags: ["vegan", "vegetarien", "sans-gluten-potentiel"],
    flavorTags: ["cafe"],
    texture: ["leger"],
    costPer100g: 4.0
  }
];

// Allergène -> tag ingrédient exclu quand la contrainte est sélectionnée
const CONSTRAINT_ALLERGEN_MAP = {
  "sans-lactose": "lactose",
  "vegan": null, // filtré via tags "vegan" requis
  "sans-fruits-a-coque": "fruits-a-coque",
  "sans-arachides": "arachides",
  "sans-gluten": "gluten",
  "sans-sucre-ajoute": null // aucun ingrédient de la base ne contient de sucre ajouté
};
