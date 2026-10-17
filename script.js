// Измените дату начала здесь. +03:00 — часовой пояс события.
const targetDate = new Date("2027-06-12T18:00:00+03:00");

const content = document.querySelector(".content");
const countdown = document.querySelector(".countdown");
const arrival = document.querySelector(".arrival");
const announcement = document.querySelector("#announcement");
const video = document.querySelector("video");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const fields = ["days", "hours", "minutes", "seconds"].map(
  (id) => document.getElementById(id)
);

let intervalId;
let finished = false;

function finish() {
  if (finished) return;
  finished = true;
  clearInterval(intervalId);
  content.classList.add("is-finishing");
  countdown.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    content.classList.add("has-arrived");
    arrival.removeAttribute("aria-hidden");
    announcement.textContent = arrival.textContent;
  }, reducedMotion.matches ? 0 : 1000);
}

function updateCountdown() {
  const remaining = Math.max(0, Math.ceil((targetDate.getTime() - Date.now()) / 1000));
  const values = [
    Math.floor(remaining / 86400),
    Math.floor((remaining % 86400) / 3600),
    Math.floor((remaining % 3600) / 60),
    remaining % 60,
  ];

  fields.forEach((field, index) => {
    const value = String(values[index]).padStart(2, "0");
    if (field.textContent !== value) field.textContent = value;
  });

  if (remaining === 0) finish();
}

function syncVideo() {
  if (reducedMotion.matches) {
    video.pause();
  } else {
    video.muted = true;
    video.play().catch(() => {});
  }
}

if (Number.isNaN(targetDate.getTime())) {
  announcement.textContent = "Проверьте дату начала в script.js.";
  announcement.classList.remove("sr-only");
} else {
  countdown.hidden = false;
  updateCountdown();
  if (!finished) intervalId = window.setInterval(updateCountdown, 1000);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !finished && !Number.isNaN(targetDate.getTime())) {
    updateCountdown();
  }
});
reducedMotion.addEventListener("change", syncVideo);
syncVideo();
