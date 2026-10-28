window.SMASHUP_FALLBACK_CATALOG = {
  settings: {
    timezone: "Europe/Rome",
    lead_minutes: 20,
    slot_minutes: 15,
    ordering_enabled: false,
    // 0=Dom 1=Lun 2=Mar 3=Mer 4=Gio 5=Ven 6=Sab
    // Ordini online: lun/mer/gio/ven · 18:30–23:30 (ultimo ritiro 23:30)
    weekday_hours: {
      "0": [],
      "1": [{ open: "18:30", close: "23:30" }],
      "2": [],
      "3": [{ open: "18:30", close: "23:30" }],
      "4": [{ open: "18:30", close: "23:30" }],
      "5": [{ open: "18:30", close: "23:30" }],
      "6": []
    }
  },
  products: [
    {
      id: "smash-single",
      category: "burgers",
      sort_order: 10,
      name_en: "SINGLE",
      name_it: "SINGLE",
      desc_en: "Single beef burger*, cheddar, SMASHUP sauce",
      desc_it: "Burger single*, cheddar, salsa SMASHUP",
      price_cents: 690,
      requires_age: false,
      customizable: true,
      qty_label: null
    },
    {
      id: "smash-double",
      category: "burgers",
      sort_order: 20,
      name_en: "DOUBLE",
      name_it: "DOUBLE",
      desc_en: "Double beef burger*, cheddar, SMASHUP sauce",
      desc_it: "Burger double*, cheddar, salsa SMASHUP",
      price_cents: 990,
      requires_age: false,
      customizable: true,
      qty_label: null
    },
    {
      id: "chicken-burger",
      category: "burgers",
      sort_order: 30,
      name_en: "CHICKEN BURGER",
      name_it: "CHICKEN BURGER",
      desc_en: "Fried chicken cutlet*, cheddar, bacon, mayonnaise, pickle",
      desc_it: "Cotoletta di pollo fritta*, cheddar, bacon, maionese, cetriolino sott'aceto",
      price_cents: 790,
      requires_age: false,
      customizable: false,
      qty_label: null
    },
    {
      id: "vegan-burger",
      category: "burgers",
      sort_order: 40,
      name_en: "VEGAN BURGER",
      name_it: "VEGAN BURGER",
      desc_en: "Vegan burger*, vegan cheddar, BBQ sauce, pickle",
      desc_it: "Burger vegano*, cheddar vegano, salsa BBQ, cetriolino sott'aceto",
      price_cents: 890,
      requires_age: false,
      customizable: false,
      qty_label: null
    },
    {
      id: "fries",
      category: "sides",
      sort_order: 50,
      name_en: "FRENCH FRIES*",
      name_it: "PATATINE*",
      desc_en: "",
      desc_it: "",
      price_cents: 300,
      requires_age: false,
      customizable: false,
      qty_label: null
    },
    {
      id: "sweet-potato-fries",
      category: "sides",
      sort_order: 60,
      name_en: "SWEET POTATO FRIES*",
      name_it: "PATATE DOLCI*",
      desc_en: "",
      desc_it: "",
      price_cents: 400,
      requires_age: false,
      customizable: false,
      qty_label: null
    },
    {
      id: "nuggets",
      category: "chicken",
      sort_order: 70,
      name_en: "CHICKEN NUGGETS*",
      name_it: "CHICKEN NUGGETS*",
      desc_en: "Battered and fried chicken breast pieces",
      desc_it: "Bocconcini di petto di pollo impanati e fritti",
      price_cents: 500,
      requires_age: false,
      customizable: false,
      qty_label: "6 PCS"
    },
    {
      id: "tenders",
      category: "chicken",
      sort_order: 80,
      name_en: "CHICKEN TENDERS*",
      name_it: "CHICKEN TENDERS*",
      desc_en: "Seasoned, breaded and fried chicken thigh fillets served with SMASHUP sauce",
      desc_it: "Filetti di coscia di pollo speziati, impanati e fritti, serviti con salsa SMASHUP",
      price_cents: 600,
      requires_age: false,
      customizable: false,
      qty_label: "4 PCS"
    },
    {
      id: "heinz",
      category: "sauces",
      sort_order: 90,
      name_en: "HEINZ",
      name_it: "HEINZ",
      desc_en: "",
      desc_it: "",
      price_cents: 50,
      requires_age: false,
      customizable: false,
      qty_label: null
    },
    {
      id: "smashup-sauce",
      category: "sauces",
      sort_order: 100,
      name_en: "SMASHUP SAUCE",
      name_it: "SALSA SMASHUP",
      desc_en: "",
      desc_it: "",
      price_cents: 100,
      requires_age: false,
      customizable: false,
      qty_label: null
    },
    {
      id: "water",
      category: "drinks",
      sort_order: 110,
      name_en: "WATER",
      name_it: "ACQUA",
      desc_en: "",
      desc_it: "",
      price_cents: 100,
      requires_age: false,
      customizable: false,
      qty_label: null
    },
    {
      id: "soft-drink",
      category: "drinks",
      sort_order: 120,
      name_en: "SOFT DRINK",
      name_it: "BIBITA",
      desc_en: "",
      desc_it: "",
      price_cents: 250,
      requires_age: false,
      customizable: false,
      qty_label: "33CL"
    },
    {
      id: "nastro",
      category: "beers",
      sort_order: 130,
      name_en: "NASTRO",
      name_it: "NASTRO",
      desc_en: "",
      desc_it: "",
      price_cents: 300,
      requires_age: true,
      customizable: false,
      qty_label: "33CL"
    },
    {
      id: "raffo",
      category: "beers",
      sort_order: 140,
      name_en: "RAFFO GREZZA",
      name_it: "RAFFO GREZZA",
      desc_en: "",
      desc_it: "",
      price_cents: 400,
      requires_age: true,
      customizable: false,
      qty_label: "33CL"
    },
    {
      id: "ichnusa",
      category: "beers",
      sort_order: 150,
      name_en: "ICHNUSA NON FILTRATA",
      name_it: "ICHNUSA NON FILTRATA",
      desc_en: "",
      desc_it: "",
      price_cents: 500,
      requires_age: true,
      customizable: false,
      qty_label: "50CL"
    }
  ],
  modifiers: [
    {
      id: "bacon",
      product_id: "smash-single",
      name_en: "Bacon",
      name_it: "Bacon",
      price_cents: 100,
      sort_order: 1
    },
    {
      id: "pickles",
      product_id: "smash-single",
      name_en: "Pickles",
      name_it: "Cetriolini",
      price_cents: 0,
      sort_order: 2
    },
    {
      id: "bacon-double",
      product_id: "smash-double",
      name_en: "Bacon",
      name_it: "Bacon",
      price_cents: 100,
      sort_order: 1
    },
    {
      id: "pickles-double",
      product_id: "smash-double",
      name_en: "Pickles",
      name_it: "Cetriolini",
      price_cents: 0,
      sort_order: 2
    }
  ]
};
