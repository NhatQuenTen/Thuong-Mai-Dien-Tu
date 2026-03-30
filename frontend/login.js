// ============================================
// MobiStore Login Page - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTogglePassword();
    initLoginForm();
    initDemoLogin();
    initRippleEffect();
});

// ============================================
// TOGGLE PASSWORD VISIBILITY
// ============================================
function initTogglePassword() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');

    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleBtn.innerHTML = isPassword
            ? '<i class="fas fa-eye-slash"></i>'
            : '<i class="fas fa-eye"></i>';
    });
}

// ============================================
// LOGIN FORM VALIDATION & SUBMIT
// ============================================
function initLoginForm() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const emailGroup = document.getElementById('emailGroup');
    const passwordGroup = document.getElementById('passwordGroup');
    const loginBtn = document.getElementById('loginBtn');

    // Clear error on focus
    emailInput.addEventListener('focus', () => clearError(emailGroup, emailError));
    passwordInput.addEventListener('focus', () => clearError(passwordGroup, passwordError));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset errors
        clearError(emailGroup, emailError);
        clearError(passwordGroup, passwordError);

        let hasError = false;

        // Validate email
        const email = emailInput.value.trim();
        if (!email) {
            showError(emailGroup, emailError, 'Vui lòng nhập email hoặc tên đăng nhập');
            hasError = true;
        } else if (email.includes('@') && !isValidEmail(email)) {
            showError(emailGroup, emailError, 'Định dạng email không hợp lệ');
            hasError = true;
        }

        // Validate password
        const password = passwordInput.value;
        if (!password) {
            showError(passwordGroup, passwordError, 'Vui lòng nhập mật khẩu');
            hasError = true;
        } else if (password.length < 6) {
            showError(passwordGroup, passwordError, 'Mật khẩu phải có ít nhất 6 ký tự');
            hasError = true;
        }

        if (hasError) return;

        // Simulate login
        await performLogin(loginBtn, email, password);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(group, errorEl, message) {
    group.classList.add('error', 'shake');
    errorEl.textContent = message;
    errorEl.classList.add('visible');

    setTimeout(() => group.classList.remove('shake'), 400);
}

function clearError(group, errorEl) {
    group.classList.remove('error');
    errorEl.classList.remove('visible');
    errorEl.textContent = '';
}

async function performLogin(btn, email, password) {
    // Show loading
    btn.classList.add('loading');

    // Simulate API call
    await delay(1800);

    // Demo credentials check
    const validCredentials = [
        { email: 'admin@mobistore.vn', password: 'admin123' },
        { email: 'admin', password: 'admin123' },
        { email: 'demo', password: 'demo123' }
    ];

    const isValid = validCredentials.some(
        cred => cred.email === email && cred.password === password
    );

    if (isValid || email === 'demo') {
        // Success
        btn.classList.remove('loading');
        btn.classList.add('success');

        // Store login state
        const rememberMe = document.getElementById('rememberCheckbox').checked;
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('mobistore_auth', JSON.stringify({
            user: email,
            loginTime: new Date().toISOString(),
            token: 'demo-token-' + Date.now()
        }));

        await delay(800);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Failed
        btn.classList.remove('loading');

        const emailGroup = document.getElementById('emailGroup');
        const passwordError = document.getElementById('passwordError');
        const passwordGroup = document.getElementById('passwordGroup');

        showError(passwordGroup, passwordError, 'Email hoặc mật khẩu không đúng. Thử: admin / admin123');
    }
}

// ============================================
// DEMO LOGIN
// ============================================
function initDemoLogin() {
    const demoBtn = document.getElementById('demoLoginBtn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');

    demoBtn.addEventListener('click', async () => {
        // Animate typing effect
        emailInput.value = '';
        passwordInput.value = '';

        const demoEmail = 'admin@mobistore.vn';
        const demoPassword = 'admin123';

        // Type email
        emailInput.focus();
        for (let i = 0; i < demoEmail.length; i++) {
            emailInput.value += demoEmail[i];
            emailInput.dispatchEvent(new Event('input'));
            await delay(40 + Math.random() * 30);
        }

        await delay(300);

        // Type password
        passwordInput.focus();
        for (let i = 0; i < demoPassword.length; i++) {
            passwordInput.value += demoPassword[i];
            passwordInput.dispatchEvent(new Event('input'));
            await delay(50 + Math.random() * 40);
        }

        await delay(400);

        // Submit
        loginBtn.click();
    });
}

// ============================================
// RIPPLE EFFECT ON LOGIN BUTTON
// ============================================
function initRippleEffect() {
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
}

// ============================================
// UTILITY
// ============================================
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// CHECK AUTH ON DASHBOARD (helper)
// ============================================
// Add this to dashboard.js to protect the dashboard page:
// function checkAuth() {
//     const auth = localStorage.getItem('mobistore_auth') || sessionStorage.getItem('mobistore_auth');
//     if (!auth) {
//         window.location.href = 'login.html';
//     }
// }
