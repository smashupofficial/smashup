(function () {
  SmashUpLang.setLanguage(SmashUpLang.getLanguage());
  document.getElementById("lang-en").addEventListener("click", function () {
    SmashUpLang.setLanguage("en");
  });
  document.getElementById("lang-it").addEventListener("click", function () {
    SmashUpLang.setLanguage("it");
  });
  if (window.SmashUpContact) SmashUpContact.render("public-contact");

  var params = new URLSearchParams(window.location.search);
  var sessionId = params.get("session_id");
  var numberEl = document.getElementById("order-number");
  var statusEl = document.getElementById("order-status");

  if (!sessionId || !SmashUpApi.isConfigured()) {
    numberEl.textContent = "—";
    statusEl.textContent = SmashUpLang.t(
      "Payment is not live yet. No order number will be issued.",
      "Il pagamento non è ancora attivo. Non viene emesso un numero d'ordine."
    );
    return;
  }

  var tries = 0;
  async function poll() {
    var client = SmashUpApi.getClient();
    var result = await client.rpc("get_public_order_status", { p_session_id: sessionId });
    var row = Array.isArray(result.data) ? result.data[0] : result.data;
    if (row && row.order_number) {
      numberEl.textContent = row.order_number;
      statusEl.textContent = SmashUpLang.t(
        "Show this number at pickup.",
        "Mostra questo numero al ritiro."
      );
      SmashUpCart.clear();
      return;
    }
    tries += 1;
    if (tries < 15) {
      statusEl.textContent = SmashUpLang.t(
        "Confirming payment…",
        "Conferma del pagamento in corso…"
      );
      setTimeout(poll, 2000);
    } else {
      statusEl.textContent = SmashUpLang.t(
        "Payment received, but the order number is still pending. Ask staff with your payment email.",
        "Pagamento ricevuto, ma il numero d'ordine è ancora in attesa. Chiedi al personale con la tua email di pagamento."
      );
    }
  }

  poll();
})();
