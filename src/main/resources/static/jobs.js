const API = BASE_URL + "/jobs";

// Company logo lookup (companyLogos map + getCompanyLogoUrl)
// now lives in the shared company-logo.js file.

// Holds the currently loaded set of jobs (all jobs, or search
// results) so the Full-Time / Internship filter tabs and the
// "View Jobs" company button can filter without extra fetches.
let allJobs = [];

// Pagination — showing all 1000+ jobs at once is slow and
// overwhelming, so we render in pages like a real job portal.
let currentPageJobs = [];
let jobsPerPage = 12;
let jobsShown = 0;

// Tracks which company's "View Jobs" was clicked, if any — used
// to show a friendlier empty-state message instead of a generic
// "No Jobs Found" when a specific company has nothing open.
let lastViewedCompany = null;

// ===============================
// LOAD PAGE
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadJobs();

    loadCompanies();

    checkNavbar();

});

// ===============================
// NAVBAR
// ===============================

function checkNavbar(){

    const user = JSON.parse(localStorage.getItem("user"));

    if(user){

        const login = document.getElementById("loginLink");

        const register = document.getElementById("registerLink");

        const logout = document.getElementById("logoutLink");

        if(login) login.style.display="none";

        if(register) register.style.display="none";

        if(logout) logout.style.display="inline-block";

    }

}

// ===============================
// LOAD JOBS
// ===============================

async function loadJobs(){

    lastViewedCompany = null;

    const jobsContainer = document.getElementById("jobs");

    if(jobsContainer){

        jobsContainer.innerHTML =
            `<div class="loading-state">
                <div class="spinner"></div>
                <p>Loading jobs...</p>
            </div>`;

    }

    try{

        const res = await fetch(API);

        if(!res.ok){

            throw new Error("Unable To Load Jobs");

        }

        const jobs = await res.json();

        allJobs = jobs;

        if(jobs.length===0){

            document.getElementById("jobs").innerHTML =

                "<h2 style='text-align:center'>No Jobs Available</h2>";

            return;

        }

        showJobs(jobs);

        updateDashboard(jobs);

        markAlreadySavedJobs();

        markAlreadyAppliedJobs();

    }

    catch(error){

        console.log(error);

    }

}

// Marks Save buttons as "Saved" for jobs this user already
// saved in a previous session, so the button state is honest
// right from page load instead of only after a fresh click.
async function markAlreadySavedJobs(){

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user) return;

    try{

        const res = await fetch(BASE_URL + "/save/user/" + user.id);

        const savedJobs = await res.json();

        savedJobs.forEach(sj => {

            const btn = document.getElementById("save-btn-" + sj.jobId);

            if(btn) markSaved(btn);

        });

    }
    catch(error){

        console.log(error);

    }

}
// Marks Apply buttons as "Already Applied" (red) for jobs this
// user has already applied to, so it's obvious before they even
// click — matching how the Save button shows "Saved".
async function markAlreadyAppliedJobs(){

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user) return;

    try{

        const res = await fetch(BASE_URL + "/apply/user/" + user.id);

        const appliedJobs = await res.json();

        appliedJobs.forEach(a => {

            const btn = document.getElementById("apply-btn-" + a.jobId);

            if(btn) markApplied(btn);

        });

    }
    catch(error){

        console.log(error);

    }

}

