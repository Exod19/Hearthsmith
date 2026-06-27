import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChefHat,
  ClipboardList,
  Download,
  FileDown,
  Flame,
  Home,
  Import,
  Printer,
  RefreshCcw,
  Search,
  ShoppingCart,
  Utensils,
} from "lucide-react";

const STORAGE_KEY = "hearthsmith_v1";

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const SLOTS = [
  { key: "breakfast", label: "Déjeuner" },
  { key: "lunch", label: "Dîner" },
  { key: "dinner", label: "Souper" },
  { key: "snack", label: "Collations" },
];

const placeholder = (label) =>
  `https://placehold.co/900x600/efe3cf/3a2618?text=${encodeURIComponent(label)}`;

const seedMeals = [
  {
    id: "smoothie-proteine-fruits",
    name: "Smoothie protéiné fruits + chia",
    type: "breakfast",
    image: placeholder("Smoothie protéiné"),
    tags: ["Rapide", "Sans gluten", "Sans lactose", "Meal prep"],
    prepTime: 7,
    cookTime: 0,
    portions: 2,
    description:
      "Déjeuner rapide et protéiné, facile à adapter selon les fruits disponibles.",
    ingredients: [
      { name: "Fruits congelés", qty: 2, unit: "tasses", category: "Fruits et légumes" },
      { name: "Lait de soya non sucré", qty: 2, unit: "tasses", category: "Produits laitiers et substituts" },
      { name: "Poudre de protéine", qty: 2, unit: "scoops", category: "Épicerie sèche" },
      { name: "Graines de chia", qty: 2, unit: "c. à soupe", category: "Épicerie sèche" }
    ],
    steps: [
      "Mettre les fruits, le lait de soya, la poudre de protéine et le chia au mélangeur.",
      "Mélanger jusqu’à texture lisse.",
      "Servir avec une rôtie sans gluten ou un fruit si besoin d’un déjeuner plus soutenant."
    ],
    adaptations: {
      samuel: "Ajouter une rôtie ou une portion de féculent si entraînement prévu.",
      anneMarie: "Utiliser lait sans lactose ou soya, et une poudre bien tolérée.",
      enfants: "Servir en petite portion avec une paille ou dans un bol."
    },
    prep: [
      "Préparer des sacs de fruits congelés portionnés.",
      "Préparer un petit contenant avec chia + poudre de protéine."
    ]
  },
  {
    id: "oeufs-toast-sam",
    name: "Œufs, épinards et rôties",
    type: "breakfast",
    image: placeholder("Œufs et rôties"),
    tags: ["Protéiné", "Rapide", "Samuel"],
    prepTime: 10,
    cookTime: 7,
    portions: 1,
    description:
      "Déjeuner protéiné simple pour Samuel, avec légumes intégrés dès le matin.",
    ingredients: [
      { name: "Œufs", qty: 1, unit: "unité", category: "Viandes, poissons et protéines" },
      { name: "Blancs d’œufs", qty: 0.66, unit: "tasse", category: "Viandes, poissons et protéines" },
      { name: "Épinards", qty: 1, unit: "poignée", category: "Fruits et légumes" },
      { name: "Pain 9 grains ou pain sans gluten", qty: 2, unit: "tranches", category: "Produits céréaliers" }
    ],
    steps: [
      "Faire chauffer une poêle antiadhésive.",
      "Cuire les œufs, les blancs d’œufs et les épinards.",
      "Servir avec deux rôties."
    ],
    adaptations: {
      samuel: "Option de base.",
      anneMarie: "Remplacer par toast + yogourt sans lactose ou smoothie.",
      enfants: "Œuf brouillé simple + toast en morceaux."
    },
    prep: [
      "Laver les épinards.",
      "Garder les blancs d’œufs accessibles au frigo."
    ]
  },
  {
    id: "bol-poulet-riz-crudites",
    name: "Bol poulet, riz et crudités",
    type: "lunch",
    image: placeholder("Bol poulet riz"),
    tags: ["Meal prep", "Sans gluten", "Lunch", "Restants"],
    prepTime: 12,
    cookTime: 15,
    portions: 2,
    description:
      "Bol simple à assembler avec du poulet précuit, du riz et des légumes croquants.",
    ingredients: [
      { name: "Poitrines de poulet", qty: 400, unit: "g", category: "Viandes, poissons et protéines" },
      { name: "Riz cuit ou riz micro-ondable", qty: 2, unit: "tasses", category: "Produits céréaliers" },
      { name: "Concombre", qty: 0.5, unit: "unité", category: "Fruits et légumes" },
      { name: "Carottes", qty: 2, unit: "unités", category: "Fruits et légumes" },
      { name: "Sauce maison légère", qty: 4, unit: "c. à soupe", category: "Condiments, sauces et épices" }
    ],
    steps: [
      "Réchauffer le riz et le poulet.",
      "Ajouter concombre et carottes en crudités.",
      "Ajouter la sauce au moment de servir."
    ],
    adaptations: {
      samuel: "Augmenter le riz ou le poulet selon la faim.",
      anneMarie: "Garder la sauce simple et bien tolérée.",
      enfants: "Servir séparé : riz, poulet, crudités."
    },
    prep: [
      "Cuire le poulet en lanières.",
      "Couper concombre et carottes.",
      "Préparer la sauce dans un petit pot."
    ]
  },
  {
    id: "wrap-dinde-deconstruit",
    name: "Wrap dinde déconstruit",
    type: "lunch",
    image: placeholder("Wrap déconstruit"),
    tags: ["Rapide", "Sans gluten adaptable", "Kid-friendly"],
    prepTime: 10,
    cookTime: 0,
    portions: 2,
    description:
      "Un lunch très simple en version bol ou wrap, selon les besoins.",
    ingredients: [
      { name: "Dinde tranchée", qty: 200, unit: "g", category: "Viandes, poissons et protéines" },
      { name: "Tortillas sans gluten", qty: 2, unit: "unités", category: "Produits sans gluten" },
      { name: "Laitue", qty: 2, unit: "tasses", category: "Fruits et légumes" },
      { name: "Tomates cerises", qty: 1, unit: "tasse", category: "Fruits et légumes" },
      { name: "Fromage sans lactose", qty: 80, unit: "g", category: "Produits laitiers et substituts" }
    ],
    steps: [
      "Assembler en wrap ou en bol.",
      "Ajouter dinde, laitue, tomates et fromage.",
      "Servir avec fruit ou crudités."
    ],
    adaptations: {
      samuel: "Ajouter une portion de riz ou craquelins si besoin.",
      anneMarie: "Servir en bol si les tortillas ne sont pas bien tolérées.",
      enfants: "Faire des petits roulés simples."
    },
    prep: [
      "Laver la laitue.",
      "Couper les tomates.",
      "Préportionner dinde et fromage."
    ]
  },
  {
    id: "saumon-patates-legumes",
    name: "Saumon, patates et légumes verts",
    type: "dinner",
    image: placeholder("Saumon patates légumes"),
    tags: ["Souper", "Sans gluten", "Familial", "Plaque au four"],
    prepTime: 15,
    cookTime: 25,
    portions: 4,
    description:
      "Souper simple, nourrissant et facile à faire sur plaque.",
    ingredients: [
      { name: "Filets de saumon", qty: 600, unit: "g", category: "Viandes, poissons et protéines" },
      { name: "Pommes de terre", qty: 900, unit: "g", category: "Produits céréaliers" },
      { name: "Brocoli", qty: 1, unit: "tête", category: "Fruits et légumes" },
      { name: "Huile d’olive", qty: 2, unit: "c. à soupe", category: "Condiments, sauces et épices" },
      { name: "Citron", qty: 1, unit: "unité", category: "Fruits et légumes" }
    ],
    steps: [
      "Couper les pommes de terre en quartiers.",
      "Cuire les pommes de terre au four avec un filet d’huile.",
      "Ajouter le saumon et le brocoli sur la plaque.",
      "Cuire jusqu’à ce que le saumon soit tendre."
    ],
    adaptations: {
      samuel: "Ajouter une plus grande portion de pommes de terre.",
      anneMarie: "Garder assaisonnement simple : citron, sel, poivre.",
      enfants: "Servir saumon en petits morceaux avec patates."
    },
    prep: [
      "Couper les pommes de terre d’avance.",
      "Laver et couper le brocoli."
    ]
  },
  {
    id: "tacos-deconstruits",
    name: "Tacos déconstruits familiaux",
    type: "dinner",
    image: placeholder("Tacos déconstruits"),
    tags: ["Kid-friendly", "Sans gluten", "Rapide", "Familial"],
    prepTime: 15,
    cookTime: 15,
    portions: 4,
    description:
      "Souper flexible où chacun assemble son assiette selon ses goûts.",
    ingredients: [
      { name: "Bœuf haché maigre", qty: 600, unit: "g", category: "Viandes, poissons et protéines" },
      { name: "Riz cuit ou riz micro-ondable", qty: 3, unit: "tasses", category: "Produits céréaliers" },
      { name: "Laitue", qty: 3, unit: "tasses", category: "Fruits et légumes" },
      { name: "Tomates", qty: 2, unit: "unités", category: "Fruits et légumes" },
      { name: "Fromage sans lactose", qty: 150, unit: "g", category: "Produits laitiers et substituts" },
      { name: "Salsa douce", qty: 0.5, unit: "tasse", category: "Condiments, sauces et épices" }
    ],
    steps: [
      "Cuire le bœuf haché avec assaisonnement doux.",
      "Préparer riz, laitue, tomates, fromage et salsa.",
      "Servir en bols ou avec tortillas sans gluten."
    ],
    adaptations: {
      samuel: "Faire un bol plus protéiné avec extra bœuf.",
      anneMarie: "Éviter assaisonnements trop épicés.",
      enfants: "Servir les ingrédients séparés."
    },
    prep: [
      "Couper laitue et tomates.",
      "Cuire le bœuf d’avance si désiré."
    ]
  },
  {
    id: "pates-sg-viande-tomate",
    name: "Pâtes sans gluten viande & tomate",
    type: "dinner",
    image: placeholder("Pâtes sans gluten"),
    tags: ["Familial", "Rapide", "Restants"],
    prepTime: 10,
    cookTime: 20,
    portions: 4,
    description:
      "Classique familial simple, avec sauce tomate et protéine.",
    ingredients: [
      { name: "Pâtes sans gluten", qty: 450, unit: "g", category: "Produits sans gluten" },
      { name: "Dinde hachée ou bœuf maigre", qty: 500, unit: "g", category: "Viandes, poissons et protéines" },
      { name: "Sauce tomate", qty: 650, unit: "ml", category: "Épicerie sèche" },
      { name: "Épinards", qty: 2, unit: "poignées", category: "Fruits et légumes" }
    ],
    steps: [
      "Cuire les pâtes selon les instructions.",
      "Cuire la viande dans une grande poêle.",
      "Ajouter sauce tomate et épinards.",
      "Mélanger avec les pâtes."
    ],
    adaptations: {
      samuel: "Ajouter plus de viande si besoin de protéines.",
      anneMarie: "Choisir une sauce simple sans ail/oignon si sensible.",
      enfants: "Servir avec fromage sans lactose si désiré."
    },
    prep: [
      "Cuire la viande d’avance.",
      "Laver les épinards."
    ]
  },
  {
    id: "plaque-poulet-legumes",
    name: "Plaque poulet et légumes",
    type: "dinner",
    image: placeholder("Poulet légumes"),
    tags: ["Meal prep", "Plaque au four", "Sans gluten", "Restants"],
    prepTime: 15,
    cookTime: 30,
    portions: 4,
    description:
      "Une base très polyvalente pour souper et lunchs du lendemain.",
    ingredients: [
      { name: "Poitrines de poulet", qty: 700, unit: "g", category: "Viandes, poissons et protéines" },
      { name: "Carottes", qty: 4, unit: "unités", category: "Fruits et légumes" },
      { name: "Poivrons", qty: 2, unit: "unités", category: "Fruits et légumes" },
      { name: "Pommes de terre", qty: 800, unit: "g", category: "Produits céréaliers" },
      { name: "Huile d’olive", qty: 2, unit: "c. à soupe", category: "Condiments, sauces et épices" }
    ],
    steps: [
      "Couper poulet, pommes de terre et légumes.",
      "Étendre sur une plaque.",
      "Ajouter huile et assaisonnements doux.",
      "Cuire au four jusqu’à cuisson complète."
    ],
    adaptations: {
      samuel: "Prévoir restants pour lunch.",
      anneMarie: "Garder les légumes bien tolérés.",
      enfants: "Servir poulet et patates séparément."
    },
    prep: [
      "Couper les légumes.",
      "Mariner le poulet.",
      "Préparer la plaque à l’avance."
    ]
  },
  {
    id: "yogourt-fruits-granola",
    name: "Yogourt sans lactose, fruits et granola",
    type: "snack",
    image: placeholder("Yogourt fruits"),
    tags: ["Collation", "Rapide", "Sans lactose"],
    prepTime: 5,
    cookTime: 0,
    portions: 2,
    description:
      "Collation simple et soutenante, à adapter selon la tolérance digestive.",
    ingredients: [
      { name: "Yogourt sans lactose", qty: 2, unit: "portions", category: "Produits laitiers et substituts" },
      { name: "Petits fruits", qty: 1, unit: "tasse", category: "Fruits et légumes" },
      { name: "Granola sans gluten", qty: 0.5, unit: "tasse", category: "Produits sans gluten" }
    ],
    steps: [
      "Mettre le yogourt dans un bol.",
      "Ajouter fruits et granola.",
      "Servir immédiatement."
    ],
    adaptations: {
      samuel: "Ajouter protéine si besoin.",
      anneMarie: "Choisir yogourt et granola bien tolérés.",
      enfants: "Servir en petite portion."
    },
    prep: [
      "Préportionner fruits et granola."
    ]
  },
  {
    id: "popcorn-fruit",
    name: "Popcorn + fruit",
    type: "snack",
    image: placeholder("Popcorn fruit"),
    tags: ["Collation", "Soirée", "Simple"],
    prepTime: 5,
    cookTime: 3,
    portions: 2,
    description:
      "Collation de soirée simple, légère et satisfaisante.",
    ingredients: [
      { name: "Popcorn nature", qty: 6, unit: "tasses", category: "Collations" },
      { name: "Fruits au choix", qty: 2, unit: "unités", category: "Fruits et légumes" }
    ],
    steps: [
      "Préparer le popcorn.",
      "Servir avec un fruit."
    ],
    adaptations: {
      samuel: "Bonne option de soirée.",
      anneMarie: "Vérifier la tolérance au popcorn.",
      enfants: "Adapter la portion et superviser."
    },
    prep: [
      "Garder des fruits lavés disponibles."
    ]
  }
];

