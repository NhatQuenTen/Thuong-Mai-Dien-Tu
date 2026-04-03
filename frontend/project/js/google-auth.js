/**
 * Google Authentication Module với Firebase Auth
 * Xử lý đăng nhập và đăng ký sử dụng Google Gmail qua Firebase
 *
 * Dependencies:
 * - firebase-config.js (phải tải trước)
 * - Firebase SDK (từ CDN hoặc npm)
 */

class GoogleAuthManager {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
    }

    /**
     * Khởi tạo Firebase Auth
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            // Firebase đã được khởi tạo trong firebase-config.js
            this.isInitialized = true;
            console.log(' Firebase Auth khởi tạo thành công');

            // Lắng nghe trạng thái auth thay đổi
            window.firebaseAuth.onAuthStateChanged((user) => {
                if (user) {
                    this.handleAuthStateChanged(user);
                } else {
                    this.currentUser = null;
                }
            });

            return true;
        } catch (error) {
            console.error(' Lỗi khởi tạo Firebase Auth:', error);
            return false;
        }
    }

    /**
     * Render Google Sign-In Button (sử dụng Firebase Auth)
     * @param {string} elementId - ID của element chứa nút
     * @param {string} mode - 'signin' hoặc 'signup' (chỉ để hiển thị, Firebase xử lý chung)
     * @returns {void}
     */
    renderSignInButton(elementId, mode = 'signin') {
        console.log(' Đang kết nối Google Sign-In handler cho element:', elementId);
        if (!this.isInitialized) {
            console.warn(' Firebase Auth chưa được khởi tạo');
            return;
        }

        const button = document.getElementById('googleSignInBtn');
        if (!button) {
            console.error(' Nút Google Sign-In với id googleSignInBtn không tồn tại');
            return;
        }

        button.addEventListener('click', () => this.signInWithGoogle());
        console.log(' Google Sign-In button đã liên kết sự kiện click');
    }

    /**
     * Đăng nhập bằng Google qua Firebase
     */
    async signInWithGoogle() {
        try {
            const result = await window.firebaseAuth.signInWithPopup(window.googleProvider);
            const user = result.user;
            console.log(' Đăng nhập Google thành công:', user);

            // Xử lý user data (lưu vào localStorage và Firebase nếu cần)
            await this.handleSignIn(user);
        } catch (error) {
            console.error(' Lỗi đăng nhập Google:', error);
            this.showError('Lỗi đăng nhập Google. Vui lòng thử lại.');
        }
    }

    /**
     * Xử lý đăng nhập thành công
     * @param {Object} user - User từ Firebase Auth
     */
    async handleSignIn(user) {
        try {
            // Lưu user vào localStorage (giữ nguyên logic cũ)
            const userData = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                phone: user.phoneNumber || '',
                avatar: user.photoURL || '',
                authProvider: 'google'
            };

            localStorage.setItem('currentUser', JSON.stringify(userData));
            this.currentUser = userData;

            this.showSuccess(' Đăng nhập thành công! Đang chuyển hướng...');

            setTimeout(() => {
                const redirect = localStorage.getItem('redirectAfterLogin') || 'index.html';
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirect;
            }, 1500);
        } catch (error) {
            console.error('❌ Lỗi xử lý user:', error);
            this.showError('Lỗi lưu dữ liệu. Vui lòng thử lại.');
        }
    }

    /**
     * Xử lý thay đổi trạng thái auth (từ Firebase)
     * @param {Object} user - User từ Firebase
     */
    handleAuthStateChanged(user) {
        if (user) {
            this.currentUser = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                phone: user.phoneNumber || '',
                avatar: user.photoURL || '',
                authProvider: 'google'
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
        }
    }

    /**
     * Đăng xuất
     */
    async logout() {
        try {
            await window.firebaseAuth.signOut();
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('googleUserData');
            this.currentUser = null;
            window.dispatchEvent(new CustomEvent('userLoggedOut'));
            console.log('✅ Đã đăng xuất');
        } catch (error) {
            console.error('❌ Lỗi đăng xuất:', error);
        }
    }

    /**
     * Lấy user hiện tại
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.currentUser || JSON.parse(localStorage.getItem('currentUser'));
    }

    /**
     * Kiểm tra đã đăng nhập
     * @returns {boolean}
     */
    isLoggedIn() {
        return !!window.firebaseAuth.currentUser || !!this.getCurrentUser();
    }

    /**
     * Hiển thị lỗi
     * @param {string} message
     */
    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.innerHTML = message;
            errorElement.style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
        } else {
            alert(message);
        }
    }

    /**
     * Hiển thị thành công
     * @param {string} message
     */
    showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        if (successElement) {
            successElement.innerHTML = message;
            successElement.style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';
        } else {
            alert(message);
        }
    }
}

// Tạo instance toàn cục
const googleAuth = new GoogleAuthManager();

// Khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', async () => {
    await googleAuth.initialize();
});
