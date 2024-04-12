(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n);
  new MutationObserver((n) => {
    for (const i of n)
      if (i.type === "childList")
        for (const l of i.addedNodes)
          l.tagName === "LINK" && l.rel === "modulepreload" && s(l);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(n) {
    const i = {};
    return (
      n.integrity && (i.integrity = n.integrity),
      n.referrerPolicy && (i.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : n.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function s(n) {
    if (n.ep) return;
    n.ep = !0;
    const i = t(n);
    fetch(n.href, i);
  }
})();
class p {
  constructor(e) {
    this.allGuests = e;
  }
  findChildrenForGuest(e) {
    var s;
    const t = this.allGuests.find(
      (n) => n.name.toLowerCase() === e.toLowerCase()
    );
    return t
      ? (((s = t.children) == null ? void 0 : s.split(" & ")) || []).map((i) =>
          i.trim()
        )
      : [];
  }
  showGuestChildrenInfo(e, t) {
    const s = this.findChildrenForGuest(e),
      n = document.getElementById(t);
    n
      ? s.length > 0
        ? ((n.textContent = ` ${s.join(", ")}`), (n.style.display = "block"))
        : ((n.textContent =
            "This guest does not have any children registered."),
          (n.style.display = "block"))
      : console.error(`Target element with ID "${t}" not found.`);
  }
}
const r = document.getElementById("guest-name"),
  d = document.getElementById("guest-list"),
  v = document.getElementById("submit-button"),
  y = document.getElementById("allDay"),
  m = document.getElementById("evening"),
  g = document.getElementById("ceremony"),
  C = document.getElementById("children-checklist");
y.style.display = "none";
m.style.display = "none";
g.style.display = "none";
C.style.display = "none";
let u = [];
fetch("guests.json")
  .then((o) => o.json())
  .then((o) => {
    u = o.allDay.concat(o.evening, o.ceremony);
  })
  .catch((o) => {
    console.error("Error fetching guest list data:", o);
  });
let c = 0;
r.addEventListener("keyup", function (o) {
  const e = this.value.toLowerCase(),
    t = u.filter((s) => s.name.toLowerCase().includes(e));
  if (((d.innerHTML = ""), e.length >= 3 && t.length > 0)) {
    const s = document.createElement("ul");
    s.classList.add("guest-list"),
      t.forEach((n) => {
        const i = document.createElement("li");
        (i.textContent = n.name),
          i.addEventListener("click", function () {
            (r.value = this.textContent), h();
          }),
          s.appendChild(i);
      }),
      d.appendChild(s);
  } else d.textContent = e.length < 3 ? "Type at least 3 characters" : "No matches found.";
});
r.addEventListener("keydown", function (o) {
  const e = o.keyCode,
    t = document.getElementById("suggestions");
  if (t) {
    if (e === 40) c++, a(c);
    else if (e === 38) c--, a(c);
    else if (e === 13) {
      const s = t.querySelector("li.active");
      s && ((r.value = s.textContent), (c = 0), h());
    }
  }
});
function a(o) {
  const t = document.getElementById("suggestions").querySelectorAll("li");
  t && (L(t), o >= 0 && o < t.length && t[o].classList.add("active"));
}
function L(o) {
  o.forEach((e) => e.classList.remove("active"));
}
function h() {
  const o = document.getElementById("suggestions");
  o && o.parentNode.removeChild(o);
}
class E {
  constructor(e) {
    (this.allGuests = e), (this.findChildren = new p(e));
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
    const n = r.value.trim();
    if (this.allGuests.find((l) => l.name.toLowerCase() === n.toLowerCase())) {
      const l = this.findChildren.findChildrenForGuest(n),
        f = document.getElementById("children-checklist");
      (f.style.display = l.length > 0 ? "block" : "none"),
        this.findChildren.showGuestChildrenInfo(n, "children-names");
    }
  }
  hideAllGuestTypeDivs() {
    const e = document.getElementById("allDay"),
      t = document.getElementById("evening"),
      s = document.getElementById("ceremony");
    (e.style.display = "none"),
      (t.style.display = "none"),
      (s.style.display = "none");
    const n = document.getElementById("children-checklist");
    n.style.display = "none";
  }
}
v.addEventListener("click", function () {
  const o = r.value.trim();
  if (!o) {
    alert("Please enter your name.");
    return;
  }
  const e = new E(u);
  if (e.verifyGuest(o)) {
    const t = e.getGuestType(o);
    e.showGuestInfo(t);
  } else alert("Sorry, guest not found.");
});
