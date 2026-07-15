const user = JSON.parse(localStorage.getItem("user"));

if (!user) {

    window.location.href = "login.html";

}

loadSaved();

// ===================================
// LOAD SAVED JOBS
// ===================================

async function loadSaved() {

    try {

        const saveRes =
            await fetch(BASE_URL + "/save/user/" + user.id);

        const savedJobs =
            await saveRes.json();

        const jobRes =
            await fetch(BASE_URL + "/jobs");

        const jobs =
            await jobRes.json();

        let html = "";

        savedJobs.forEach(item => {

            const job =
                jobs.find(j => Number(j.id) === Number(item.jobId));

            if (job) {

                html += `

<div class="job-card">

    <div class="job-header">

        <img
            src="${getCompanyLogoUrl(job.company)}"
            class="company-logo">

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
                    job.type === "INTERN"
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
            class="apply-btn"
            onclick="viewJob(${job.id})">

            <i class="fa-solid fa-paper-plane"></i>

            Apply Now

        </button>

    </div>

</div>

`;

            }

        });

        document.getElementById("savedJobs").innerHTML =
            html || "<h2 style='text-align:center'>No Saved Jobs</h2>";

    }

    catch (error) {

        console.log(error);

    }

}

// ===================================
// OPEN APPLY PAGE
// ===================================

function viewJob(id) {

    localStorage.setItem("selectedJobId", id);

    window.location.href = "applyjob.html";

}