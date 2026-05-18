const SentinelApp = {
    rules: [
        { name: 'SQL Injection', severity: 'critical', pattern: /SELECT.*FROM|UNION.*SELECT|DROP\s+TABLE/i },
        { name: 'XSS Attack', severity: 'high', pattern: /<script>|innerHTML|alert\(/i },
        { name: 'RCE Command', severity: 'critical', pattern: /system\(|exec\(|shell_exec\(/i },
        { name: 'IDOR / Access', severity: 'medium', pattern: /req\.params|$_GET/i }
    ],
    loadDemo() {
        document.getElementById('sen-input').value = `<?php\n$id = $_GET['id'];\n$query = "SELECT * FROM users WHERE id=$id";\n$res = mysql_query($query);\n\necho "<script>alert('hacked');</script>";\n?>`;
    },
    async analyze() {
        const code = document.getElementById('sen-input').value;
        const resBox = document.getElementById('sen-results');
        if (!code) return alert("أدخل الكود!");

        resBox.innerHTML = '<p class="text-center animate-pulse">جاري الفحص...</p>';
        
        await new Promise(r => setTimeout(r, 1500));
        
        let found = [];
        this.rules.forEach(rule => {
            if (rule.pattern.test(code)) found.push(rule);
        });

        resBox.innerHTML = '';
        if (found.length === 0) {
            resBox.innerHTML = '<p class="text-green-500 text-center mt-10">✓ لم يتم اكتشاف ثغرات!</p>';
        } else {
            found.forEach(f => {
                const div = document.createElement('div');
                div.className = `vuln-card vuln-${f.severity}`;
                div.innerHTML = `<strong>${f.name}</strong><br><span class="text-xs opacity-50">Severity: ${f.severity}</span>`;
                resBox.appendChild(div);
            });
        }
    },
    resetScanner() {
        document.getElementById('sen-input').value = '';
        document.getElementById('sen-results').innerHTML = '<p class="text-gray-600 text-center mt-20">بانتظار الكود...</p>';
    }
};
