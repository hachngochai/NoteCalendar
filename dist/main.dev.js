"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* ===== DOM ===== */
var calendarDays = document.getElementById("calendar-days");
var dayName = document.getElementById("day-name");
var monthYear = document.getElementById("month-year");
var eventTitle = document.getElementById("eventTitle");
var eventTime = document.getElementById("eventTime");
var eventLocation = document.getElementById("eventLocation");
var eventNote = document.getElementById("eventNote");
var eventDateText = document.getElementById("eventDateText");
var resetBtn = document.getElementById("resetModeBtn");
var resetModal = document.getElementById("resetModal");
var confirmReset = document.getElementById("confirmReset");
var cancelReset = document.getElementById("cancelReset");
/* ===== TIME ===== */

var today = new Date();
var viewYear = today.getFullYear();
var viewMonth = today.getMonth();
var selectedDateKey = null;
/* ===== RESET MODE ===== */

var resetMode = false;
/* ===== DATA ===== */

var weekDaysVN = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
var monthsVN = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
var events = JSON.parse(localStorage.getItem("tetEvents")) || {};
/* ===== RENDER CALENDAR ===== */

function renderCalendar(month, year) {
  calendarDays.innerHTML = "";
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  monthYear.textContent = "".concat(monthsVN[month], " n\u0103m ").concat(year);
  dayName.textContent = "".concat(weekDaysVN[today.getDay()], ", ng\xE0y ").concat(today.getDate());
  var startIndex = firstDay === 0 ? 6 : firstDay - 1;
  var row = document.createElement("div");

  for (var i = 0; i < startIndex; i++) {
    row.appendChild(document.createElement("span"));
  }

  var _loop = function _loop(d) {
    if (row.children.length === 7) {
      calendarDays.appendChild(row);
      row = document.createElement("div");
    }

    var span = document.createElement("span");
    span.textContent = d;
    if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) span.classList.add("active");
    var dateKey = "".concat(year, "-").concat(month + 1, "-").concat(d);
    if (events[dateKey]) span.classList.add("event");

    span.onclick = function () {
      if (resetMode) {
        if (!events[dateKey]) return;
        delete events[dateKey];
        localStorage.setItem("tetEvents", JSON.stringify(events));
        renderCalendar(viewMonth, viewYear);
        return;
      }

      openEventForm(year, month, d);
    };

    row.appendChild(span);
  };

  for (var d = 1; d <= daysInMonth; d++) {
    _loop(d);
  }

  while (row.children.length < 7) {
    row.appendChild(document.createElement("span"));
  }

  calendarDays.appendChild(row);
}
/* ===== OPEN FORM ===== */


function openEventForm(year, month, day) {
  selectedDateKey = "".concat(year, "-").concat(month + 1, "-").concat(day);
  var dateObj = new Date(year, month, day);
  eventDateText.textContent = "".concat(day, "/").concat(month + 1, "/").concat(year, " (").concat(weekDaysVN[dateObj.getDay()], ")");
  var data = events[selectedDateKey] || {};
  eventTitle.value = data.title || "";
  eventTime.value = data.time || "";
  eventLocation.value = data.location || "";
  eventNote.value = data.note || "";
  document.querySelector(".calendar").classList.add("flip");
}
/* ===== SAVE EVENT ===== */


document.getElementById("saveEvent").onclick = function () {
  if (!selectedDateKey) return;
  events[selectedDateKey] = {
    title: eventTitle.value.trim(),
    time: eventTime.value,
    location: eventLocation.value.trim(),
    note: eventNote.value.trim()
  };
  localStorage.setItem("tetEvents", JSON.stringify(events));
  document.querySelector(".calendar").classList.remove("flip");
  renderCalendar(viewMonth, viewYear);
};
/* ===== CANCEL ===== */


document.getElementById("cancelEvent").onclick = function () {
  document.querySelector(".calendar").classList.remove("flip");
};
/* ===== RESET BUTTON ===== */


resetBtn.onclick = function () {
  resetModal.classList.remove("hidden");
};

confirmReset.onclick = function () {
  resetMode = true;
  resetModal.classList.add("hidden");
};

