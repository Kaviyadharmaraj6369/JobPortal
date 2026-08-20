

const companyLogos = {};


const LOGO_COLORS = [
    "#2962ff","#00897b","#d81b60","#6d4c41","#5e35b1",
    "#00acc1","#43a047","#fb8c00","#3949ab","#c0392b",
    "#16a085","#8e44ad","#2c3e50","#e67e22","#0277bd",
    "#ad1457","#00695c","#4527a0","#ef6c00","#37474f"
];

function getInitials(name){

    if(!name) return "?";

    const words = name
        .replace(/[^a-zA-Z0-9& ]/g,"")
        .split(" ")
        .filter(Boolean);

    if(words.length === 0) return "?";

    if(words.length === 1){
        return words[0].substring(0,2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
}

function getColorForName(name){

    let hash = 0;

    for(let i=0; i<name.length; i++){
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % LOGO_COLORS.length;

    return LOGO_COLORS[index];
}


function generateInitialsLogo(name){

    const initials = getInitials(name);
    const color = getColorForName(name);

    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">` +
        `<rect width="140" height="140" rx="24" fill="${color}"/>` +
        `<text x="50%" y="52%" dy=".35em" text-anchor="middle" ` +
        `font-family="Poppins, Arial, sans-serif" font-size="48" ` +
        `font-weight="700" fill="#ffffff">${initials}</text>` +
        `</svg>`;

    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}


function getCompanyLogoUrl(companyName){

    if(companyLogos[companyName]){
        return companyLogos[companyName];
    }

    return generateInitialsLogo(companyName || "Company");
}