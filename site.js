(function () {
  var root = document.documentElement;
  var KEY = "theme";
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
  }

  root.classList.add("js");
  apply(stored() || (media.matches ? "dark" : "light"));

  media.addEventListener("change", function (e) {
    if (!stored()) apply(e.matches ? "dark" : "light");
  });

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".main-nav");
    if (nav) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-toggle";
      btn.setAttribute("aria-label", "Zwischen hellem und dunklem Design wechseln");
      btn.innerHTML =
        '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
        '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
      btn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (e) { /* Speicher gesperrt */ }
      });
      nav.appendChild(btn);
    }

    var dropdown = document.querySelector("details.dropdown");
    if (dropdown) {
      document.addEventListener("click", function (e) {
        if (!dropdown.contains(e.target)) dropdown.removeAttribute("open");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && dropdown.hasAttribute("open")) {
          dropdown.removeAttribute("open");
          dropdown.querySelector("summary").focus();
        }
      });
    }

    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  });
})();
