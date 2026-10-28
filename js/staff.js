(function () {
  SmashUpLang.setLanguage(SmashUpLang.getLanguage());

  var loginView = document.getElementById("login-view");
  var dashView = document.getElementById("dash-view");
  var list = document.getElementById("order-list");
  var errorEl = document.getElementById("login-error");
  var channel = null;

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function formatMoney(cents) {
    return "€" + (cents / 100).toFixed(2);
  }

  function formatTime(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleString("it-IT", { timeZone: "Europe/Rome" });
  }

  async function loadOrders() {
    var client = SmashUpApi.getClient();
    var result = await client
      .from("orders")
      .select("*, order_items(*)")
      .neq("status", "pending")
      .order("pickup_at", { ascending: true });

    if (result.error) {
      list.innerHTML = "<p class='empty'>" + result.error.message + "</p>";
      return;
    }

    var rows = result.data || [];
    if (!rows.length) {
      list.innerHTML = "<p class='empty'>" + SmashUpLang.t("No paid orders yet.", "Nessun ordine pagato.") + "</p>";
      return;
    }

    list.innerHTML = "";
    rows.forEach(function (order) {
      var card = document.createElement("article");
      card.className = "order-card status-" + order.status;
      var items = (order.order_items || []).map(function (line) {
        var extras = "";
        if (line.modifiers && line.modifiers.length) {
          extras = " (" + line.modifiers.map(function (m) { return m.name_it || m.name_en || m.id; }).join(", ") + ")";
        }
        return "<li>" + line.qty + "× " + (line.name_it || line.name_en || line.product_id) + extras +
          (line.note ? " — " + line.note : "") + "</li>";
      }).join("");

      card.innerHTML =
        '<header><strong>' + (order.order_number || "—") + "</strong>" +
        '<span class="pill">' + order.status + "</span></header>" +
        "<p>" + SmashUpLang.t("Pickup", "Ritiro") + ": " + formatTime(order.pickup_at) + "</p>" +
        "<p>" + order.customer_name + " · " + order.customer_phone + (order.customer_email ? " · " + order.customer_email : "") + "</p>" +
        "<ul>" + items + "</ul>" +
        "<p class='total'>" + formatMoney(order.total_cents) + "</p>" +
        '<div class="status-actions">' +
          '<button type="button" data-status="preparing">Preparing</button>' +
          '<button type="button" data-status="ready">Ready</button>' +
          '<button type="button" data-status="completed">Completed</button>' +
        "</div>";

      card.querySelectorAll("button[data-status]").forEach(function (btn) {
        btn.addEventListener("click", async function () {
          await client.from("orders").update({ status: btn.getAttribute("data-status") }).eq("id", order.id);
          loadOrders();
        });
      });
      list.appendChild(card);
    });
  }

  function subscribe() {
    var client = SmashUpApi.getClient();
    if (channel) client.removeChannel(channel);
    channel = client
      .channel("staff-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, loadOrders)
      .subscribe();
  }

  async function showDashboard() {
    loginView.hidden = true;
    dashView.hidden = false;
    await loadOrders();
    subscribe();
  }

  document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    showError("");
    if (!SmashUpApi.isConfigured()) {
      showError("Add Supabase keys in js/config.js");
      return;
    }
    var client = SmashUpApi.getClient();
    var result = await client.auth.signInWithPassword({
      email: document.getElementById("staff-email").value,
      password: document.getElementById("staff-password").value
    });
    if (result.error) {
      showError(result.error.message);
      return;
    }
    showDashboard();
  });

  document.getElementById("logout-btn").addEventListener("click", async function () {
    var client = SmashUpApi.getClient();
    if (client) await client.auth.signOut();
    if (channel && client) client.removeChannel(channel);
    dashView.hidden = true;
    loginView.hidden = false;
  });

  if (SmashUpApi.isConfigured()) {
    SmashUpApi.getClient().auth.getSession().then(function (result) {
      if (result.data && result.data.session) showDashboard();
    });
  }
})();
