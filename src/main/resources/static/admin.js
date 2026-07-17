// ==========================================================
// ADMIN DASHBOARD
// Loads stats, registered users, and every job application
// (from every user) so the developer can see who applied,
// to which job, and when.
// ==========================================================

// Client-side-only gate — keeps casual visitors out during
// local/dev use. NOT real security; don't rely on this alone
// if this app is ever deployed publicly.
const ADMIN_PASSWORD = "Kavi@1929";

let allApplications = [];
let jobCache = {};
let usersByEmail = {};

document.addEventListener("DOMContentLoaded", () => {

    if (sessionStorage.getItem("adminUnlocked") === "true") {

        unlockAdmin();

    }

});

function togglePassword(inputId, iconId) {

    const input = document.getElementById(inputId);

    const icon = document.getElementById(iconId);

    if (input.type === "password") {

        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    } else {

        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}

function checkAdminPassword() {

    const entered = document.getElementById("adminPassword").value;

    const errorBox = document.getElementById("adminGateError");

    if (entered === ADMIN_PASSWORD) {

        sessionStorage.setItem("adminUnlocked", "true");

        unlockAdmin();

    } else {

        errorBox.innerText = "Incorrect password. Try again.";

    }

}

function unlockAdmin() {

    document.getElementById("adminGate").style.display = "none";

    document.getElementById("adminContent").style.display = "block";

    loadStats();

    loadUsers();

    loadApplications();

}

function adminLogout() {

    sessionStorage.removeItem("adminUnlocked");

    window.location.reload();

}

// ===============================
// STATS
// ===============================

async function loadStats() {

    try {

        const res = await fetch(BASE_URL + "/admin/stats");

        const stats = await res.json();

        document.getElementById("statUsers").innerText = stats.totalUsers;

        document.getElementById("statApplications").innerText = stats.totalApplications;

        document.getElementById("statJobs").innerText = stats.totalJobs;

        document.getElementById("statCompanies").innerText = stats.totalCompanies;

    } catch (error) {

        console.log(error);

    }

}

// ===============================
// USERS
// ===============================

async function loadUsers() {

    try {

        const res = await fetch(BASE_URL + "/admin/users");

        const users = await res.json();

        const body = document.getElementById("usersBody");

        if (!users.length) {

            body.innerHTML = `<tr><td colspan="4" class="admin-empty">No registered users yet.</td></tr>`;

            return;

        }

        body.innerHTML = users.map(u => `

            <tr>
                <td>${u.id}</td>
                <td>${u.name || "-"}</td>
                <td>${u.email || "-"}</td>
                <td><span class="role-badge">${u.role || "USER"}</span></td>
            </tr>

        `).join("");

        // Build a quick lookup so the applications table can show
        // whether each applicant is a currently registered user.
        usersByEmail = {};

        users.forEach(u => {

            if (u.email) {

                usersByEmail[u.email.toLowerCase()] = u;

            }

        });

    } catch (error) {

        console.log(error);

    }

}

// ===============================
// APPLICATIONS
// ===============================

async function loadApplications() {

    try {

        const res = await fetch(BASE_URL + "/apply/all");

        allApplications = await res.json();

        // Pre-fetch job details for every unique jobId referenced,
        // so we can show job title + company without N calls per row.
        const uniqueJobIds = [...new Set(allApplications.map(a => a.jobId))];

        await Promise.all(uniqueJobIds.map(async (id) => {

            try {

                const jobRes = await fetch(BASE_URL + "/jobs/" + id);

                if (jobRes.ok) {

                    jobCache[id] = await jobRes.json();

                }

            } catch (e) {

                // Job may have been removed — skip silently.

            }

        }));

        renderApplications(allApplications);

    } catch (error) {

        console.log(error);

        document.getElementById("appsBody").innerHTML =
            `<tr><td colspan="6" class="admin-empty">Unable to load applications.</td></tr>`;

    }

}

function renderApplications(list) {

    const body = document.getElementById("appsBody");

    if (!list.length) {

        body.innerHTML = `<tr><td colspan="6" class="admin-empty">No applications yet.</td></tr>`;

        return;

    }

    // Most recent first.
    const sorted = [...list].sort((a, b) =>
        new Date(b.appliedDate) - new Date(a.appliedDate));

    body.innerHTML = sorted.map(a => {

        const job = jobCache[a.jobId];

        const title = job ? job.title : "(job removed)";

        const company = job ? job.company : "-";

        let badgeClass = "pending";

        if (a.status === "APPROVED") badgeClass = "approved";

        if (a.status === "REJECTED") badgeClass = "rejected";

        const isRegistered = a.email && usersByEmail[a.email.toLowerCase()];

        const regBadge = isRegistered
            ? `<span class="reg-status registered"><i class="fa-solid fa-circle-check"></i> Registered</span>`
            : `<span class="reg-status not-found">Not Found</span>`;

        return `

            <tr>
                <td>${a.fullName || "-"}<br>${regBadge}</td>
                <td>${a.email || "-"}<br><span class="admin-muted">${a.phone || ""}</span></td>
                <td>${title}</td>
                <td>${company}</td>
                <td>${a.appliedDate ? new Date(a.appliedDate).toLocaleString() : "-"}</td>
                <td><span class="status ${badgeClass}" style="position:static;display:inline-block;">${a.status || "PENDING"}</span></td>
                <td>
                    <div class="admin-action-btns">
                        <button class="admin-action-btn approve" onclick="updateApplicationStatus(${a.id}, 'APPROVED')" title="Approve"><i class="fa-solid fa-check"></i></button>
                        <button class="admin-action-btn reject" onclick="updateApplicationStatus(${a.id}, 'REJECTED')" title="Reject"><i class="fa-solid fa-xmark"></i></button>
                        <button class="admin-action-btn pending" onclick="updateApplicationStatus(${a.id}, 'PENDING')" title="Reset to Pending"><i class="fa-solid fa-rotate-left"></i></button>
                    </div>
                </td>
            </tr>

        `;

    }).join("");

}

// ===============================
// APPROVE / REJECT
// ===============================

async function updateApplicationStatus(id, status) {

    try {

        const res = await fetch(BASE_URL + "/apply/" + id + "/" + status, {
            method: "PUT"
        });

        if (res.ok) {

            const updated = await res.json();

            // Update the in-memory copy so the table refreshes
            // without a full reload.
            const idx = allApplications.findIndex(a => a.id === id);

            if (idx !== -1) {
                allApplications[idx].status = updated.status;
            }

            if (typeof showToast === "function") {
                showToast("Application marked as " + status, "success");
            }

            filterApplications();

        } else {

            if (typeof showToast === "function") {
                showToast("Unable to update status", "error");
            }

        }

    } catch (error) {

        console.log(error);

    }

}

// ===============================
// SEARCH / FILTER
// ===============================

function filterApplications() {

    const key = document.getElementById("adminSearch").value.trim().toLowerCase();

    if (!key) {

        renderApplications(allApplications);

        return;

    }

    const filtered = allApplications.filter(a => {

        const job = jobCache[a.jobId];

        const haystack = [
            a.fullName, a.email, a.phone,
            job ? job.title : "", job ? job.company : ""
        ].join(" ").toLowerCase();

        return haystack.includes(key);

    });

    renderApplications(filtered);

}