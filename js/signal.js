const SignalApp = {
    mode: 'encrypt',
    async deriveKey(password, salt) {
        const enc = new TextEncoder();
        const km = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    },
    async encrypt(text, pw) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.deriveKey(pw, salt);
        const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text));
        const combined = new Uint8Array(salt.length + iv.length + ct.byteLength);
        combined.set(salt, 0); combined.set(iv, 16); combined.set(new Uint8Array(ct), 28);
        return btoa(String.fromCharCode(...combined));
    },
    async decrypt(b64, pw) {
        const data = new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)));
        const salt = data.slice(0, 16), iv = data.slice(16, 28), ct = data.slice(28);
        const key = await this.deriveKey(pw, salt);
        const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
        return new TextDecoder().decode(pt);
    },
    setMode(m) {
        this.mode = m;
        const slider = document.getElementById('sig-slider');
        const encBtn = document.getElementById('sig-enc-btn');
        const decBtn = document.getElementById('sig-dec-btn');
        const actBtn = document.getElementById('sig-action-btn');
        
        if (m === 'encrypt') {
            slider.className = 'mode-slider encrypt';
            encBtn.classList.add('active'); decBtn.classList.remove('active');
            actBtn.innerText = "تشفير النص";
            actBtn.className = "btn-main btn-primary";
        } else {
            slider.className = 'mode-slider decrypt';
            decBtn.classList.add('active'); encBtn.classList.remove('active');
            actBtn.innerText = "فك التشفير";
            actBtn.className = "btn-main btn-success";
        }
    },
    async process() {
        const text = document.getElementById('sig-text').value;
        const pw = document.getElementById('sig-key').value;
        if (!text || !pw) return alert("أدخل النص والمفتاح!");
        
        try {
            const res = this.mode === 'encrypt' ? await this.encrypt(text, pw) : await this.decrypt(text, pw);
            document.getElementById('sig-result').value = res;
        } catch (e) { alert("خطأ! تأكد من المفتاح."); }
    },
    copyResult() {
        const el = document.getElementById('sig-result');
        el.select(); document.execCommand('copy');
        alert("تم النسخ!");
    }
};
