let popup = null;
let overlay = null;

document.addEventListener("mouseup", async () => {
    const text = window.getSelection().toString().trim();

    if (!text) return;

    const translation = await translate(text);

    showPopup(text, translation);
});

function showPopup(original, translation) {
    removePopup(); // clear cái cũ nếu có

    // ===== OVERLAY =====
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.4)";
    overlay.style.zIndex = "999998";

    overlay.addEventListener("click", removePopup);

    document.body.appendChild(overlay);

    // ===== POPUP =====
    popup = document.createElement("div");

    popup.style.position = "absolute";
    popup.style.background = "#1e1e1e";
    popup.style.color = "#ffffff";
    popup.style.padding = "12px 14px";
    popup.style.borderRadius = "10px";
    popup.style.zIndex = "999999";
    popup.style.maxWidth = "320px";
    popup.style.fontSize = "14px";
    popup.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)";
    popup.style.border = "1px solid #333";

    popup.innerHTML = `
        <div style="margin-bottom:8px;">
            <b style="color:#aaa;">Original</b><br/>
            ${original}
        </div>
        <hr style="border:0;border-top:1px solid #333;" />
        <div style="margin-top:8px;">
            <b style="color:#4fc3f7;">Translate</b><br/>
            ${translation}
        </div>
        <div style="margin-top:10px;font-size:12px;color:#888;">
            Click outside to close
        </div>
    `;

    document.body.appendChild(popup);

    // đặt vị trí gần vùng bôi đen
    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();

    popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
}

function removePopup() {
    if (popup) {
        popup.remove();
        popup = null;
    }

    if (overlay) {
        overlay.remove();
        overlay = null;
    }
}

async function translate(text) {
    const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`
    );

    const data = await res.json();
    return data.responseData.translatedText;
}