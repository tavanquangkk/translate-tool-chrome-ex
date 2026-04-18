let popup = null;

// bắt sự kiện user thả chuột (sau khi highlight)
document.addEventListener("mouseup", async () => {
    const text = window.getSelection().toString().trim();

    if (!text) return;

    const translation = await translate(text);

    showPopup(text, translation);
});

async function translate(text) {
    const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`
    );

    const data = await res.json();
    return data.responseData.translatedText;
}

function showPopup(original, translation) {
    if (popup) popup.remove();

    popup = document.createElement("div");

    popup.style.position = "absolute";
    popup.style.background = "#111";
    popup.style.color = "#fff";
    popup.style.padding = "10px";
    popup.style.borderRadius = "8px";
    popup.style.zIndex = 999999;
    popup.style.maxWidth = "300px";
    popup.style.fontSize = "14px";
    popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

    popup.innerHTML = `
        <!-- <div><b>Original:</b><br>${original}</div> -->
        <hr/>
        <div><b>Translate:</b><br>${translation}</div>
    `;

    document.body.appendChild(popup);

    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();

    popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
}