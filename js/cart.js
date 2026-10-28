(function (global) {
  var STORAGE_KEY = "smashup_cart_v1";

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("smashup:cart"));
  }

  function add(item) {
    var items = load();
    items.push({
      id: String(Date.now()) + "-" + Math.random().toString(16).slice(2),
      productId: item.productId,
      qty: Math.max(1, parseInt(item.qty, 10) || 1),
      modifierIds: item.modifierIds || [],
      note: (item.note || "").trim().slice(0, 140)
    });
    save(items);
  }

  function remove(id) {
    save(load().filter(function (item) { return item.id !== id; }));
  }

  function clear() {
    save([]);
  }

  function lineTotal(item, catalog) {
    var product = catalog.products.find(function (p) { return p.id === item.productId; });
    if (!product) return 0;
    var extra = 0;
    (item.modifierIds || []).forEach(function (modId) {
      var mod = catalog.modifiers.find(function (m) {
        return m.id === modId && m.product_id === item.productId;
      });
      if (mod) extra += mod.price_cents;
    });
    return (product.price_cents + extra) * item.qty;
  }

  function total(catalog) {
    return load().reduce(function (sum, item) {
      return sum + lineTotal(item, catalog);
    }, 0);
  }

  function count() {
    return load().reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function hasAlcohol(catalog) {
    return load().some(function (item) {
      var product = catalog.products.find(function (p) { return p.id === item.productId; });
      return product && product.requires_age;
    });
  }

  global.SmashUpCart = {
    load: load,
    add: add,
    remove: remove,
    clear: clear,
    lineTotal: lineTotal,
    total: total,
    count: count,
    hasAlcohol: hasAlcohol
  };
})(window);
