/**
 * Google Authentication Module
 * Xử lý đăng nhập và đăng ký sử dụng Google Gmail
 * 
 * Dependencies:
 * - google-auth-config.js (phải tải trước)
 */

class GoogleAuthManager {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
    }

    /**
     * Khởi tạo Google Authentication
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            // Tải Google Script
            await loadGoogleScript();
            
            // Kiểm tra Client ID có được cấu hình chưa
            if (!GOOGLE_AUTH_CONFIG.CLIENT_ID || GOOGLE_AUTH_CONFIG.CLIENT_ID === '0') {
                console.warn('⚠️ Google Client ID chưa được cấu hình. Vui lòng cập nhật google-auth-config.js');
                return false;
            }

            this.isInitialized = true;
            console.log('✅ Google Authentication khởi tạo thành công');
            return true;
        } catch (error) {
            console.error('❌ Lỗi khởi tạo Google Auth:', error);
            return false;
        }
    }

    /**
     * Render Google Sign-In Button
     * @param {string} elementId - ID của element chứa nút
     * @param {string} mode - 'signin' hoặc 'signup'
     * @returns {void}
     */
    renderSignInButton(elementId, mode = 'signin') {
        if (!this.isInitialized || !GOOGLE_AUTH_CONFIG.CLIENT_ID || GOOGLE_AUTH_CONFIG.CLIENT_ID === '0') {
            console.warn('⚠️ Google Auth chưa được khởi tạo hoặc Client ID chưa cấu hình');
            return;
        }

        if (!window.google || !window.google.accounts) {
            console.error('❌ Google API không sẵn sàng');
            return;
        }

        try {
            google.accounts.id.initialize({
                client_id: GOOGLE_AUTH_CONFIG.CLIENT_ID,
                callback: (response) => this.handleCredentialResponse(response, mode)
            });

            google.accounts.id.renderButton(
                document.getElementById(elementId),
                {
                    theme: 'outline',
                    size: 'large',
                    width: '100%',
                    text: mode === 'signin' ? 'signin_with' : 'signup_with'
                }
            );
        } catch (error) {
            console.error('❌ Lỗi render Google Button:', error);
        }
    }

    /**
     * Xử lý phản hồi từ Google Sign-In
     * @param {Object} response - JWT Token từ Google
     * @param {string} mode - 'signin' hoặc 'signup'
     */
    async handleCredentialResponse(response, mode = 'signin') {
        try {
            // Giải mã JWT Token
            const userData = this.parseJwt(response.credential);
            console.log('👤 Dữ liệu người dùng từ Google:', userData);

            if (mode === 'signin') {
                await this.handleSignIn(userData);
            } else if (mode === 'signup') {
                await this.handleSignUp(userData);
            }
        } catch (error) {
            console.error('❌ Lỗi xử lý phản hồi Google:', error);
            this.showError('Lỗi xác thực Google. Vui lòng thử lại.');
        }
    }

    /**
     * Xử lý đăng nhập bằng Google
     * @param {Object} userData - Dữ liệu người dùng từ Google
     */
    async handleSignIn(userData) {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Tìm user dựa theo email Google
            const existingUser = users.find(u => u.email === userData.email);

            if (existingUser) {
                // Đăng nhập thành công
                this.setCurrentUser(existingUser);
                this.showSuccess('✅ Đăng nhập thành công! Đang chuyển hướng...');
                
                setTimeout(() => {
                    const redirect = localStorage.getItem('redirectAfterLogin') || 'index.html';
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirect;
                }, 1500);
            } else {
                // User không tồn tại, yêu cầu đăng ký
                this.showError('📧 Email này chưa được đăng ký. Vui lòng đăng ký tài khoản mới.');
                
                // Lưu dữ liệu tạm thời để chuyển sang trang đăng ký
                sessionStorage.setItem('googleUserData', JSON.stringify(userData));
            }
        } catch (error) {
            console.error('❌ Lỗi đăng nhập Google:', error);
            this.showError('Lỗi đăng nhập. Vui lòng thử lại.');
        }
    }

    /**
     * Xử lý đăng ký bằng Google
     * @param {Object} userData - Dữ liệu người dùng từ Google
     */
    async handleSignUp(userData) {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Kiểm tra email đã tồn tại chưa
            if (users.find(u => u.email === userData.email)) {
                this.showError('📧 Email này đã được đăng ký! Vui lòng đăng nhập hoặc dùng email khác.');
                return;
            }

            // Tạo user mới từ dữ liệu Google
            const newUser = {
                id: 'user_' + Date.now(),
                name: userData.name,
                email: userData.email,
                phone: '', // Không có phone từ Google
                password: 'google-auth-' + userData.sub, // ID duy nhất từ Google
                avatar: userData.picture || '',
                createdAt: new Date().toISOString(),
                authProvider: 'google'
            };

            // Thêm user vào danh sách
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Đăng nhập tự động
            this.setCurrentUser(newUser);
            this.showSuccess('✅ Đăng ký thành công! Đang chuyển hướng...');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            console.error('❌ Lỗi đăng ký Google:', error);
            this.showError('Lỗi đăng ký. Vui lòng thử lại.');
        }
    }

    /**
     * Lưu user hiện tại vào localStorage
     * @param {Object} user - Dữ liệu người dùng
     */
    setCurrentUser(user) {
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            avatar: user.avatar || '',
            authProvider: user.authProvider || 'local'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUser = currentUser;
        
        // Phát sự kiện user đã đăng nhập
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: currentUser }));
    }

    /**
     * Lấy user hiện tại
     * @returns {Object|null}
     */
    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    /**
     * Đăng xuất
     */
    logout() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('googleUserData');
        this.currentUser = null;
        
        // Phát sự kiện user đã đăng xuất
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        
        console.log('✅ Đã đăng xuất');
    }

    /**
     * Giải mã JWT Token từ Google
     * @param {string} token - JWT Token
     * @returns {Object} Dữ liệu người dùng
     */
    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    }

    /**
     * Hiển thị thông báo lỗi
     * @param {string} message - Nội dung thông báo
     */
    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.innerHTML = message;
            errorElement.style.display = 'block';
            
            const successElement = document.getElementById('successMessage');
            if (successElement) {
                successElement.style.display = 'none';
            }
        } else {
            alert(message);
        }
    }

    /**
     * Hiển thị thông báo thành công
     * @param {string} message - Nội dung thông báo
     */
    showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        if (successElement) {
            successElement.innerHTML = message;
            successElement.style.display = 'block';
            
            const errorElement = document.getElementById('errorMessage');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        } else {
            alert(message);
        }
    }

    /**
     * Kiểm tra user đã đăng nhập hay chưa
     * @returns {boolean}
     */
    isLoggedIn() {
        return !!this.getCurrentUser();
    }
}

// Tạo instance toàn cục
const googleAuth = new GoogleAuthManager();

/**
 * Khởi tạo Google Auth khi DOM sẵn sàng
 */
document.addEventListener('DOMContentLoaded', async () => {
    await googleAuth.initialize();
});
