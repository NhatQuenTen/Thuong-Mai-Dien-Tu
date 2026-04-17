// ========== PROFILE AREA UI MANAGEMENT ==========

document.addEventListener("DOMContentLoaded", () => {
    setupProfileArea();
});

function setupProfileArea() {
    const profileArea = document.querySelector(".profile-area");
    if (!profileArea) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const profileTrigger = profileArea.querySelector(".profile-trigger");
    const profileDropdown = profileArea.querySelector(".profile-dropdown");
    const profileName = profileArea.querySelector(".profile-name");
    const profileAvatar = profileArea.querySelector(".profile-avatar");
    const loginBtn = profileArea.querySelector(".login-btn");
    const logoutBtn = profileArea.querySelector(".logout-btn");

    // Check login status and update UI
    if (currentUser) {
        // User is logged in
        profileName.textContent = currentUser.displayName || currentUser.fullName || currentUser.name || "User";
        profileName.style.display = "block";
        profileTrigger.style.display = "flex";
        profileDropdown.style.display = "none";
        loginBtn.style.display = "none";

        // Update avatar if available
        if (currentUser.avatar) {
            profileAvatar.src = currentUser.avatar;
        } else {
            const userName = currentUser.displayName || currentUser.fullName || currentUser.name || "User";
            profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=b7791f&color=fff&size=40&rounded=true`;
        }

        // Setup dropdown toggle
        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener("click", (e) => {
                e.stopPropagation();
                profileTrigger.classList.toggle("active");
                profileDropdown.style.display = profileDropdown.style.display === "none" ? "block" : "none";
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", (e) => {
                if (!profileArea.contains(e.target)) {
                    profileTrigger.classList.remove("active");
                    profileDropdown.style.display = "none";
                }
            });
        }

        // Setup logout
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
                    localStorage.removeItem("currentUser");
                    window.location.href = "index.html";
                }
            });
        }
    } else {
        // User is not logged in
        profileName.style.display = "none";
        profileTrigger.style.display = "none";
        profileDropdown.style.display = "none";
        loginBtn.style.display = "block";

        // Setup trigger to redirect to login
        if (profileTrigger) {
            profileTrigger.addEventListener("click", () => {
                window.location.href = "signin.html";
            });
        }
    }
}
