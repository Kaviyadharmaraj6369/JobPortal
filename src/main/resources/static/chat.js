// ==========================================================
// SHARED CHAT MODAL
// A lightweight recruiter <-> candidate chat thread, tied to
// one application (applicationId). Used by:
//   - apply.js (applicant side, senderRole = "USER")
//   - admin.js (admin side, senderRole = "ADMIN")
// ==========================================================

let currentChatApplicationId = null;
let currentChatSenderRole = null;
let currentChatSenderName = null;

function ensureChatModal() {

    let modal = document.getElementById("chatModal");

    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "chatModal";
    modal.className = "chat-modal-overlay";

    modal.innerHTML = `
        <div class="chat-modal-box">
            <div class="chat-modal-header">
                <h3><i class="fa-solid fa-comments"></i> <span id="chatModalTitle">Chat</span></h3>
                <button class="chat-modal-close" onclick="closeChatModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="chat-modal-messages" id="chatMessages"></div>
            <div class="chat-modal-input">
                <input type="text" id="chatInput" placeholder="Type a message..."
                       onkeyup="if(event.key==='Enter') sendChatMessage()">
                <button onclick="sendChatMessage()">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeChatModal();
    });

    return modal;

}

// Call this to open the chat for a given application.
// senderRole is "USER" or "ADMIN", senderName is shown to the
// other side (applicant's name, or "JobPortal Recruiter").
async function openChatModal(applicationId, senderRole, senderName, title) {

    currentChatApplicationId = applicationId;
    currentChatSenderRole = senderRole;
    currentChatSenderName = senderName;

    const modal = ensureChatModal();

    document.getElementById("chatModalTitle").innerText = title || "Chat";

    modal.classList.add("show");

    await loadChatMessages();

}

function closeChatModal() {

    const modal = document.getElementById("chatModal");

    if (modal) modal.classList.remove("show");

}

async function loadChatMessages() {

    const box = document.getElementById("chatMessages");

    box.innerHTML = `<p class="chat-loading">Loading messages...</p>`;

    try {

        const res = await fetch(BASE_URL + "/messages/application/" + currentChatApplicationId);

        const messages = await res.json();

        if (!messages.length) {

            box.innerHTML = `<p class="chat-empty">No messages yet. Say hello!</p>`;

            return;

        }

        box.innerHTML = messages.map(m => `
            <div class="chat-bubble ${m.senderRole === currentChatSenderRole ? 'mine' : 'theirs'}">
                <span class="chat-sender">${m.senderName || m.senderRole}</span>
                <p>${escapeHtml(m.text)}</p>
                <span class="chat-time">${new Date(m.sentAt).toLocaleString()}</span>
            </div>
        `).join("");

        box.scrollTop = box.scrollHeight;

    } catch (error) {

        console.log(error);

        box.innerHTML = `<p class="chat-empty">Unable to load messages.</p>`;

    }

}

async function sendChatMessage() {

    const input = document.getElementById("chatInput");

    const text = input.value.trim();

    if (!text) return;

    try {

        await fetch(BASE_URL + "/messages", {

            method: "POST",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({
                applicationId: currentChatApplicationId,
                senderRole: currentChatSenderRole,
                senderName: currentChatSenderName,
                text: text
            })

        });

        input.value = "";

        await loadChatMessages();

    } catch (error) {

        console.log(error);

        if (typeof showToast === "function") {
            showToast("Unable to send message", "error");
        }

    }

}

function escapeHtml(str) {

    const div = document.createElement("div");
    div.innerText = str;
    return div.innerHTML;

}