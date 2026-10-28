(function (global) {
  function getLanguage() {
    try {
      return localStorage.getItem("smashup_lang") === "it" ? "it" : "en";
    } catch (e) {
      return "en";
    }
  }

  function setLanguage(language) {
    const lang = language === "it" ? "it" : "en";
    try {
      localStorage.setItem("smashup_lang", lang);
    } catch (e) {}

    document.documentElement.lang = lang;
    document.querySelectorAll("[data-en][data-it]").forEach(function (element) {
      element.innerHTML = element.getAttribute("data-" + lang);
    });

    const englishButton = document.getElementById("lang-en");
    const italianButton = document.getElementById("lang-it");
    if (englishButton && italianButton) {
      englishButton.classList.toggle("active", lang === "en");
      italianButton.classList.toggle("active", lang === "it");
    }

    document.dispatchEvent(new CustomEvent("smashup:lang", { detail: lang }));
  }

  function t(en, it) {
    return getLanguage() === "it" ? it : en;
  }

  global.SmashUpLang = { getLanguage: getLanguage, setLanguage: setLanguage, t: t };
})(window);
