const BASE_URL = "http://localhost:8081/api";

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// ==========================================================
// NAVBAR ACTIVE LINK
// Highlights whichever nav link matches the current page, on
// every page that includes this file — small detail, but it's
// what makes the nav feel like a real product instead of a
// set of disconnected static pages.
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navbar nav a").forEach(link => {

        const linkPage = (link.getAttribute("href") || "").split("/").pop();

        if (linkPage === currentPage) {

            link.classList.add("nav-active");

        }

    });

    applySavedTheme();

    injectThemeToggle();

});

// ==========================================================
// DARK MODE
// Applies the saved theme on load and injects a sun/moon
// toggle button into the navbar of any page that includes
// this file. Preference persists across the whole site via
// localStorage.
// ==========================================================

function applySavedTheme(){

    const saved = localStorage.getItem("theme");

    if(saved === "dark"){

        document.documentElement.setAttribute("data-theme", "dark");

    }

}

function injectThemeToggle(){

    if(document.getElementById("themeToggleBtn")) return;

    const nav = document.querySelector(".navbar nav");

    if(!nav) return;

    const btn = document.createElement("button");

    btn.id = "themeToggleBtn";
    btn.className = "theme-toggle-btn";
    btn.title = "Toggle dark mode";
    btn.onclick = toggleTheme;

    updateThemeIcon(btn);

    nav.insertBefore(btn, nav.firstChild);

}

function toggleTheme(){

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    if(isDark){

        document.documentElement.removeAttribute("data-theme");

        localStorage.setItem("theme", "light");

    } else {

        document.documentElement.setAttribute("data-theme", "dark");

        localStorage.setItem("theme", "dark");

    }

    updateThemeIcon(document.getElementById("themeToggleBtn"));

}

function updateThemeIcon(btn){

    if(!btn) return;

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    btn.innerHTML = isDark
        ? `<i class="fa-solid fa-sun"></i>`
        : `<i class="fa-solid fa-moon"></i>`;

}