const seedMenus = [
  {
    id: "week-1",
    name: "Rotation 1 — Le Foyer",
    days: {
      Lundi: { breakfast: "smoothie-proteine-fruits", lunch: "bol-poulet-riz-crudites", dinner: "plaque-poulet-legumes", snack: "yogourt-fruits-granola" },
      Mardi: { breakfast: "oeufs-toast-sam", lunch: "bol-poulet-riz-crudites", dinner: "tacos-deconstruits", snack: "popcorn-fruit" },
      Mercredi: { breakfast: "smoothie-proteine-fruits", lunch: "wrap-dinde-deconstruit", dinner: "saumon-patates-legumes", snack: "yogourt-fruits-granola" },
      Jeudi: { breakfast: "oeufs-toast-sam", lunch: "wrap-dinde-deconstruit", dinner: "pates-sg-viande-tomate", snack: "popcorn-fruit" },
      Vendredi: { breakfast: "smoothie-proteine-fruits", lunch: "bol-poulet-riz-crudites", dinner: "tacos-deconstruits", snack: "yogourt-fruits-granola" },
      Samedi: { breakfast: "oeufs-toast-sam", lunch: "wrap-dinde-deconstruit", dinner: "saumon-patates-legumes", snack: "popcorn-fruit" },
      Dimanche: { breakfast: "smoothie-proteine-fruits", lunch: "bol-poulet-riz-crudites", dinner: "plaque-poulet-legumes", snack: "yogourt-fruits-granola" }
    }
  },
  {
    id: "week-2",
    name: "Rotation 2 — La Réserve",
    days: {
      Lundi: { breakfast: "oeufs-toast-sam", lunch: "wrap-dinde-deconstruit", dinner: "pates-sg-viande-tomate", snack: "popcorn-fruit" },
      Mardi: { breakfast: "smoothie-proteine-fruits", lunch: "bol-poulet-riz-crudites", dinner: "saumon-patates-legumes", snack: "yogourt-fruits-granola" },
      Mercredi: { breakfast: "oeufs-toast-sam", lunch: "wrap-dinde-deconstruit", dinner: "plaque-poulet-legumes", snack: "popcorn-fruit" },
      Jeudi: { breakfast: "smoothie-proteine-fruits", lunch: "bol-poulet-riz-crudites", dinner: "tacos-deconstruits", snack: "yogourt-fruits-granola" },
      Vendredi: { breakfast: "oeufs-toast-sam", lunch: "wrap-dinde-deconstruit", dinner: "pates-sg-viande-tomate", snack: "popcorn-fruit" },
      Samedi: { breakfast: "smoothie-proteine-fruits", lunch: "bol-poulet-riz-crudites", dinner: "plaque-poulet-legumes", snack: "yogourt-fruits-granola" },
      Dimanche: { breakfast: "oeufs-toast-sam", lunch: "wrap-dinde-deconstruit", dinner: "tacos-deconstruits", snack: "popcorn-fruit" }
    }
  },
  {
    id: "week-3",
    name: "Rotation 3 — Le Hall",
    days: {
      Lundi: { breakfast: "smoothie-proteine-fruits", lunch: "bol-poulet-riz-crudites", dinner: "saumon-patates-legumes", snack: "yogourt-fruits-granola" },
      Mardi: { breakfast: "smoothie-proteine-fruits", lunch: "wrap-dinde-deconstruit", dinner: "pates-sg-viande-tomate", snack: "popcorn-fruit" },
      Mercredi: { breakfast: "oeufs-toast-sam", lunch: "bol-poulet-riz-crudites", dinner: "tacos-deconstruits", snack: "yogourt-fruits-granola" },
      Jeudi: { breakfast: "smoothie-proteine-fruits", lunch: "wrap-dinde-deconstruit", dinner: "plaque-poulet-legumes", snack: "popcorn-fruit" },
      Vendredi: { breakfast: "oeufs-toast-sam", lunch: "bol-poulet-riz-crudites", dinner: "saumon-patates-legumes", snack: "yogourt-fruits-granola" },
      Samedi: { breakfast: "smoothie-proteine-fruits", lunch: "wrap-dinde-deconstruit", dinner: "tacos-deconstruits", snack: "popcorn-fruit" },
      Dimanche: { breakfast: "oeufs-toast-sam", lunch: "bol-poulet-riz-crudites", dinner: "pates-sg-viande-tomate", snack: "yogourt-fruits-granola" }
    }
  },
  {
    id: "week-4",
    name: "Rotation 4 — Les Braises",
    days: {
      Lundi: { breakfast: "oeufs-toast-sam", lunch: "wrap-dinde-deconstruit", dinner: "plaque-poulet-legumes", snack: "popcorn-fruit" },
      Mardi: { breakfast: "smoothie-proteine-fruits", lunch: "bol-poulet-riz-crudites", dinner: "pates-sg-viande-tomate", snack: "yogourt-fruits-granola" },
      Mercredi: { breakfast: "smoothie-proteine-fruits", lunch: "wrap-dinde-deconstruit", dinner: "saumon-patates-legumes", snack: "popcorn-fruit" },
      Jeudi: { breakfast: "oeufs-toast-sam", lunch: "bol-poulet-riz-crudites", dinner: "tacos-deconstruits", snack: "yogourt-fruits-granola" },
      Vendredi: { breakfast: "smoothie-proteine-fruits", lunch: "wrap-dinde-deconstruit", dinner: "plaque-poulet-legumes", snack: "popcorn-fruit" },
      Samedi: { breakfast: "oeufs-toast-sam", lunch: "bol-poulet-riz-crudites", dinner: "saumon-patates-legumes", snack: "yogourt-fruits-granola" },
      Dimanche: { breakfast: "smoothie-proteine-fruits", lunch: "wrap-dinde-deconstruit", dinner: "pates-sg-viande-tomate", snack: "popcorn-fruit" }
    }
  }
];