cancelReset.onclick = function () {
  resetMode = false;
  resetModal.classList.add("hidden");
};
/* ===== NAVIGATION ===== */


function animateCalendar(direction) {
  calendarDays.classList.remove("slide-left", "slide-right"); // force reflow để reset animation

  void calendarDays.offsetWidth;
  calendarDays.classList.add(direction === "next" ? "slide-left" : "slide-right");
}

document.getElementById("prev").onclick = function () {
  animateCalendar("prev");
  setTimeout(function () {
    viewMonth--;

    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }

    renderCalendar(viewMonth, viewYear);
  }, 220); // ⏱ đúng với CSS animation
};

document.getElementById("next").onclick = function () {
  animateCalendar("next");
  setTimeout(function () {
    viewMonth++;

    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }

    renderCalendar(viewMonth, viewYear);
  }, 220);
};
/* ===== INIT ===== */


renderCalendar(viewMonth, viewYear);
/* ================= FIREWORK ENGINE (RESTORED) ================= */

var canvas = document.getElementById("fireworks");
var ctx = canvas.getContext("2d");
var W, H;

function resizeFireworks() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeFireworks);
resizeFireworks();
var GRAVITY = 0.06;
var FIREWORK_Y = H * 0.32;
var fireworks = [];
var particles = [];

var Firework =
/*#__PURE__*/
function () {
  function Firework(x) {
    _classCallCheck(this, Firework);

    this.x = x;
    this.y = H;
    this.vy = -(7 + Math.random() * 3);
    this.color = randomColor();
    this.exploded = false;
  }

  _createClass(Firework, [{
    key: "update",
    value: function update() {
      this.y += this.vy;

      if (this.y <= FIREWORK_Y) {
        this.explode();
        this.exploded = true;
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, 2, 12);
    }
  }, {
    key: "explode",
    value: function explode() {
      var count = 60 + Math.random() * 40;

      for (var i = 0; i < count; i++) {
        particles.push(new Particle(this.x, this.y, this.color));
      }
    }
  }]);

  return Firework;
}();

var Particle =
/*#__PURE__*/
function () {
  function Particle(x, y, color) {
    _classCallCheck(this, Particle);

    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 5 + 2;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.size = Math.random() * 2 + 1;
    this.color = color;
  }

  _createClass(Particle, [{
    key: "update",
    value: function update() {
      this.vy += GRAVITY;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.015;
    }
  }, {
    key: "draw",
    value: function draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }]);

  return Particle;
}();

