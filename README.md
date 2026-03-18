# 🌐 My Web Browser

A simple web browser application built with **Node.js**, **Express.js**, **HTML**, and **CSS**.

## Features

- Enter any URL and load the webpage inside the app
- Works with HTML pages, JSON, plain text, and PDFs
- Handles invalid URLs with clear error messages
- Strips security headers that block iframe rendering
- Auto-prepends `https://` if no protocol is given

## Project Structure

```
my-browser/
├── server.js         # Express server + proxy logic
├── package.json
└── public/
    ├── index.html    # UI
    ├── style.css     # Styling
    └── app.js        # Frontend logic
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v14+

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### Run

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. User enters a URL and clicks **Go**
2. Frontend sends the URL to `/check` for validation
3. The iframe loads `/proxy?url=...` which fetches the page server-side
4. The server strips iframe-blocking headers (`X-Frame-Options`, `CSP`, etc.), injects a `<base>` tag for relative URLs, and returns the page
5. The page renders inside the iframe

## Tech Stack

- **Backend:** Node.js, Express, Axios
- **Frontend:** HTML, CSS, Vanilla JavaScript

## Known Limitations

- Some sites (Google, Facebook, Amazon) actively block proxy requests and will return a 403
- JavaScript-heavy SPAs may not render fully due to cross-origin API restrictions