function loadInitialState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      meals: seedMeals,
      menus: seedMenus,
      selectedMenuId: seedMenus[0].id,
      groceryChecked: {},
      activeTab: "menu"
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      meals: seedMeals,
      menus: seedMenus,
      selectedMenuId: seedMenus[0].id,
      groceryChecked: {},
      activeTab: "menu"
    };
  }
}

function normalizeIngredientKey(item) {
  return `${item.name.toLowerCase().trim()}__${item.unit.toLowerCase().trim()}`;
}

function buildGroceryList(menu, meals) {
  if (!menu) return [];

  const mealMap = Object.fromEntries(meals.map((meal) => [meal.id, meal]));
  const items = {};

  DAYS.forEach((day) => {
    SLOTS.forEach((slot) => {
      const mealId = menu.days?.[day]?.[slot.key];
      const meal = mealMap[mealId];

      if (!meal) return;

      meal.ingredients.forEach((ingredient) => {
        const key = normalizeIngredientKey(ingredient);

        if (!items[key]) {
          items[key] = {
            name: ingredient.name,
            qty: 0,
            unit: ingredient.unit,
            category: ingredient.category || "Autres",
            meals: new Set()
          };
        }

        items[key].qty += Number(ingredient.qty) || 0;
        items[key].meals.add(meal.name);
      });
    });
  });

  return Object.values(items)
    .map((item) => ({
      ...item,
      qty: Number.isInteger(item.qty) ? item.qty : Number(item.qty.toFixed(2)),
      meals: Array.from(item.meals)
    }))
    .sort((a, b) => {
      if (a.category === b.category) return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });
}

