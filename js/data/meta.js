/**
 * Métadonnées des options du configurateur (labels, descriptions, icônes).
 */

const ACTIVITIES = [
  { id: "sedentary", label: "Très peu actif", desc: "Peu ou pas d'exercice", icon: "🏕️", factor: 1.2 },
  { id: "light", label: "1–2 séances / semaine", desc: "Activité légère", icon: "🥾", factor: 1.35 },
  { id: "moderate", label: "3–4 séances / semaine", desc: "Activité modérée", icon: "🧗", factor: 1.5 },
  { id: "active", label: "5+ séances / semaine", desc: "Activité soutenue", icon: "🚵", factor: 1.65 },
  { id: "very-active", label: "Très actif", desc: "Entraînements intenses réguliers", icon: "🏔️", factor: 1.8 }
];

const GOALS = [
  { id: "energy", label: "Énergie", desc: "Un petit-déjeuner qui te lance la journée", icon: "⚡" },
  { id: "muscle", label: "Développer ma masse musculaire", desc: "Plus de protéines pour accompagner tes efforts", icon: "💪" },
  { id: "maintain", label: "Maintenir mon poids", desc: "Un équilibre simple, sans excès", icon: "⚖️" },
  { id: "control", label: "Contrôler mes apports", desc: "Des portions claires et maîtrisées", icon: "🔥" },
  { id: "performance", label: "Performance sportive", desc: "De l'énergie durable pour l'entraînement", icon: "🚵" }
];

const FLAVORS = [
  { id: "chocolat", label: "Chocolat", icon: "🍫" },
  { id: "vanille", label: "Vanille", icon: "🌼" },
  { id: "banane", label: "Banane", icon: "🍌" },
  { id: "fraise", label: "Fraise", icon: "🍓" },
  { id: "pomme-cannelle", label: "Pomme-cannelle", icon: "🍎" },
  { id: "cacahuete", label: "Cacahuète", icon: "🥜" },
  { id: "noisette", label: "Noisette", icon: "🌰" },
  { id: "coco", label: "Noix de coco", icon: "🥥" },
  { id: "cafe", label: "Café", icon: "☕" },
  { id: "fruits-rouges", label: "Fruits rouges", icon: "🫐" }
];

const TEXTURES = [
  { id: "cremeux", label: "Crémeux", icon: "🥣" },
  { id: "gourmand", label: "Gourmand", icon: "🍯" },
  { id: "croquant", label: "Croquant", icon: "✨" },
  { id: "leger", label: "Léger", icon: "🍃" }
];

const CONSTRAINTS = [
  { id: "sans-lactose", label: "Sans lactose", icon: "🚫🥛" },
  { id: "vegan", label: "Vegan", icon: "🌱" },
  { id: "sans-fruits-a-coque", label: "Sans fruits à coque", icon: "🚫🌰" },
  { id: "sans-arachides", label: "Sans arachides", icon: "🚫🥜" },
  { id: "sans-gluten", label: "Sans gluten", icon: "🚫🌾" },
  { id: "sans-sucre-ajoute", label: "Sans sucre ajouté", icon: "🚫🍬" }
];
