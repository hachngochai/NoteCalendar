/* ===== DOM ===== */
const calendarDays = document.getElementById("calendar-days");
const dayName = document.getElementById("day-name");
const monthYear = document.getElementById("month-year");

const eventTitle = document.getElementById("eventTitle");
const eventTime = document.getElementById("eventTime");
const eventLocation = document.getElementById("eventLocation");
const eventNote = document.getElementById("eventNote");
const eventDateText = document.getElementById("eventDateText");

const resetBtn = document.getElementById("resetModeBtn");
const resetModal = document.getElementById("resetModal");
const confirmReset = document.getElementById("confirmReset");
const cancelReset = document.getElementById("cancelReset");

/* ===== TIME ===== */
const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selectedDateKey = null;

/* ===== RESET MODE ===== */
let resetMode = false;

/* ===== DATA ===== */
const weekDaysVN = [
  "Chủ Nhật","Thứ Hai","Thứ Ba",
  "Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"
];

const monthsVN = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4",
  "Tháng 5","Tháng 6","Tháng 7","Tháng 8",
  "Tháng 9","Tháng 10","Tháng 11","Tháng 12"
];

let events = JSON.parse(localStorage.getItem("tetEvents")) || {};

/* ===== RENDER CALENDAR ===== */
function renderCalendar(month, year) {
  calendarDays.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${monthsVN[month]} năm ${year}`;
  dayName.textContent = `${weekDaysVN[today.getDay()]}, ngày ${today.getDate()}`;

  let startIndex = firstDay === 0 ? 6 : firstDay - 1;
  let row = document.createElement("div");

  for (let i = 0; i < startIndex; i++) {
    row.appendChild(document.createElement("span"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    if (row.children.length === 7) {
      calendarDays.appendChild(row);
      row = document.createElement("div");
    }

    const span = document.createElement("span");
    span.textContent = d;

    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) span.classList.add("active");

    const dateKey = `${year}-${month + 1}-${d}`;
    if (events[dateKey]) span.classList.add("event");

    span.onclick = () => {
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
  }

  while (row.children.length < 7) {
    row.appendChild(document.createElement("span"));
  }

  calendarDays.appendChild(row);
}

/* ===== OPEN FORM ===== */
function openEventForm(year, month, day) {
  selectedDateKey = `${year}-${month + 1}-${day}`;

  const dateObj = new Date(year, month, day);
  eventDateText.textContent =
    `${day}/${month + 1}/${year} (${weekDaysVN[dateObj.getDay()]})`;

  const data = events[selectedDateKey] || {};

  eventTitle.value = data.title || "";
  eventTime.value = data.time || "";
  eventLocation.value = data.location || "";
  eventNote.value = data.note || "";

  document.querySelector(".calendar").classList.add("flip");
}

/* ===== SAVE EVENT ===== */
document.getElementById("saveEvent").onclick = () => {
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
document.getElementById("cancelEvent").onclick = () => {
  document.querySelector(".calendar").classList.remove("flip");
};

/* ===== RESET BUTTON ===== */
resetBtn.onclick = () => {
  resetModal.classList.remove("hidden");
};

confirmReset.onclick = () => {
  resetMode = true;
  resetModal.classList.add("hidden");
};

cancelReset.onclick = () => {
  resetMode = false;
  resetModal.classList.add("hidden");
};


/* ===== NAVIGATION ===== */
function animateCalendar(direction) {
  calendarDays.classList.remove("slide-left", "slide-right");

  // force reflow để reset animation
  void calendarDays.offsetWidth;

  calendarDays.classList.add(
    direction === "next" ? "slide-left" : "slide-right"
  );
}

document.getElementById("prev").onclick = () => {
  animateCalendar("prev");

  setTimeout(() => {
    viewMonth--;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    renderCalendar(viewMonth, viewYear);
  }, 220); // ⏱ đúng với CSS animation
};


document.getElementById("next").onclick = () => {
  animateCalendar("next");

  setTimeout(() => {
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
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let W, H;
function resizeFireworks() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFireworks);
resizeFireworks();

const GRAVITY = 0.06;
const FIREWORK_Y = H * 0.32;

let fireworks = [];
let particles = [];

class Firework {
  constructor(x) {
    this.x = x;
    this.y = H;
    this.vy = -(7 + Math.random() * 3);
    this.color = randomColor();
    this.exploded = false;
  }

  update() {
    this.y += this.vy;
    if (this.y <= FIREWORK_Y) {
      this.explode();
      this.exploded = true;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 2, 12);
  }

  explode() {
    const count = 60 + Math.random() * 40;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;

    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.size = Math.random() * 2 + 1;
    this.color = color;
  }

  update() {
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.015;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function randomColor() {
  const colors = [
    "#FFD700",
    "#FF3D00",
    "#FF9100",
    "#F50057",
    "#00E5FF",
    "#76FF03",
    "#FFEA00"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function animateFireworks() {
  ctx.clearRect(0, 0, W, H);

  fireworks = fireworks.filter(fw => !fw.exploded);
  particles = particles.filter(p => p.alpha > 0);

  fireworks.forEach(fw => {
    fw.update();
    fw.draw();
  });

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateFireworks);
}
animateFireworks();

/* ===== AUTO FIRE – LỆCH PHẢI ===== */
setInterval(() => {
  const baseX = W * 0.78;
  const spread = 140;
  fireworks.push(
    new Firework(baseX + (Math.random() * spread - spread / 2))
  );
}, 1500);



/* ================= THEME SYSTEM (STEP 1) ================= */
const themeModal = document.getElementById("themeModal");
const openTheme = document.getElementById("openTheme");
const closeTheme = document.getElementById("closeTheme");
const applyThemeBtn = document.getElementById("applyTheme");

const bgInput = document.getElementById("theme-bg");
const textInput = document.getElementById("theme-text");
const accentInput = document.getElementById("theme-accent");

/* open / close */
openTheme.onclick = () => themeModal.classList.remove("hidden");
closeTheme.onclick = () => themeModal.classList.add("hidden");

/* apply */
applyThemeBtn.onclick = () => {
  const theme = {
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
  if (theme.bg)
    document.documentElement.style.setProperty("--calendar-bg", theme.bg);
  if (theme.text)
    document.documentElement.style.setProperty("--calendar-text", theme.text);
  if (theme.accent)
    document.documentElement.style.setProperty("--calendar-accent", theme.accent);
}

/* load saved theme */
const savedTheme = JSON.parse(localStorage.getItem("calendarTheme"));
if (savedTheme) setTheme(savedTheme);

const resetThemeBtn = document.getElementById("resetTheme");
const DEFAULT_THEME = {
  bg: "#a12424",
  text: "#fff8e1",
  accent: "#ffd54f"
};

resetThemeBtn.onclick = () => {
  // reset CSS variables
  setTheme(DEFAULT_THEME);

  // xoá theme custom đã lưu
  localStorage.removeItem("calendarTheme");

  // set lại color picker cho đúng màu mặc định
  bgInput.value = DEFAULT_THEME.bg;
  textInput.value = DEFAULT_THEME.text;
  accentInput.value = DEFAULT_THEME.accent;
};

const timePicker = document.getElementById("timePicker");
const pickMonth = document.getElementById("pickMonth");
const pickYear = document.getElementById("pickYear");

monthYear.style.cursor = "pointer";

monthYear.onclick = () => {
  openTimePicker();
};

function openTimePicker() {
  pickMonth.innerHTML = "";
  pickYear.innerHTML = "";

  // tháng
  monthsVN.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = m;
    if (i === viewMonth) opt.selected = true;
    pickMonth.appendChild(opt);
  });

  // năm (±20 năm)
  const currentYear = today.getFullYear();
  for (let y = currentYear - 20; y <= currentYear + 20; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    if (y === viewYear) opt.selected = true;
    pickYear.appendChild(opt);
  }

  timePicker.classList.remove("hidden");
}

function goToDate(year, month) {
  viewYear = year;
  viewMonth = month;

  // animation chuyển cảnh theo hướng "nhảy"
  animateCalendar("next");

  renderCalendar(viewMonth, viewYear);
}

document.getElementById("goTime").onclick = () => {
  const y = parseInt(document.getElementById("pickYear").value);
  const m = parseInt(document.getElementById("pickMonth").value);

  if (isNaN(y) || isNaN(m)) return;

  const cal = document.querySelector(".calendar");

  // reset animation nếu spam click
  cal.classList.remove("year-jump");
  void cal.offsetWidth; // force reflow

  // thêm hiệu ứng rung + ripple
  cal.classList.add("year-jump");

  // delay nhẹ cho cảm giác "nhảy năm"
  setTimeout(() => {
    goToDate(y, m); // JS month bắt đầu từ 0
  }, 180);

  document.getElementById("timeModal").classList.add("hidden");
};

document.getElementById("closeTime").onclick = () => {
  timePicker.classList.add("hidden");
};

timePicker.onclick = (e) => {
  if (e.target === timePicker) {
    timePicker.classList.add("hidden");
  }
};

/* ===== CUSTOM TET IMAGE ===== */
const horseImg = document.getElementById("tetHorse");
const horsePicker = document.getElementById("horsePicker");
const changeHorseBtn = document.getElementById("changeHorseBtn");

/* load ảnh đã lưu */
const savedHorse = localStorage.getItem("tetHorseImage");
if (savedHorse) {
  horseImg.src = savedHorse;
}

/* click nút → mở file picker */
changeHorseBtn.onclick = () => {
  horsePicker.click();
};

/* khi chọn ảnh */
horsePicker.onchange = () => {
  const file = horsePicker.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    horseImg.src = reader.result;
    localStorage.setItem("tetHorseImage", reader.result);
  };
  reader.readAsDataURL(file);
};

// function resetHorse() {
//   horseImg.src = "horse.png";
//   localStorage.removeItem("tetHorseImage");
// }