function buildPrepList(menu, meals) {
  if (!menu) return [];

  const mealMap = Object.fromEntries(meals.map((meal) => [meal.id, meal]));
  const prepMap = {};

  DAYS.forEach((day) => {
    SLOTS.forEach((slot) => {
      const mealId = menu.days?.[day]?.[slot.key];
      const meal = mealMap[mealId];

      if (!meal?.prep?.length) return;

      meal.prep.forEach((task) => {
        if (!prepMap[task]) {
          prepMap[task] = {
            task,
            meals: new Set(),
            days: new Set()
          };
        }

        prepMap[task].meals.add(meal.name);
        prepMap[task].days.add(day);
      });
    });
  });

  return Object.values(prepMap).map((item) => ({
    task: item.task,
    meals: Array.from(item.meals),
    days: Array.from(item.days)
  }));
}

function exportCsv(items) {
  const rows = [
    ["Catégorie", "Item", "Quantité", "Unité", "Repas associés"],
    ...items.map((item) => [
      item.category,
      item.name,
      item.qty,
      item.unit,
      item.meals.join(" | ")
    ])
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hearthsmith-epicerie.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hearthsmith-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function App() {
  const [state, setState] = useState(loadInitialState);

  const { meals, menus, selectedMenuId, groceryChecked, activeTab } = state;

  const selectedMenu = useMemo(
    () => menus.find((menu) => menu.id === selectedMenuId) || menus[0],
    [menus, selectedMenuId]
  );

  const mealMap = useMemo(
    () => Object.fromEntries(meals.map((meal) => [meal.id, meal])),
    [meals]
  );

  const groceryList = useMemo(
    () => buildGroceryList(selectedMenu, meals),
    [selectedMenu, meals]
  );

  const prepList = useMemo(
    () => buildPrepList(selectedMenu, meals),
    [selectedMenu, meals]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function setActiveTab(tab) {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }

  function selectMenu(id) {
    setState((prev) => ({ ...prev, selectedMenuId: id, groceryChecked: {} }));
  }

  function assignMeal(day, slotKey, mealId) {
    setState((prev) => ({
      ...prev,
      menus: prev.menus.map((menu) => {
        if (menu.id !== prev.selectedMenuId) return menu;

        return {
          ...menu,
          days: {
            ...menu.days,
            [day]: {
              ...menu.days[day],
              [slotKey]: mealId
            }
          }
        };
      })
    }));
  }

  function updateMealImage(mealId, imageUrl) {
    setState((prev) => ({
      ...prev,
      meals: prev.meals.map((meal) =>
        meal.id === mealId ? { ...meal, image: imageUrl } : meal
      )
    }));
  }

  function toggleGroceryItem(key) {
    setState((prev) => ({
      ...prev,
      groceryChecked: {
        ...prev.groceryChecked,
        [key]: !prev.groceryChecked[key]
      }
    }));
  }

  function resetData() {
    const confirmed = window.confirm(
      "Réinitialiser Hearthsmith avec les données de départ?"
    );

    if (!confirmed) return;

    setState({
      meals: seedMeals,
      menus: seedMenus,
      selectedMenuId: seedMenus[0].id,
      groceryChecked: {},
      activeTab: "menu"
    });
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        setState(imported);
      } catch {
        alert("Le fichier JSON n’est pas valide.");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="app">
      <header className="hero no-print">
        <div>
          <div className="eyebrow">
            <Flame size={16} />
            Hearthsmith
          </div>
          <h1>Forger les repas du foyer.</h1>
          <p>
            Menus, provisions et préparatifs pour nourrir le clan sans ajouter
            de chaos à la semaine.
          </p>
        </div>

        <div className="hero-actions">
          <button onClick={() => window.print()}>
            <Printer size={16} />
            Imprimer / PDF
          </button>
          <button onClick={() => exportCsv(groceryList)}>
            <FileDown size={16} />
            CSV épicerie
          </button>
          <button onClick={() => downloadJson(state)}>
            <Download size={16} />
            Backup JSON
          </button>
          <label className="button-like">
            <Import size={16} />
            Import JSON
            <input type="file" accept="application/json" onChange={importJson} />
          </label>
          <button className="danger" onClick={resetData}>
            <RefreshCcw size={16} />
            Reset
          </button>
        </div>
      </header>

      <section className="toolbar no-print">
        <div className="field">
          <label>Menu actif</label>
          <select
            value={selectedMenu?.id}
            onChange={(event) => selectMenu(event.target.value)}
          >
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </select>
        </div>

        <nav className="tabs">
          <button
            className={activeTab === "menu" ? "active" : ""}
            onClick={() => setActiveTab("menu")}
          >
            <CalendarDays size={16} />
            Menu
          </button>
          <button
            className={activeTab === "meals" ? "active" : ""}
            onClick={() => setActiveTab("meals")}
          >
            <Utensils size={16} />
            Repas
          </button>
          <button
            className={activeTab === "grocery" ? "active" : ""}
            onClick={() => setActiveTab("grocery")}
          >
            <ShoppingCart size={16} />
            Épicerie
          </button>
          <button
            className={activeTab === "prep" ? "active" : ""}
            onClick={() => setActiveTab("prep")}
          >
            <ChefHat size={16} />
            Meal prep
          </button>
        </nav>
      </section>

      <main>
        {activeTab === "menu" && (
          <WeeklyMenu
            menu={selectedMenu}
            meals={meals}
            mealMap={mealMap}
            onAssignMeal={assignMeal}
          />
        )}

        {activeTab === "meals" && (
          <MealLibrary meals={meals} onUpdateImage={updateMealImage} />
        )}

        {activeTab === "grocery" && (
          <GroceryList
            items={groceryList}
            checked={groceryChecked}
            onToggle={toggleGroceryItem}
          />
        )}

        {activeTab === "prep" && <MealPrep items={prepList} />}
      </main>
    </div>
  );
}

function WeeklyMenu({ menu, meals, mealMap, onAssignMeal }) {
  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <p className="eyebrow small">
            <Home size={14} />
            Menu hebdomadaire
          </p>
          <h2>{menu.name}</h2>
        </div>
        <p className="muted">
          Change un repas avec le menu déroulant. Les listes se mettent à jour
          automatiquement.
        </p>
      </div>

      <div className="week-grid">
        {DAYS.map((day) => (
          <article className="day-card" key={day}>
            <h3>{day}</h3>

            {SLOTS.map((slot) => {
              const mealId = menu.days?.[day]?.[slot.key];
              const meal = mealMap[mealId];

              return (
                <div className="meal-slot" key={slot.key}>
                  <div className="slot-label">{slot.label}</div>

                  {meal ? (
                    <div className="mini-meal">
                      <img src={meal.image} alt={meal.name} />
                      <div>
                        <strong>{meal.name}</strong>
                        <span>{meal.prepTime + meal.cookTime} min</span>
                      </div>
                    </div>
                  ) : (
                    <div className="empty">Aucun repas</div>
                  )}

                  <select
                    className="no-print"
                    value={mealId || ""}
                    onChange={(event) =>
                      onAssignMeal(day, slot.key, event.target.value)
                    }
                  >
                    <option value="">Choisir un repas</option>
                    {meals
                      .filter((mealOption) => mealOption.type === slot.key)
                      .map((mealOption) => (
                        <option key={mealOption.id} value={mealOption.id}>
                          {mealOption.name}
                        </option>
                      ))}
                  </select>
                </div>
              );
            })}
          </article>
        ))}
      </div>
    </section>
  );
}

function MealLibrary({ meals, onUpdateImage }) {
  const [query, setQuery] = useState("");

  const filteredMeals = meals.filter((meal) => {
    const search = `${meal.name} ${meal.type} ${meal.tags.join(" ")}`.toLowerCase();
    return search.includes(query.toLowerCase());
  });

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <p className="eyebrow small">
            <ClipboardList size={14} />
            Bibliothèque
          </p>
          <h2>Cartes repas</h2>
        </div>

        <div className="search no-print">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Chercher un repas, tag, type..."
          />
        </div>
      </div>

      <div className="meal-grid">
        {filteredMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onUpdateImage={(imageUrl) => onUpdateImage(meal.id, imageUrl)}
          />
        ))}
      </div>
    </section>
  );
}

