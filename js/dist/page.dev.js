"use strict";

function createPage(day) {
  var page = document.createElement("div");
  page.className = "calendar-page";
  page.innerHTML = "\n    <div class=\"solar\">".concat(day.solar, "</div>\n    <div class=\"lunar\">").concat(day.lunar, "</div>\n    <div class=\"text\">").concat(day.text, "</div>\n  ");
  return page;
}
//# sourceMappingURL=page.dev.js.map
