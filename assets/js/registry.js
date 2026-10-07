/* Module registry. Each file in data/modules/ calls ADND.register(...).
   To add a module: create data/modules/module-NN.js, add a <script> tag in index.html,
   and move its entry out of `upcoming` below. */
window.ADND = (function () {
  "use strict";
  var modules = [];
  return {
    modules: modules,
    register: function (m) { modules.push(m); },
    upcoming: [
      { number: 2, title: "Faerûn Currency Localizations", tagline: "Coin, exchange and the money of the Realms." },
      { number: 3, title: "Faerûn Units of Measure", tagline: "Weights, lengths and volumes, from leagues to tuns." },
      { number: 4, title: "Faerûn Languages", tagline: "Common, Elvish, Dwarvish and the tongues of trade." },
      { number: 5, title: "Faerûn Ethnic Groups", tagline: "The peoples of Faerûn in your master data." },
      { number: 6, title: "Faerûn Calendar", tagline: "The Calendar of Harptos in Dynamics 365." },
      { number: 7, title: "Faerûn Communication Methods", tagline: "Scrolls, sending stones and messenger birds." },
      { number: 8, title: "Faerûn Salutations", tagline: "Address nobles, guildmasters and adventurers correctly." }
    ]
  };
})();
