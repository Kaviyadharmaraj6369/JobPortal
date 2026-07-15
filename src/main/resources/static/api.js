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

});