function MealCard({ meal, onUpdateImage }) {
  const [imageInput, setImageInput] = useState(meal.image);

  return (
    <article className="meal-card">
      <img className="meal-image" src={meal.image} alt={meal.name} />

      <div className="meal-card-content">
        <div className="meal-card-header">
          <div>
            <p className="type-label">{getTypeLabel(meal.type)}</p>
            <h3>{meal.name}</h3>
          </div>
          <div className="time-pill">{meal.prepTime + meal.cookTime} min</div>
        </div>

        <p className="description">{meal.description}</p>

        <div className="badges">
          {meal.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="details-grid">
          <div>
            <h4>Ingrédients</h4>
            <ul>
              {meal.ingredients.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  {item.qty} {item.unit} — {item.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Préparation</h4>
            <ol>
              {meal.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="adaptations">
          <h4>Adaptations</h4>
          <p>
            <strong>Samuel :</strong> {meal.adaptations.samuel}
          </p>
          <p>
            <strong>Anne-Marie :</strong> {meal.adaptations.anneMarie}
          </p>
          <p>
            <strong>Enfants :</strong> {meal.adaptations.enfants}
          </p>
        </div>

        <div className="prep-box">
          <h4>Meal prep</h4>
          <ul>
            {meal.prep.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>

        <div className="image-editor no-print">
          <label>Image du repas</label>
          <div>
            <input
              value={imageInput}
              onChange={(event) => setImageInput(event.target.value)}
              placeholder="/meals/nom-image.jpg"
            />
            <button onClick={() => onUpdateImage(imageInput)}>Sauver</button>
          </div>
        </div>
      </div>
    </article>
  );
}

function GroceryList({ items, checked, onToggle }) {
  const grouped = items.reduce((acc, item) => {
    acc[item.category] ||= [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <p className="eyebrow small">
            <ShoppingCart size={14} />
            Liste d’épicerie
          </p>
          <h2>Provisions de la semaine</h2>
        </div>
        <p className="muted">
          Coche ce que tu as déjà. Exporte en CSV ou imprime la page.
        </p>
      </div>

      <div className="grocery-layout">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div className="grocery-category" key={category}>
            <h3>{category}</h3>

            {categoryItems.map((item) => {
              const key = normalizeIngredientKey(item);
              const isChecked = Boolean(checked[key]);

              return (
                <label
                  className={`grocery-item ${isChecked ? "checked" : ""}`}
                  key={key}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(key)}
                  />
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.qty} {item.unit} · {item.meals.join(", ")}
                    </small>
                  </span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function MealPrep({ items }) {
  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <p className="eyebrow small">
            <ChefHat size={14} />
            Meal prep
          </p>
          <h2>Préparer le foyer</h2>
        </div>
        <p className="muted">
          Les tâches sont consolidées à partir des repas de la semaine.
        </p>
      </div>

      <div className="prep-list">
        {items.map((item, index) => (
          <article className="prep-task" key={`${item.task}-${index}`}>
            <div className="task-number">{index + 1}</div>
            <div>
              <h3>{item.task}</h3>
              <p>
                <strong>Repas :</strong> {item.meals.join(", ")}
              </p>
              <p>
                <strong>Jours :</strong> {item.days.join(", ")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getTypeLabel(type) {
  return (
    {
      breakfast: "Déjeuner",
      lunch: "Dîner",
      dinner: "Souper",
      snack: "Collation"
    }[type] || type
  );
}

export default App;