"use strict";

function createFlipBook(data) {
  var flipbook = document.createElement("div");
  flipbook.className = "flipbook";
  data.forEach(function (day) {
    var page = createPage(day);
    flipbook.appendChild(page);
  });
  return flipbook;
}
//# sourceMappingURL=flipbook.dev.js.map
