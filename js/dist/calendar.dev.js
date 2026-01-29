"use strict";

function initCalendar() {
  var app = document.getElementById("app");
  var container = document.createElement("div");
  container.className = "calendar-container";
  var title = document.createElement("h1");
  title.textContent = "LỊCH TẾT 2026";
  var flipbook = createFlipBook(calendarData);
  container.appendChild(title);
  container.appendChild(flipbook);
  app.appendChild(container);
}

initCalendar();
//# sourceMappingURL=calendar.dev.js.map
