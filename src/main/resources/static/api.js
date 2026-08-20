const BASE_URL = "http://localhost:8081/api";

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}



document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navbar nav a").forEach(link => {

        const linkPage = (link.getAttribute("href") || "").split("/").pop();

        if (linkPage === currentPage) {

            link.classList.add("nav-active");

        }

    });

});