// Switches an Apply button into a permanent red "Already Applied" state.
function markApplied(btn){

    if(!btn) return;

    btn.classList.add("already-applied");

    btn.disabled = true;

    btn.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Already Applied`;

}

// =======================================
// SHOW JOBS
// =======================================

function showJobs(jobs){

    currentPageJobs = jobs || [];

    jobsShown = 0;

    renderJobPage();

}

function renderJobPage(){

    const jobs = currentPageJobs;

    if(!jobs || jobs.length===0){

        document.getElementById("jobs").innerHTML =

            `<div class="no-data">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h2>${lastViewedCompany ? "No Openings Right Now" : "No Jobs Found"}</h2>
                <p>${lastViewedCompany
                ? `${lastViewedCompany} doesn't have any open positions at the moment. Check back soon, or explore other companies below.`
                : "Try a different filter or search term."}</p>
            </div>`;

        const wrap = document.getElementById("loadMoreWrap");
        if(wrap) wrap.innerHTML = "";

        return;

    }

    const nextBatch = jobs.slice(jobsShown, jobsShown + jobsPerPage);

    let html = jobsShown === 0 ? "" : document.getElementById("jobs").innerHTML;

    nextBatch.forEach(job=>{

        const logo =
            getCompanyLogoUrl(job.company);

        html += `

<div class="job-card">
${getSkillMatchBadge(job)}
    <div class="job-header">

        <img
            src="${logo}"
            class="company-logo"
            alt="${job.company}">

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

            ${job.salary}

        </p>

        ${
            job.type==="INTERN"

                ?

                `

            <p>

                <i class="fa-solid fa-clock"></i>

                ${job.duration}

            </p>

            <p>

                <i class="fa-solid fa-money-bill-wave"></i>

                ${job.stipend}

            </p>

            `

                :

                ""

        }

    </div>

    <div class="job-buttons">

        <button
            class="save-btn"
            id="save-btn-${job.id}"
            onclick="saveJob(${job.id}, this)">

            <i class="fa-regular fa-bookmark"></i>

            Save

        </button>

        <button
            class="apply-btn"
            id="apply-btn-${job.id}"
            onclick="viewJob(${job.id}, this)">

            <i class="fa-solid fa-paper-plane"></i>

            Apply

        </button>

    </div>

</div>

`;

    });

    document.getElementById("jobs").innerHTML = html;

    jobsShown += nextBatch.length;

    renderLoadMoreButton(jobs.length);

    markAlreadySavedJobs();

    markAlreadyAppliedJobs();

}

function renderLoadMoreButton(totalCount){

    let wrap = document.getElementById("loadMoreWrap");

    if(!wrap){

        wrap = document.createElement("div");
        wrap.id = "loadMoreWrap";
        wrap.className = "load-more-wrap";
        document.getElementById("jobs").insertAdjacentElement("afterend", wrap);

    }

    if(jobsShown >= totalCount){

        wrap.innerHTML = `<p class="load-more-done">You've seen all ${totalCount} jobs.</p>`;
        return;

    }

    wrap.innerHTML =
        `<button class="load-more-btn" onclick="renderJobPage()">
            Load More Jobs (${totalCount - jobsShown} remaining)
        </button>`;

}
// ==============================
// DASHBOARD
// =======================================

async function updateDashboard(jobs){

    document.getElementById("jobCount").innerText = jobs.length;

    const interns =
        jobs.filter(job => job.type === "INTERN");

    const internElement =
        document.getElementById("internCount");

    if(internElement){

        internElement.innerText = interns.length;

    }

    try{

        const res =
            await fetch(BASE_URL + "/companies");

        const companies =
            await res.json();

        document.getElementById("companyCount").innerText =
            companies.length;

    }

    catch(error){

        console.log(error);

    }

}

// =======================================
// LOAD COMPANIES
// =======================================

async function loadCompanies(){

    const companyListEl = document.getElementById("companyList");

    if(companyListEl){

        companyListEl.innerHTML =
            `<div class="loading-state">
                <div class="spinner"></div>
                <p>Loading companies...</p>
            </div>`;

    }

    try{

        const res =
            await fetch(BASE_URL + "/companies");

        const companies =
            await res.json();

        const companyList =
            document.getElementById("companyList");

        if(!companyList){

            return;

        }

        let html = "";

        companies.forEach(company=>{

            const logo =
                getCompanyLogoUrl(company.name);

            html += `

<div class="company-box">

    <img
        src="${logo}"
        alt="${company.name}">

    <h3>

        ${company.name}

    </h3>

    <p>

        📍 ${company.location || "India"}

    </p>

    <p>

        💼 Hiring Now

    </p>

    <button onclick="viewCompanyJobs('${company.name.replace(/'/g,"\\'")}')">

        View Jobs

    </button>

</div>

`;

        });

        companyList.innerHTML = html;

    }

    catch(error){

        console.log(error);

    }

}
// =======================================
// FILTER JOBS (All / Full-Time / Internships)
// =======================================

function filterJobs(type, btn){

    lastViewedCompany = null;

    document.querySelectorAll(".filter-btn").forEach(b=>{

        b.classList.remove("active");

    });

    if(btn){

        btn.classList.add("active");

    }

    const filtered =
        type === "ALL"
            ? allJobs
            : allJobs.filter(job => job.type === type);

    showJobs(filtered);

    markAlreadyAppliedJobs();

}

// =======================================
// VIEW JOBS FOR A SPECIFIC COMPANY
// =======================================

