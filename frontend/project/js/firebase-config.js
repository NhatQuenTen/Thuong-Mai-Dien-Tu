// Firebase Configuration
// Lấy từ Firebase Console - https://console.firebase.google.com

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDzQyH_VLOeuO8Q0bvuFVZ2uPPP9uShR6c",
    authDomain: "myteamproject-36c2f.firebaseapp.com",
    projectId: "myteamproject-36c2f",
    storageBucket: "myteamproject-36c2f.firebasestorage.app",
    messagingSenderId: "790145988623",
    appId: "1:790145988623:web:112b090cd32a4c28dd4b7a",
    measurementId: "G-H00T4Z2J73"
};

// Khởi tạo Firebase App (nếu chưa có)
if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
}

// Export Firebase Auth để sử dụng ở nơi khác (global)
window.firebaseAuth = firebase.auth();
window.googleProvider = new firebase.auth.GoogleAuthProvider();

// Cấu hình Google Provider (tùy chọn: thêm scope nếu cần)
window.googleProvider.setCustomParameters({
    prompt: 'select_account'
});
