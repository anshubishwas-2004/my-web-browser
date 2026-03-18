const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

// Headers from upstream that we must NOT forward (they break iframe display)
const BLOCKED_HEADERS = [
  "x-frame-options",
  "content-security-policy",
  "content-security-policy-report-only",
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
  "cross-origin-resource-policy",
  "strict-transport-security",
  "transfer-encoding",
  "connection",
];

function normalizeUrl(url) {
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

function isValidUrl(url) {
  try {
    const p = new URL(url);
    return p.hostname && p.hostname.includes(".");
  } catch {
    return false;
  }
}

app.get("/proxy", async (req, res) => {
  let url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  url = normalizeUrl(url);
  if (!isValidUrl(url)) return res.status(400).send("Invalid URL");

  try {
    const response = await axios.get(url, {
      timeout: 15000,
      maxRedirects: 5,
      headers: HEADERS,
      responseType: "arraybuffer",
      validateStatus: () => true, // don't throw on 4xx/5xx
    });

    const contentType = response.headers["content-type"] || "text/html";
    const finalUrl = response.request?.res?.responseUrl || url;

    // Forward safe headers only
    Object.entries(response.headers).forEach(([key, value]) => {
      if (!BLOCKED_HEADERS.includes(key.toLowerCase())) {
        try { res.setHeader(key, value); } catch {}
      }
    });

    // Allow iframe embedding from our own server
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Content-Type", contentType);

    if (contentType.includes("text/html")) {
      let html = Buffer.from(response.data).toString("utf-8");

      // Inject base tag for relative URLs
      const base = new URL(finalUrl);
      const baseHref = base.origin + base.pathname.replace(/\/[^/]*$/, "/");

      html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");

      if (/<head/i.test(html)) {
        html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseHref}">`);
      } else {
        html = `<base href="${baseHref}">` + html;
      }

      return res.send(html);
    }

    res.send(response.data);

  } catch (err) {
    let msg = "Failed to load page.";
    if (err.code === "ENOTFOUND")       msg = `Domain not found: "${new URL(url).hostname}"`;
    else if (err.code === "ETIMEDOUT")  msg = "Request timed out.";
    else if (err.code === "ECONNREFUSED") msg = "Connection refused by server.";
    else if (err.response?.status)      msg = `HTTP error ${err.response.status}`;

    res.status(502).send(`
      <html><body style="font-family:Arial;padding:40px;color:#c0392b;">
        <h2>Could not load page</h2>
        <p>${msg}</p>
        <p style="color:#888;font-size:13px;">URL: ${url}</p>
      </body></html>
    `);
  }
});

app.post("/check", (req, res) => {
  let { url } = req.body;
  if (!url || !url.trim()) return res.json({ error: "Please enter a URL." });
  url = normalizeUrl(url.trim());
  if (!isValidUrl(url)) return res.json({ error: `"${url}" is not a valid URL.` });
  return res.json({ ok: true, url });
});

app.listen(PORT, () => {
  console.log(`Browser app running at http://localhost:${PORT}`);
});