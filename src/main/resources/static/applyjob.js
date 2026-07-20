const API = BASE_URL + "/jobs";
const APPLY_API = BASE_URL + "/apply";

const user = JSON.parse(localStorage.getItem("user"));
const jobId = localStorage.getItem("selectedJobId");

if (!user) {

    showToast("Please login first to apply for jobs", "error");

    setTimeout(()=> window.location.href = "login.html", 1200);

}

if (!jobId) {

    showToast("Job not found", "error");

    setTimeout(()=> window.location.href = "index.html", 1200);

}

// Company logo lookup (companyLogos map + getCompanyLogoUrl)
// now lives in the shared company-logo.js file.

document.addEventListener("DOMContentLoaded", () => {
// Add to applyjob.js, call once in DOMContentLoaded:
    document.getElementById("skills").addEventListener("input", function(){
        const count = this.value.split(",").filter(s => s.trim()).length;
        let hint = document.getElementById("skillsHint");
        if(!hint){
            hint = document.createElement("small");
            hint.id = "skillsHint";
            hint.style.color = "#666";
            this.parentElement.appendChild(hint);
        }
        hint.innerText = count + " skill(s) added";
    });
    checkAlreadyApplied();

});

// Runs before the form loads. If this user already applied to
// this exact job (regardless of which page/button sent them
// here), we skip the form entirely and send them back with a
// clear message — instead of letting them fill it out again.
async function checkAlreadyApplied(){

    if (!user || !jobId) {
        return;
    }

    try{

        const res = await fetch(BASE_URL + "/apply/user/" + user.id);

        const appliedJobs = await res.json();

        const already = appliedJobs.find(a => Number(a.jobId) === Number(jobId));

        if(already){

            showToast("Already Applied — redirecting to your applications...", "error");

            setTimeout(()=> window.location.href = "apply.html", 1500);

            return;

        }

    }
    catch(error){

        console.log(error);
        // If the check itself fails, fall through and show the
        // form anyway — the backend still blocks true duplicates.

    }

    loadJob();

}

// ===============================
// SIMILAR JOBS RECOMMENDATION
// ===============================
// Suggests other openings of the same type (JOB/INTERN) that
// share at least one required skill with the job being viewed —
// same idea as "People also viewed" on real job portals.

async function loadSimilarJobs(currentJob){

    try{

        const res = await fetch(API);

        const allJobs = await res.json();

        const currentSkills = (currentJob.language || "")
            .toLowerCase()
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        const similar = allJobs.filter(j => {

            if(Number(j.id) === Number(currentJob.id)) return false;

            if(j.type !== currentJob.type) return false;

            const jSkills = (j.language || "").toLowerCase();

            return currentSkills.some(skill => jSkills.includes(skill));

        }).slice(0, 3);

        const section = document.getElementById("similarJobsSection");

        const container = document.getElementById("similarJobs");

        if(similar.length === 0){

            section.style.display = "none";

            return;

        }

        container.innerHTML = similar.map(job => `

            <div class="job-card">

                <div class="job-header">

                    <img src="${getCompanyLogoUrl(job.company)}" class="company-logo" alt="${job.company}">

                    <div>
                        <h3>${job.title}</h3>
                        <h4>${job.company}</h4>
                    </div>

                </div>

                <div class="job-details">

                    <p><i class="fa-solid fa-location-dot"></i> ${job.location}</p>
                    <p><i class="fa-solid fa-code"></i> ${job.language}</p>
                    <p><i class="fa-solid fa-indian-rupee-sign"></i> ${job.salary || job.stipend || "N/A"}</p>

                </div>

                <div class="job-buttons">

                    <button class="apply-btn" onclick="goToSimilarJob(${job.id})">
                        <i class="fa-solid fa-paper-plane"></i> View & Apply
                    </button>

                </div>

            </div>

        `).join("");

        section.style.display = "block";

    }
    catch(error){

        console.log(error);

    }

}

function goToSimilarJob(id){

    localStorage.setItem("selectedJobId", id);

    window.location.reload();

}

