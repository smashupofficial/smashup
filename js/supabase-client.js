(function (global) {
  var client = null;

  function isConfigured() {
    var cfg = global.SMASHUP_CONFIG || {};
    return Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && cfg.supabaseUrl.indexOf("http") === 0);
  }

  function getClient() {
    if (!isConfigured() || !global.supabase) return null;
    if (!client) {
      client = global.supabase.createClient(
        global.SMASHUP_CONFIG.supabaseUrl,
        global.SMASHUP_CONFIG.supabaseAnonKey
      );
    }
    return client;
  }

  function functionsUrl(name) {
    var cfg = global.SMASHUP_CONFIG || {};
    return cfg.supabaseUrl.replace(/\/$/, "") + "/functions/v1/" + name;
  }

  global.SmashUpApi = {
    isConfigured: isConfigured,
    getClient: getClient,
    functionsUrl: functionsUrl
  };
})(window);
