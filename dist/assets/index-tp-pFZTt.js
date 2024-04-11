(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
  new MutationObserver((o) => {
    for (const i of o)
      if (i.type === "childList")
        for (const c of i.addedNodes)
          c.tagName === "LINK" && c.rel === "modulepreload" && s(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(o) {
    const i = {};
    return (
      o.integrity && (i.integrity = o.integrity),
      o.referrerPolicy && (i.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : o.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function s(o) {
    if (o.ep) return;
    o.ep = !0;
    const i = t(o);
    fetch(o.href, i);
  }
})();
const r = document.getElementById("guest-name"),
  u = document.getElementById("guest-list"),
  p = document.getElementById("submit-button"),
  y = document.getElementById("allDay"),
  m = document.getElementById("evening"),
  g = document.getElementById("ceremony");
y.style.display = "none";
m.style.display = "none";
g.style.display = "none";
let a = [];
fetch("guests.json")
  .then((n) => n.json())
  .then((n) => {
    a = n.allDay.concat(n.evening, n.ceremony);
  })
  .catch((n) => {
    console.error("Error fetching guest list data:", n);
  });
let l = 0;
r.addEventListener("keyup", function (n) {
  const e = this.value.toLowerCase(),
    t = a.filter((s) => s.name.toLowerCase().includes(e));
  if (((u.innerHTML = ""), e.length >= 3 && t.length > 0)) {
    const s = document.createElement("ul");
    s.classList.add("guest-list"),
      t.forEach((o) => {
        const i = document.createElement("li");
        (i.textContent = o.name),
          i.addEventListener("click", function () {
            (r.value = this.textContent), f();
          }),
          s.appendChild(i);
      }),
      u.appendChild(s);
  } else u.textContent = e.length < 3 ? "Type at least 3 characters" : "No matches found.";
});
r.addEventListener("keydown", function (n) {
  const e = n.keyCode,
    t = document.getElementById("suggestions");
  if (t) {
    if (e === 40) l++, d(l);
    else if (e === 38) l--, d(l);
    else if (e === 13) {
      const s = t.querySelector("li.active");
      s && ((r.value = s.textContent), (l = 0), f());
    }
  }
});
function d(n) {
  const t = document.getElementById("suggestions").querySelectorAll("li");
  t && (v(t), n >= 0 && n < t.length && t[n].classList.add("active"));
}
function v(n) {
  n.forEach((e) => e.classList.remove("active"));
}
function f() {
  const n = document.getElementById("suggestions");
  n && n.parentNode.removeChild(n);
}
class h {
  constructor(e) {
    this.allGuests = e;
  }
  verifyGuest(e) {
    const t = this.allGuests.find(
      (s) => s.name.toLowerCase() === e.toLowerCase()
    );
    return console.log("Found Guest:", t), !!t;
  }
  getGuestType(e) {
    const t = this.allGuests.find(
      (s) => s.name.toLowerCase() === e.toLowerCase()
    );
    return t == null ? void 0 : t.type;
  }
  getCeremonyAndEveningGuestType(e) {
    const t = this.allGuests.find(
      (s) => s.name.toLowerCase() === e.toLowerCase()
    );
    return (t == null ? void 0 : t.type) || "Ceremony & Evening";
  }
  getCeremonyGuestType(e) {
    const t = this.allGuests.find(
      (s) => s.name.toLowerCase() === e.toLowerCase()
    );
    return (t == null ? void 0 : t.type) || "Ceremony";
  }
  showGuestInfo(e) {
    const t = document.getElementById("rsvp");
    (t.style.display = "none"), this.hideAllGuestTypeDivs();
    const s = e == null ? void 0 : e.toLowerCase();
    s === "ceremony"
      ? (g.style.display = "block")
      : s === "evening"
      ? (m.style.display = "block")
      : s === "all day"
      ? (y.style.display = "block")
      : console.error("Guest data has invalid type:", e);
  }
  hideAllGuestTypeDivs() {
    const e = document.getElementById("allDay"),
      t = document.getElementById("evening"),
      s = document.getElementById("ceremony");
    (e.style.display = "none"),
      (t.style.display = "none"),
      (s.style.display = "none");
  }
}
p.addEventListener("click", function () {
  const n = r.value.trim();
  if (!n) {
    alert("Please enter your name.");
    return;
  }
  const e = new h(a);
  if (e.verifyGuest(n)) {
    const t = e.getGuestType(n);
    e.showGuestInfo(t);
  } else alert("Sorry, guest not found.");
});
