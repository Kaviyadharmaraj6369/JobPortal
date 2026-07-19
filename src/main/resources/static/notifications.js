// ==========================================================
// NOTIFICATIONS
// Adds a bell icon to the navbar (for logged-in users) that
// shows when an application's status has changed to APPROVED
// or REJECTED since the user last checked. Include this file
// on any page that has the standard navbar + a logged-in user.
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    injectNotificationBell();

    loadNotifications(user.id);

});

function injectNotificationBell() {

    if (document.getElementById("notifBell")) return;

    const nav = document.querySelector(".navbar nav");

    if (!nav) return;

    const wrapper = document.createElement("div");
    wrapper.className = "notif-wrapper";

    wrapper.innerHTML = `
        <button id="notifBell" class="notif-bell" onclick="toggleNotifDropdown()">
            <i class="fa-solid fa-bell"></i>
            <span id="notifBadge" class="notif-badge" style="display:none;">0</span>
        </button>
        <div id="notifDropdown" class="notif-dropdown">
            <div class="notif-dropdown-header">Notifications</div>
            <div id="notifList" class="notif-list">
                <p class="notif-empty">No new updates.</p>
            </div>
        </div>
    `;

    // Insert the bell right before the Logout link if present,
    // otherwise just append it to the nav.
    const logoutLink = document.getElementById("logoutLink");

    if (logoutLink) {
        nav.insertBefore(wrapper, logoutLink);
    } else {
        nav.appendChild(wrapper);
    }

    document.addEventListener("click", (e) => {

        const dropdown = document.getElementById("notifDropdown");
        const bell = document.getElementById("notifBell");

        if (dropdown && !dropdown.contains(e.target) && e.target !== bell && !bell.contains(e.target)) {
            dropdown.classList.remove("show");
        }

    });

}

function toggleNotifDropdown() {

    document.getElementById("notifDropdown").classList.toggle("show");

}

async function loadNotifications(userId) {

    try {

        const res = await fetch(BASE_URL + "/apply/user/" + userId);

        const appliedJobs = await res.json();

        const seenKey = "notif_seen_" + userId;

        const seen = JSON.parse(localStorage.getItem(seenKey) || "{}");

        // A "notification" is any decided (non-pending) application
        // whose status the user hasn't acknowledged in this browser yet.
        const decided = appliedJobs.filter(a =>
            a.status === "APPROVED" || a.status === "REJECTED");

        const unseen = decided.filter(a => seen[a.id] !== a.status);

        const badge = document.getElementById("notifBadge");

        if (unseen.length > 0) {
            badge.style.display = "inline-flex";
            badge.innerText = unseen.length;
        } else {
            badge.style.display = "none";
        }

        const list = document.getElementById("notifList");

        if (decided.length === 0) {

            list.innerHTML = `<p class="notif-empty">No updates yet. You'll see application status changes here.</p>`;
            return;

        }

        // Most recent first, fetch job titles for context.
        const withJobs = await Promise.all(decided.map(async a => {

            try {
                const jobRes = await fetch(BASE_URL + "/jobs/" + a.jobId);
                const job = jobRes.ok ? await jobRes.json() : null;
                return { ...a, jobTitle: job ? job.title : "a job", company: job ? job.company : "" };
            } catch {
                return { ...a, jobTitle: "a job", company: "" };
            }

        }));

        withJobs.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

        list.innerHTML = withJobs.map(a => {

            const isApproved = a.status === "APPROVED";

            return `
                <div class="notif-item ${seen[a.id] !== a.status ? 'unread' : ''}" onclick="markNotifSeen(${a.id}, '${a.status}', ${userId})">
                    <i class="fa-solid ${isApproved ? 'fa-circle-check' : 'fa-circle-xmark'} ${isApproved ? 'approved' : 'rejected'}"></i>
                    <div>
                        <p><strong>${a.jobTitle}</strong> at ${a.company}</p>
                        <span>Your application was ${a.status.toLowerCase()}</span>
                    </div>
                </div>
            `;

        }).join("");

    } catch (error) {

        console.log(error);

    }

}

function markNotifSeen(applicationId, status, userId) {

    const seenKey = "notif_seen_" + userId;

    const seen = JSON.parse(localStorage.getItem(seenKey) || "{}");

    seen[applicationId] = status;

    localStorage.setItem(seenKey, JSON.stringify(seen));

    loadNotifications(userId);

}