function viewCompanyJobs(companyName){

    lastViewedCompany = companyName;

    document.querySelectorAll(".filter-btn").forEach(b=>{

        b.classList.remove("active");

    });

    const allBtn = document.querySelector('.filter-btn[data-type="ALL"]');

    if(allBtn){

        allBtn.classList.add("active");

    }

    const filtered =
        allJobs.filter(job => job.company === companyName);

    showJobs(filtered);

    markAlreadyAppliedJobs();

    document.getElementById("jobs").scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}

// =======================================
// SEARCH JOBS
// =======================================

async function searchJobs(){

    lastViewedCompany = null;

    document.querySelectorAll(".filter-btn").forEach(b=>{

        b.classList.remove("active");

    });

    const allBtn = document.querySelector('.filter-btn[data-type="ALL"]');

    if(allBtn){

        allBtn.classList.add("active");

    }

    const key =
        document.getElementById("search").value.trim();

    if(key===""){

        loadJobs();

        return;

    }

    try{

        const res =
            await fetch(API + "/search?key=" + encodeURIComponent(key));

        const jobs =
            await res.json();

        showJobs(jobs);

        markAlreadyAppliedJobs();

    }

    catch(error){

        console.log(error);

    }

}

// =======================================
// SAVE JOB
// =======================================

async function saveJob(jobId, btn){

    const user =
        JSON.parse(localStorage.getItem("user"));

    if(!user){

        showToast("Please login first to save jobs", "error");

        setTimeout(()=> window.location.href="login.html", 1200);

        return;

    }

    try{

        const res =
            await fetch(BASE_URL + "/save",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    userId:user.id,

                    jobId:jobId

                })

            });

        if(res.ok){

            showToast("Job saved successfully!", "success");

            markSaved(btn || document.getElementById("save-btn-" + jobId));

        }

        else{

            const msg =
                await res.text();

            // Already-saved jobs should still visually look "Saved",
            // not throw an error at the user.
            if(msg && msg.toLowerCase().includes("already")){

                markSaved(btn || document.getElementById("save-btn-" + jobId));

            }
            else{

                showToast(msg, "error");

            }

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to save job. Please try again.", "error");

    }

}

// Switches a Save button into a permanent green "Saved" state.
function markSaved(btn){

    if(!btn) return;

    btn.classList.add("saved");

    btn.disabled = true;

    btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Saved`;

}

// =======================================
// APPLY JOB
// =======================================

async function viewJob(jobId, btn){

    const user =
        JSON.parse(localStorage.getItem("user"));

    if(!user){

        showToast("Please login first to apply", "error");

        setTimeout(()=> window.location.href="login.html", 1200);

        return;

    }

    // Check if this user already applied to this job, so we
    // don't let them fill the form again by mistake.
    try{

        const res = await fetch(BASE_URL + "/apply/user/" + user.id);

        const appliedJobs = await res.json();

        const already = appliedJobs.find(a => Number(a.jobId) === Number(jobId));

        if(already){

            showToast("Already Applied — check your Applied Jobs page", "error");

            markApplied(btn || document.getElementById("apply-btn-" + jobId));

            return;

        }

    }
    catch(error){

        console.log(error);
        // If the check fails, fall through and let them apply —
        // better to allow than to block on a network hiccup.

    }

    localStorage.setItem("selectedJobId",jobId);

    window.location.href="applyjob.html";

}

// =======================================
// LOGOUT
// =======================================

async function logout(){

    const confirmed =
        (typeof showConfirm === "function")
            ? await showConfirm("You will need to login again to access saved jobs and applications.", "Logout from JobPortal?")
            : confirm("Do you want to logout?");

    if(confirmed){

        localStorage.removeItem("user");

        localStorage.removeItem("selectedJobId");

        if(typeof showToast === "function"){
            showToast("Logged out successfully", "success");
        }

        setTimeout(()=> window.location.href="login.html", 800);

    }

}
function getSkillMatchBadge(job){

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user) return "";

    const raw = localStorage.getItem("profile_" + user.id);

    if(!raw) return "";

    const profile = JSON.parse(raw);

    if(!profile.skills) return "";

    const mySkills = profile.skills.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

    const jobSkills = (job.language || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

    if(mySkills.length===0 || jobSkills.length===0) return "";

    const matched = jobSkills.filter(js => mySkills.some(ms => ms.includes(js) || js.includes(ms)));

    const percent = Math.round((matched.length / jobSkills.length) * 100);

    let cssClass = percent >= 70 ? "high" : percent >= 40 ? "mid" : "low";

    return `<div class="skill-match ${cssClass}"><i class="fa-solid fa-bullseye"></i> ${percent}% Match</div>`;

}

