const btnFill = document.getElementById('btnFill');
const btnCopy = document.getElementById('btnCopy');
const status = document.getElementById('status');
const resultContainer = document.getElementById('resultContainer');
const resultText = document.getElementById('resultText');
const modelStatus = document.getElementById('modelStatus');

const SERVER_URL = 'https://captcha-recognition-server.onrender.com';

async function checkServer() {
    try {
        modelStatus.textContent = 'در حال اتصال...';
        modelStatus.className = 'model-status model-loading';
        
        const response = await fetch(`${SERVER_URL}/`);
        
        if (response.ok) {
            modelStatus.textContent = 'آماده است';
            modelStatus.className = 'model-status model-ready';
            btnFill.disabled = false;
            btnCopy.disabled = false;
            return true;
        }
    } catch (error) {
        modelStatus.textContent = 'سرور در حال راه‌اندازی...';
        modelStatus.className = 'model-status model-error';
        setTimeout(checkServer, 5000);
        return false;
    }
}

function showStatus(message, type) {
    status.textContent = message;
    status.className = `status-${type}`;
    status.style.display = 'block';
}

function hideStatus() {
    status.style.display = 'none';
}

function showResult(captchaText) {
    resultText.textContent = captchaText;
    resultContainer.style.display = 'block';
}

function hideResult() {
    resultContainer.style.display = 'none';
}

function base64ToBlob(base64, contentType = 'image/png') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

async function getCaptchaImageAsBase64() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        function: () => {
            let img = document.getElementById('imgCaptcha');
            if (!img) img = document.querySelector('img[src*="captcha.aspx"]');
            if (!img) img = document.querySelector('img[onclick*="oc()"]');
            
            if (!img || !img.complete) {
                return { error: 'تصویر CAPTCHA پیدا نشد', found: false };
            }
            
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                return { 
                    base64: canvas.toDataURL('image/png'),
                    found: true
                };
            } catch (error) {
                return { error: 'خطا در تبدیل تصویر', found: false };
            }
        }
    });
    
    for (const result of results) {
        if (result.result.found) {
            return result.result.base64;
        }
    }
    
    throw new Error('تصویر CAPTCHA پیدا نشد');
}

async function recognizeCaptcha() {
    try {
        hideResult();
        showStatus('در حال استخراج تصویر...', 'loading');
        
        const base64Data = await getCaptchaImageAsBase64();
        showStatus('در حال تشخیص...', 'loading');
        
        const base64WithoutPrefix = base64Data.split(',')[1];
        const blob = base64ToBlob(base64WithoutPrefix);
        
        const formData = new FormData();
        formData.append('file', blob, 'captcha.png');
        
        const response = await fetch(`${SERVER_URL}/predict`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`خطای سرور: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showStatus('تشخیص موفق!', 'success');
            showResult(result.captcha);
            return result.captcha;
        } else {
            throw new Error(result.error || 'خطای تشخیص');
        }
    } catch (error) {
        showStatus('خطا: ' + error.message, 'error');
        throw error;
    }
}

async function fillCaptcha(captchaText) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        function: (text) => {
            const input = document.getElementById('F51701');
            if (input) {
                input.value = text;
                input.style.background = '#d4edda';
                input.focus();
                setTimeout(() => { input.style.background = ''; }, 1500);
            }
        },
        args: [captchaText]
    });
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        return false;
    }
}

btnFill.addEventListener('click', async () => {
    btnFill.disabled = true;
    btnCopy.disabled = true;
    
    try {
        const captchaText = await recognizeCaptcha();
        await fillCaptcha(captchaText);
        setTimeout(() => {
            showStatus('CAPTCHA در فیلد قرار گرفت!', 'success');
        }, 500);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        btnFill.disabled = false;
        btnCopy.disabled = false;
    }
});

btnCopy.addEventListener('click', async () => {
    btnFill.disabled = true;
    btnCopy.disabled = true;
    
    try {
        const captchaText = await recognizeCaptcha();
        const copied = await copyToClipboard(captchaText);
        
        if (copied) {
            setTimeout(() => {
                showStatus('کد در کلیپ‌بورد کپی شد!', 'success');
            }, 500);
        } else {
            showStatus('خطا در کپی', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        btnFill.disabled = false;
        btnCopy.disabled = false;
    }
});

checkServer();