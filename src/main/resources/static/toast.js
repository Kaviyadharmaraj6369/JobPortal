// ==========================================================
// SHARED TOAST NOTIFICATIONS + CUSTOM CONFIRM DIALOG
// Replaces ugly browser alert()/confirm() popups with a
// neat, on-page notification that matches the site design.
// Used by: jobs.js, applyjob.js, saved.js, apply.js
// ==========================================================

function ensureToastContainer() {

    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    return container;
}

// type: "success" | "error" | "info"
function showToast(message, type = "success", duration = 3000) {

    const container = ensureToastContainer();

    const icons = {
        success: "fa-circle-check",
        error: "fa-circle-exclamation",
        info: "fa-circle-info"
    };

    const toast = document.createElement("div");

    toast.className = "toast toast-" + type;

    toast.innerHTML =
        `<i class="fa-solid ${icons[type] || icons.info}"></i>` +
        `<span>${message}</span>`;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => toast.remove(), 300);

    }, duration);

}

// Returns a Promise<boolean> — resolves true if user confirms.
function showConfirm(message, title = "Please Confirm") {

    return new Promise((resolve) => {

        const overlay = document.createElement("div");

        overlay.className = "confirm-overlay";

        overlay.innerHTML = `
            <div class="confirm-box">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="confirm-actions">
                    <button class="confirm-cancel">Cancel</button>
                    <button class="confirm-ok">Yes, Continue</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add("show"));

        function close(result) {

            overlay.classList.remove("show");

            setTimeout(() => overlay.remove(), 200);

            resolve(result);

        }

        overlay.querySelector(".confirm-cancel").onclick = () => close(false);

        overlay.querySelector(".confirm-ok").onclick = () => close(true);

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) close(false);
        });

    });

}