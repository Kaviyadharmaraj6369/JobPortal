const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadAppliedJobs();
});

// ===============================
// URL SAFETY HELPER
// ===============================
// Profile links saved without "http(s)://" would otherwise be
// treated as a path on this site (causing a whitelabel error
// page) instead of opening the external site.

function ensureUrl(link) {

    if (!link) return "";

    const trimmed = link.trim();

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    return "https://" + trimmed;

}

// ===============================
// LOAD APPLIED JOBS
// ===============================

async function loadAppliedJobs() {

    try {

        const res = await fetch(BASE_URL + "/apply/user/" + user.id);

        if (!res.ok) {
            throw new Error("Unable to load applied jobs");
        }

        const appliedJobs = await res.json();

        const container = document.getElementById("appliedJobs");

        if (!appliedJobs || appliedJobs.length === 0) {

            container.innerHTML = `

            <div class="no-data">

                <i class="fa-solid fa-file-circle-xmark"></i>

                <h2>No Applications Yet</h2>

                <p>You haven't applied for any jobs.</p>

            </div>

            `;

            return;
        }

        let html = "";

        for (const apply of appliedJobs) {

            const jobRes = await fetch(BASE_URL + "/jobs/" + apply.jobId);

            const job = await jobRes.json();

            let badge = "pending";

            if (apply.status === "APPROVED") {

                badge = "approved";

            }

            if (apply.status === "REJECTED") {

                badge = "rejected";

            }

            html += `

<div class="job-card">

<div class="status ${badge}">

${apply.status}

</div>

<div class="job-header">

<div class="company-logo">

<img src="${getCompanyLogoUrl(job.company)}" alt="Company">

</div>

<div>

<h3>${job.title}</h3>

<h4>${job.company}</h4>

</div>

</div>

<div class="job-details">

<p>

<i class="fa-solid fa-location-dot"></i>

${job.location}

</p>

<p>

<i class="fa-solid fa-code"></i>

${job.language}

</p>

<p>

<i class="fa-solid fa-user-graduate"></i>

${job.experience}

</p>

<p>

<i class="fa-solid fa-indian-rupee-sign"></i>

${job.salary || job.stipend || "N/A"}

</p>

<p>

<i class="fa-solid fa-calendar-days"></i>

Applied :

${new Date(apply.appliedDate).toLocaleDateString()}

</p>

</div>

<div class="applicant-details open" id="details-${apply.id}">

<h4 class="applicant-details-title">

<i class="fa-solid fa-user"></i>

Your Submitted Details

</h4>

<div class="applicant-grid">

<div><span>Full Name</span>${apply.fullName || "-"}</div>

<div><span>Email</span>${apply.email || "-"}</div>

<div><span>Phone</span>${apply.phone || "-"}</div>

<div><span>DOB</span>${apply.dob || "-"}</div>

<div><span>Qualification</span>${apply.qualification || "-"}</div>

<div><span>College</span>${apply.college || "-"}</div>

<div><span>Passing Year</span>${apply.passingYear || "-"}</div>

<div><span>Experience</span>${apply.experience || "-"}</div>

<div><span>Current Location</span>${apply.currentLocation || "-"}</div>

<div class="full-span"><span>Skills</span>${apply.skills || "-"}</div>

</div>

<div class="applicant-links">

${apply.linkedin ? `<a href="${ensureUrl(apply.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ""}

${apply.github ? `<a href="${ensureUrl(apply.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>` : ""}

${apply.portfolio ? `<a href="${ensureUrl(apply.portfolio)}" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i> Portfolio</a>` : ""}

${apply.leetcode ? `<a href="${ensureUrl(apply.leetcode)}" target="_blank" rel="noopener"><i class="fa-solid fa-code"></i> LeetCode</a>` : ""}

${apply.hackerrank ? `<a href="${ensureUrl(apply.hackerrank)}" target="_blank" rel="noopener"><i class="fa-solid fa-terminal"></i> HackerRank</a>` : ""}

${apply.resumePath ? `<a href="/uploads/${apply.resumePath}" target="_blank" rel="noopener"><i class="fa-solid fa-file-pdf"></i> Resume</a>` : ""}

</div>

</div>

`;

        }

        container.innerHTML = html;

    }

    catch (error) {

        console.log(error);

        document.getElementById("appliedJobs").innerHTML = `

<div class="error-box">

<h2>

Unable to load applied jobs

</h2>

</div>

`;

    }

}