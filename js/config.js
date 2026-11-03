/* Public keys only. Leave orderingEnabled false until Stripe test/live is approved. */
window.SMASHUP_CONFIG = {
  supabaseUrl: "https://rwctyntcrswtjkjqnbbi.supabase.co",
  supabaseAnonKey: "sb_publishable_cFBBO7ZsISSfH6OA5X6Fng_q5YOAN-L",
  siteUrl: "https://smashupburgers.it",
  orderingEnabled: true,
  testBypassHours: false,
  publicPhone: "+39 379 354 4623",
  publicPhoneTel: "+393793544623",
  publicEmail: "info@smashupburgers.it",
  staffEmail: "info@smashupburgers.it",
  stripePublishableKey: "pk_live_51UOxxzQrZzsglNUM3Vzd99opBxypEDMojlYLzjpKoc7Iq3jKhMCBJwG5h4HDFTmYXt5CzitzY90APF97bM5unk3N0016kvP2SM"
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
