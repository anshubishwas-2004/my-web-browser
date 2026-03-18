# 🌐 My Web Browser

> A sleek, minimal web browser built using Node.js and Express that lets you surf the web inside your own app.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge\&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge\&logo=express)
![Frontend](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-blue?style=for-the-badge\&logo=javascript)

---

## ✨ Features

🚀 Load any website inside your app
🔗 Supports HTML, JSON, text, and PDFs
⚡ Smart URL handling (auto-adds `https://`)
🛡️ Bypasses iframe restrictions (X-Frame-Options, CSP)
❌ Clean error handling for invalid URLs
🎨 Modern and responsive UI

---

## 📸 Preview

```
/public/screenshot.png
```

---

## 🏗️ Project Structure

```
my-browser/
├── server.js         # Express server + proxy logic
├── package.json
└── public/
    ├── index.html    # UI
    ├── style.css     # Styling
    └── app.js        # Frontend logic
```

---

## ⚙️ Getting Started

### 🔧 Prerequisites

* Node.js (v14 or higher)

### 📥 Installation

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### ▶️ Run the App

```bash
npm start
```

Now open 👉 **http://localhost:3000**

---

## 🧠 How It Works

1. User enters a URL
2. Frontend sends request to `/check`
3. Server validates and processes the URL
4. `/proxy` fetches the webpage using Axios
5. Security headers are stripped
6. `<base>` tag is injected for proper routing
7. Page renders inside an iframe

---

## ⚠️ Limitations

* ❌ Some websites (Google, Facebook, Amazon) block proxy access
* ⚠️ JavaScript-heavy apps (SPA) may not fully load
* 🔒 Cross-origin API restrictions still apply

---

## 🚀 Future Improvements

* 🔍 Add search engine support (Google/Bing fallback)
* ⭐ Bookmark system
* 🕘 Browsing history
* 🧑‍💻 Developer tools panel
* 🌙 Dark mode toggle

---

## 🤝 Contributing

Pull requests are welcome!
If you find bugs or have ideas, feel free to open an issue.

---

## 📜 License

This project is licensed under the MIT License.

---

## 💡 Author

Made by **Anshu Bishwas**
