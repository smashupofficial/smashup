(function () {
  var catalog = window.SMASHUP_FALLBACK_CATALOG;
  var customizing = null;
  if (window.SmashUpContact) SmashUpContact.render("public-contact");

  var CATEGORIES = [
    { id: "burgers", en: "BURGERS", it: "BURGER" },
    { id: "sides", en: "SIDES", it: "CONTORNI" },
    { id: "chicken", en: "CHICKEN", it: "POLLO" },
    { id: "sauces", en: "SAUCES", it: "SALSE" },
    { id: "drinks", en: "DRINKS", it: "BEVANDE" },
    { id: "beers", en: "BEERS", it: "BIRRE" }
  ];

  function euros(cents) {
    return "€" + (cents / 100).toFixed(2);
  }

  function productName(product) {
    return SmashUpLang.getLanguage() === "it" ? product.name_it : product.name_en;
  }

  function productDesc(product) {
    return SmashUpLang.getLanguage() === "it" ? product.desc_it : product.desc_en;
  }

  function modifierName(mod) {
    return SmashUpLang.getLanguage() === "it" ? mod.name_it : mod.name_en;
  }

  async function loadRemoteCatalog() {
    var client = SmashUpApi.getClient();
    if (!client) return catalog;

    var products = await client.from("products").select("*").eq("active", true).order("sort_order");
    var modifiers = await client.from("modifiers").select("*").eq("active", true).order("sort_order");
    var settings = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();

    if (products.error || modifiers.error || !products.data || !products.data.length) {
      return catalog;
    }

    return {
      products: products.data,
      modifiers: modifiers.data || [],
      settings: settings.data || catalog.settings
    };
  }

  function orderingOn() {
    var remote = catalog.settings && catalog.settings.ordering_enabled;
    return Boolean(window.SMASHUP_CONFIG.orderingEnabled && remote);
  }

  function renderBanner() {
    var el = document.getElementById("progress-banner");
    if (orderingOn()) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
  }

  function renderMenu() {
    var root = document.getElementById("menu-list");
    root.innerHTML = "";
    CATEGORIES.forEach(function (category) {
      var items = catalog.products.filter(function (p) { return p.category === category.id; });
      if (!items.length) return;
      var heading = document.createElement("div");
      heading.className = "category";
      heading.setAttribute("data-en", category.en);
      heading.setAttribute("data-it", category.it);
      heading.textContent = SmashUpLang.getLanguage() === "it" ? category.it : category.en;
      root.appendChild(heading);

      items.forEach(function (product) {
        var row = document.createElement("div");
        row.className = "item";
        row.innerHTML =
          '<div class="item-info">' +
            '<div class="item-name"></div>' +
            '<div class="item-desc"></div>' +
          "</div>" +
          '<div class="item-actions">' +
            '<div class="item-price"></div>' +
            (product.qty_label ? '<span class="item-qty"></span>' : "") +
            '<button type="button" class="add-btn"></button>' +
          "</div>";
        row.querySelector(".item-name").textContent = productName(product);
        row.querySelector(".item-desc").textContent = productDesc(product);
        row.querySelector(".item-price").textContent = euros(product.price_cents);
        if (product.qty_label) row.querySelector(".item-qty").textContent = product.qty_label;
        var addBtn = row.querySelector(".add-btn");
        addBtn.textContent = SmashUpLang.t("ADD", "AGGIUNGI");
        addBtn.addEventListener("click", function () {
          if (product.customizable) openCustomizer(product);
          else SmashUpCart.add({ productId: product.id, qty: 1, modifierIds: [] });
        });
        root.appendChild(row);
      });
    });
  }

  function openCustomizer(product) {
    customizing = product;
    var mods = catalog.modifiers.filter(function (m) { return m.product_id === product.id; });
    document.getElementById("modal-title").textContent = productName(product);
    var box = document.getElementById("modal-mods");
    box.innerHTML = "";
    mods.forEach(function (mod) {
      var label = document.createElement("label");
      label.className = "check-row";
      label.innerHTML =
        '<span>' + modifierName(mod) + '</span>' +
        '<span class="extra-price">' + (mod.price_cents ? "+" + euros(mod.price_cents) : SmashUpLang.t("FREE", "GRATIS")) + "</span>" +
        '<input type="checkbox" value="' + mod.id + '">';
      box.appendChild(label);
    });
    document.getElementById("modal-qty").value = 1;
    document.getElementById("modal-note").value = "";
    document.getElementById("customizer").hidden = false;
  }

  function closeCustomizer() {
    customizing = null;
    document.getElementById("customizer").hidden = true;
  }

  function renderCart() {
    var list = document.getElementById("cart-items");
    var items = SmashUpCart.load();
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = '<p class="empty" data-en="Cart is empty" data-it="Il carrello è vuoto">' +
        SmashUpLang.t("Cart is empty", "Il carrello è vuoto") + "</p>";
    }
    items.forEach(function (item) {
      var product = catalog.products.find(function (p) { return p.id === item.productId; });
      if (!product) return;
      var mods = (item.modifierIds || []).map(function (id) {
        var mod = catalog.modifiers.find(function (m) { return m.id === id; });
        return mod ? modifierName(mod) : "";
      }).filter(Boolean);
      var row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML =
        "<div>" +
          "<strong>" + item.qty + "× " + productName(product) + "</strong>" +
          (mods.length ? '<div class="cart-mods">' + mods.join(", ") + "</div>" : "") +
          (item.note ? '<div class="cart-mods">' + item.note + "</div>" : "") +
        "</div>" +
        "<div>" + euros(SmashUpCart.lineTotal(item, catalog)) +
        '<button type="button" class="remove-btn" aria-label="Remove">×</button></div>';
      row.querySelector(".remove-btn").addEventListener("click", function () {
        SmashUpCart.remove(item.id);
      });
      list.appendChild(row);
    });

    document.getElementById("cart-total").textContent = euros(SmashUpCart.total(catalog));
    document.getElementById("cart-count").textContent = SmashUpCart.count();

    var alcohol = SmashUpCart.hasAlcohol(catalog);
    document.getElementById("age-wrap").hidden = !alcohol;
    renderPayState();
  }

  function renderSlots() {
    var select = document.getElementById("pickup-at");
    // 7 giorni: con mar/sab/dom chiusi restano comunque slot lun/mer/gio/ven
    var slots = SmashUpPickup.buildSlots(catalog.settings, 7);
    select.innerHTML = '<option value="">' + SmashUpLang.t("Select pickup time", "Scegli orario di ritiro") + "</option>";
    slots.forEach(function (slot) {
      var opt = document.createElement("option");
      opt.value = slot.iso;
      opt.textContent = slot.label;
      select.appendChild(opt);
    });
    if (!slots.length) {
      var opt = document.createElement("option");
      opt.value = "";
      opt.textContent = SmashUpLang.t(
        "No slots now — online orders: Mon, Wed, Thu, Fri 18:30–23:30",
        "Nessuno slot ora — ordini online: lun, mer, gio, ven 18:30–23:30"
      );
      select.appendChild(opt);
    }
  }

  function renderPayState() {
    var pay = document.getElementById("pay-btn");
    var enabled = orderingOn() && SmashUpCart.count() > 0;
    pay.disabled = !enabled;
    pay.textContent = orderingOn()
      ? SmashUpLang.t("PAY WITH STRIPE", "PAGA CON STRIPE")
      : SmashUpLang.t("CHECKOUT IN PROGRESS", "PAGAMENTO IN ARRIVO");
  }

  async function checkout(event) {
    event.preventDefault();
    var errorEl = document.getElementById("checkout-error");
    errorEl.hidden = true;
    if (!orderingOn()) return;

    var name = document.getElementById("customer-name").value.trim();
    var phone = document.getElementById("customer-phone").value.trim();
    var pickupAt = document.getElementById("pickup-at").value;
    var ageConfirmed = document.getElementById("age-confirm").checked;
    if (name.length < 2 || phone.length < 6 || !pickupAt) {
      errorEl.textContent = SmashUpLang.t(
        "Enter name, phone, and a pickup time.",
        "Inserisci nome, telefono e orario di ritiro."
      );
      errorEl.hidden = false;
      return;
    }
    if (SmashUpCart.hasAlcohol(catalog) && !ageConfirmed) {
      errorEl.textContent = SmashUpLang.t(
        "Confirm you are 18+ to order beer.",
        "Conferma di avere almeno 18 anni per ordinare birra."
      );
      errorEl.hidden = false;
      return;
    }

    var payload = {
      customer_name: name,
      customer_phone: phone,
      pickup_at: pickupAt,
      age_confirmed: ageConfirmed,
      locale: SmashUpLang.getLanguage(),
      items: SmashUpCart.load().map(function (item) {
        return {
          product_id: item.productId,
          qty: item.qty,
          modifier_ids: item.modifierIds,
          note: item.note
        };
      })
    };

    try {
      var response = await fetch(SmashUpApi.functionsUrl("create-checkout-session"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: window.SMASHUP_CONFIG.supabaseAnonKey,
          Authorization: "Bearer " + window.SMASHUP_CONFIG.supabaseAnonKey
        },
        body: JSON.stringify(payload)
      });
      var data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      errorEl.textContent = err.message || "Checkout failed";
      errorEl.hidden = false;
    }
  }

  document.addEventListener("smashup:cart", renderCart);
  document.addEventListener("smashup:lang", function () {
    renderMenu();
    renderCart();
    renderSlots();
  });

  document.getElementById("lang-en").addEventListener("click", function () {
    SmashUpLang.setLanguage("en");
  });
  document.getElementById("lang-it").addEventListener("click", function () {
    SmashUpLang.setLanguage("it");
  });
  document.getElementById("modal-cancel").addEventListener("click", closeCustomizer);
  document.getElementById("modal-add").addEventListener("click", function () {
    if (!customizing) return;
    var modifierIds = Array.prototype.slice
      .call(document.querySelectorAll("#modal-mods input:checked"))
      .map(function (input) { return input.value; });
    SmashUpCart.add({
      productId: customizing.id,
      qty: document.getElementById("modal-qty").value,
      modifierIds: modifierIds,
      note: document.getElementById("modal-note").value
    });
    closeCustomizer();
  });
  document.getElementById("checkout-form").addEventListener("submit", checkout);

  loadRemoteCatalog().then(function (loaded) {
    catalog = loaded;
    SmashUpLang.setLanguage(SmashUpLang.getLanguage());
    renderBanner();
    renderMenu();
    renderCart();
    renderSlots();
  });
})();
