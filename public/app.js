const input      = document.getElementById("urlInput");
const btn        = document.getElementById("goBtn");
const msgBar     = document.getElementById("msgBar");
const frame      = document.getElementById("frame");
const placeholder = document.getElementById("placeholder");

input.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
btn.addEventListener("click", go);
input.focus();

async function go() {
  const raw = input.value.trim();
  if (!raw) { showMsg("error", "Please enter a URL."); return; }

  btn.disabled = true;
  showMsg("loading", "Loading…");

  try {
    // Validate first
    const res  = await fetch("/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: raw }),
    });
    const data = await res.json();
    if (data.error) { showMsg("error", data.error); return; }

    // Load in iframe via proxy
    placeholder.style.display = "none";
    frame.style.display       = "block";
    frame.src                 = `/proxy?url=${encodeURIComponent(data.url)}`;

    frame.onload  = () => { hideMsg(); btn.disabled = false; };
    frame.onerror = () => { showMsg("error", "Failed to load the page."); btn.disabled = false; };

  } catch {
    showMsg("error", "Could not reach server. Is it running?");
  }
}

function showMsg(type, text) {
  msgBar.className   = `msg-bar ${type}`;
  msgBar.textContent = text;
  msgBar.style.display = "block";
  if (type !== "loading") btn.disabled = false;
}

function hideMsg() {
  msgBar.style.display = "none";
}