function randomColor() {
  var colors = ["#FFD700", "#FF3D00", "#FF9100", "#F50057", "#00E5FF", "#76FF03", "#FFEA00"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function animateFireworks() {
  ctx.clearRect(0, 0, W, H);
  fireworks = fireworks.filter(function (fw) {
    return !fw.exploded;
  });
  particles = particles.filter(function (p) {
    return p.alpha > 0;
  });
  fireworks.forEach(function (fw) {
    fw.update();
    fw.draw();
  });
  particles.forEach(function (p) {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateFireworks);
}

animateFireworks();
/* ===== AUTO FIRE – LỆCH PHẢI ===== */

setInterval(function () {
  var baseX = W * 0.78;
  var spread = 140;
  fireworks.push(new Firework(baseX + (Math.random() * spread - spread / 2)));
}, 1500);
/* ================= THEME SYSTEM (STEP 1) ================= */

var themeModal = document.getElementById("themeModal");
var openTheme = document.getElementById("openTheme");
var closeTheme = document.getElementById("closeTheme");
var applyThemeBtn = document.getElementById("applyTheme");
var bgInput = document.getElementById("theme-bg");
var textInput = document.getElementById("theme-text");
var accentInput = document.getElementById("theme-accent");
/* open / close */

openTheme.onclick = function () {
  return themeModal.classList.remove("hidden");
};

closeTheme.onclick = function () {
  return themeModal.classList.add("hidden");
};
/* apply */


applyThemeBtn.onclick = function () {
  var theme = {
    bg: bgInput.value,
    text: textInput.value,
    accent: accentInput.value
  };
  setTheme(theme);
  localStorage.setItem("calendarTheme", JSON.stringify(theme));
  themeModal.classList.add("hidden");
};
/* apply theme to css variables */


function setTheme(theme) {
  if (theme.bg) document.documentElement.style.setProperty("--calendar-bg", theme.bg);
  if (theme.text) document.documentElement.style.setProperty("--calendar-text", theme.text);
  if (theme.accent) document.documentElement.style.setProperty("--calendar-accent", theme.accent);
}
/* load saved theme */


var savedTheme = JSON.parse(localStorage.getItem("calendarTheme"));
if (savedTheme) setTheme(savedTheme);
var resetThemeBtn = document.getElementById("resetTheme");
var DEFAULT_THEME = {
  bg: "#a12424",
  text: "#fff8e1",
  accent: "#ffd54f"
};

resetThemeBtn.onclick = function () {
  // reset CSS variables
  setTheme(DEFAULT_THEME); // xoá theme custom đã lưu

  localStorage.removeItem("calendarTheme"); // set lại color picker cho đúng màu mặc định

  bgInput.value = DEFAULT_THEME.bg;
  textInput.value = DEFAULT_THEME.text;
  accentInput.value = DEFAULT_THEME.accent;
};

var timePicker = document.getElementById("timePicker");
var pickMonth = document.getElementById("pickMonth");
var pickYear = document.getElementById("pickYear");
monthYear.style.cursor = "pointer";

monthYear.onclick = function () {
  openTimePicker();
};

function openTimePicker() {
  pickMonth.innerHTML = "";
  pickYear.innerHTML = ""; // tháng

  monthsVN.forEach(function (m, i) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.textContent = m;
    if (i === viewMonth) opt.selected = true;
    pickMonth.appendChild(opt);
  }); // năm (±20 năm)

  var currentYear = today.getFullYear();

  for (var y = currentYear - 20; y <= currentYear + 20; y++) {
    var opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    if (y === viewYear) opt.selected = true;
    pickYear.appendChild(opt);
  }

  timePicker.classList.remove("hidden");
}

function goToDate(year, month) {
  viewYear = year;
  viewMonth = month; // animation chuyển cảnh theo hướng "nhảy"

  animateCalendar("next");
  renderCalendar(viewMonth, viewYear);
}

document.getElementById("goTime").onclick = function () {
  var y = parseInt(document.getElementById("pickYear").value);
  var m = parseInt(document.getElementById("pickMonth").value);
  if (isNaN(y) || isNaN(m)) return;
  var cal = document.querySelector(".calendar"); // reset animation nếu spam click

  cal.classList.remove("year-jump");
  void cal.offsetWidth; // force reflow
  // thêm hiệu ứng rung + ripple

  cal.classList.add("year-jump"); // delay nhẹ cho cảm giác "nhảy năm"

  setTimeout(function () {
    goToDate(y, m); // JS month bắt đầu từ 0
  }, 180);
  document.getElementById("timeModal").classList.add("hidden");
};

document.getElementById("closeTime").onclick = function () {
  timePicker.classList.add("hidden");
};

timePicker.onclick = function (e) {
  if (e.target === timePicker) {
    timePicker.classList.add("hidden");
  }
};
/* ===== CUSTOM TET IMAGE ===== */


var horseImg = document.getElementById("tetHorse");
var horsePicker = document.getElementById("horsePicker");
var changeHorseBtn = document.getElementById("changeHorseBtn");
/* load ảnh đã lưu */

var savedHorse = localStorage.getItem("tetHorseImage");

if (savedHorse) {
  horseImg.src = savedHorse;
}
/* click nút → mở file picker */


changeHorseBtn.onclick = function () {
  horsePicker.click();
};
/* khi chọn ảnh */


horsePicker.onchange = function () {
  var file = horsePicker.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh");
    return;
  }

  var reader = new FileReader();

  reader.onload = function () {
    horseImg.src = reader.result;
    localStorage.setItem("tetHorseImage", reader.result);
  };

  reader.readAsDataURL(file);
}; // function resetHorse() {
//   horseImg.src = "horse.png";
//   localStorage.removeItem("tetHorseImage");
// }
//# sourceMappingURL=main.dev.js.map