async function loadJob(){

    try{

        const res = await fetch(API + "/" + jobId);

        const job = await res.json();

        document.getElementById("jobTitle").innerText = job.title;

        document.getElementById("companyName").innerText = job.company;

        document.getElementById("jobLocation").innerText = job.location;

        document.getElementById("jobLanguage").innerText = job.language;

        document.getElementById("jobExperience").innerText = job.experience;

        document.getElementById("jobSalary").innerText = job.salary;

        document.getElementById("companyLogo").src =

            getCompanyLogoUrl(job.company);

        loadSimilarJobs(job);

    }

    catch(error){

        console.log(error);

    }

}
async function submitApplication(){

    // ===============================
    // VALIDATE REQUIRED FIELDS
    // ===============================
    // LinkedIn, GitHub, Portfolio, LeetCode and HackerRank stay
    // optional — everything else needs to be filled before the
    // Apply button actually submits anything.

    const requiredFields = [
        { id: "fullName", label: "Full Name" },
        { id: "email", label: "Email" },
        { id: "phone", label: "Phone" },
        { id: "dob", label: "Date of Birth" },
        { id: "qualification", label: "Qualification" },
        { id: "college", label: "College" },
        { id: "passingYear", label: "Passing Year" },
        { id: "experience", label: "Experience" },
        { id: "skills", label: "Skills" },
        { id: "currentLocation", label: "Current Location" }

    ];

    const missing = requiredFields.filter(f => {

        const el = document.getElementById(f.id);

        return !el || !el.value.trim();

    });

    // Clear any previous error highlighting, then mark the
    // fields that are still missing right now.
    requiredFields.forEach(f => {

        const el = document.getElementById(f.id);

        if(el) el.classList.remove("field-error");

    });

    missing.forEach(f => {

        const el = document.getElementById(f.id);

        if(el) el.classList.add("field-error");

    });

    if(missing.length > 0){

        const missingNames = missing.map(f => f.label).join(", ");
// Add inside the requiredFields check block, after the missing.length check:
        const phoneVal = document.getElementById("phone").value.trim();
        if(phoneVal && !/^[6-9]\d{9}$/.test(phoneVal)){
            showToast("Enter a valid 10-digit Indian mobile number", "error");
            document.getElementById("phone").classList.add("field-error");
            return;
        }
        if(typeof showToast === "function"){
            showToast("Please fill: " + missingNames, "error");
        }

        document.getElementById("result").innerHTML =
            `<div class="error-box">Please fill all required fields: ${missingNames}</div>`;

        // Focus the first missing field so the user can jump
        // straight to it instead of hunting for it.
        const firstMissingEl = document.getElementById(missing[0].id);
        if(firstMissingEl) firstMissingEl.focus();

        return;

    }

    const file = document.getElementById("resumeFile").files[0];

    let resumePath = "";

    try{

        if(file){

            const fd = new FormData();

            fd.append("file", file);

            const upload = await fetch(APPLY_API + "/upload",{

                method:"POST",

                body:fd

            });

            resumePath = await upload.text();

        }

        const request={

            userId:user.id,

            jobId:Number(jobId),

            fullName:document.getElementById("fullName").value,

            email:document.getElementById("email").value,

            phone:document.getElementById("phone").value,

            dob:document.getElementById("dob").value,

            qualification:document.getElementById("qualification").value,

            college:document.getElementById("college").value,

            passingYear:document.getElementById("passingYear").value,

            experience:document.getElementById("experience").value,

            skills:document.getElementById("skills").value,

            currentLocation:document.getElementById("currentLocation").value,

            linkedin:document.getElementById("linkedin").value,
            github:document.getElementById("github").value,

            portfolio:document.getElementById("portfolio").value,

            leetcode:document.getElementById("leetcode").value,

            hackerrank:document.getElementById("hackerrank").value,

            resumePath:resumePath

        };

        const res = await fetch(APPLY_API,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(request)

        });

        if(res.ok){

            const applicantEmail = document.getElementById("email").value;

            document.getElementById("result").innerHTML=

                `<div class="success-box">

                🎉 Application Submitted Successfully

            </div>

            <div class="email-sim-box">

                <i class="fa-solid fa-envelope-circle-check"></i>

                <div>
                    <strong>Confirmation email sent</strong>
                    <p>A copy of your application has been sent to ${applicantEmail} (simulated).</p>
                </div>

            </div>`;

            setTimeout(()=>{

                window.location.href="apply.html";

            },2200);

        }

        else{

            const msg = await res.text();

            document.getElementById("result").innerHTML=

                `<div class="error-box">${msg}</div>`;

        }

    }

    catch(error){

        console.log(error);

        document.getElementById("result").innerHTML=

            `<div class="error-box">

            Server Error

        </div>`;

    }

}

async function logout(){

    const confirmed =
        (typeof showConfirm === "function")
            ? await showConfirm("You will need to login again to access saved jobs and applications.", "Logout from JobPortal?")
            : confirm("Do you want to logout?");

    if(confirmed){

        localStorage.removeItem("user");

        if(typeof showToast === "function"){
            showToast("Logged out successfully", "success");
        }

        setTimeout(()=> window.location.href="login.html", 800);

    }

}