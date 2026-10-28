/* Public keys only. Leave orderingEnabled false until Stripe test/live is approved. */
window.SMASHUP_CONFIG = {
  supabaseUrl: "https://rwctyntcrswtjkjqnbbi.supabase.co",
  supabaseAnonKey: "sb_publishable_cFBBO7ZsISSfH6OA5X6Fng_q5YOAN-L",
  siteUrl: "https://smashupburgers.it",
  orderingEnabled: false,
  publicPhone: "+39 379 354 4623",
  publicPhoneTel: "+393793544623",
  publicEmail: "info@smashupburgers.it",
  staffEmail: "info@smashupburgers.it",
  stripePublishableKey: "pk_test_51UOxxzQrZzsglNUM726XZYI3eqHNCCGHrCMDns1NkyozoCG8yTH10q4xThZlrdpurZxV5L4mX8z2kKQLBiKmwfaI00HoUVqgbR"
};

window.SmashUpContact = {
  render: function (elementId) {
    var el = document.getElementById(elementId || "public-contact");
    var cfg = window.SMASHUP_CONFIG;
    if (!el || !cfg) return;
    el.innerHTML =
      '<a href="tel:' + cfg.publicPhoneTel + '">' + cfg.publicPhone + "</a>" +
      " · " +
      '<a href="mailto:' + cfg.publicEmail + '">' + cfg.publicEmail + "</a>";
  }
};
