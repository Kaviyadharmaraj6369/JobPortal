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

    }

    catch(error){

        console.log(error);

    }

}
async function submitApplication(){

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

            document.getElementById("result").innerHTML=

                `<div class="success-box">

                🎉 Application Submitted Successfully

            </div>`;

            setTimeout(()=>{

                window.location.href="apply.html";

            },1500);

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