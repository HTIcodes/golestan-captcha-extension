# 🤖 Golestan CAPTCHA Helper

Automatic CAPTCHA recognition for Golestan university portal using AI.

## 📸 Preview

<p align="center">
  <img src="screenshots/Screenshot 2025-12-29 130230.png" alt="Extension Popup" width="348" height='320'>
  <br>
  <img src="screenshots/Screenshot 2025-12-29 130348.png" alt="Demo" width="1919" height="949">
</p>

---

## ✨ Features

- Automatic CAPTCHA recognition (~95% accuracy)
- One-click auto-fill or copy to clipboard
- Clean and minimal interface
- Cloud-based AI model (no setup required)

---

## 📥 Installation

1. **Download or Clone** this repository
   ```bash
   git clone https://github.com/HTIcodes/golestan-captcha-extension.git
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right)

3. **Load Extension**
   - Click **"Load unpacked"**
   - Select the repository folder

4. **Done!** The extension is now installed ✅

---

## 🎯 Usage

1. Go to [Golestan Login Page](https://golestan.ikiu.ac.ir/forms/authenticateuser/main.htm)
2. Click the extension icon in your toolbar
3. Choose:
   - **✓ تشخیص و پر کردن** - Auto-fill CAPTCHA
   - **⎘ تشخیص و کپی** - Copy to clipboard

---

## ⚙️ Configuration

### Using Default Cloud Server

The extension is pre-configured to use a cloud server. No additional setup required.

### Using Your Own Server (Optional)

If you want to run your own recognition server:

1. Clone the [Server Repository](https://github.com/HTIcodes/captcha-recognition-server)
2. Follow server setup instructions
3. Update `popup.js` line 8:
   ```javascript
   const SERVER_URL = 'https://your-server-url.com';
   ```

---

## 📊 Performance

- **Recognition Time:** 5-10 seconds
- **First Daily Use:** 30-60 seconds (server cold start)
- **Accuracy:** ~95%

---

## 🐛 Troubleshooting

**Extension not working?**
- Refresh the Golestan page (F5)
- Make sure you're on the login page
- Check browser console for errors

**Wrong CAPTCHA recognized?**
- Click CAPTCHA image to refresh
- Try again (AI has ~5% error rate)

---

## 🔗 Related

- [Recognition Server](https://github.com/HTIcodes/captcha-recognition-server) - Backend AI server

---

## 📝 Requirements

- Chrome 88+
- Internet connection

---

## 📜 License

MIT License - See [LICENSE](LICENSE)

---

**Built with ❤️ for students**
