const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://myteamproject-36c2f-default-rtdb.firebaseio.com'
});

const db = admin.firestore();
const auth = admin.auth();

async function importUsersFromAuth() {
  try {
    console.log('🚀 Bắt đầu import users từ Firebase Auth...');

    // Get all users from Auth (max 1000 per batch)
    let users = [];
    let nextPageToken;

    do {
      const listUsersResult = await auth.listUsers(1000, nextPageToken);
      users = users.concat(listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    console.log(`📊 Tìm thấy ${users.length} users trong Auth`);

    let imported = 0;
    let skipped = 0;

    for (const user of users) {
      try {
        // Check if user already exists in Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
          // Import user to Firestore
          await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            displayName: user.displayName || user.email.split('@')[0],
            email: user.email,
            phone: user.phoneNumber || '',
            role: 'user',
            authProvider: user.providerData.length > 0 ? user.providerData[0].providerId.split('.')[0] : 'email',
            createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
            updatedAt: new Date()
          });

          imported++;
          console.log(`✅ Imported: ${user.email}`);
        } else {
          skipped++;
          console.log(`⏭️ Skipped (already exists): ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error importing ${user.email}:`, error.message);
      }
    }

    console.log(`\n🎉 Hoàn thành!`);
    console.log(`📥 Đã import: ${imported} users`);
    console.log(`⏭️ Đã bỏ qua: ${skipped} users`);

  } catch (error) {
    console.error('❌ Lỗi import:', error);
  }
}

// Delete user from both Auth and Firestore
async function deleteUserCompletely(uid) {
  try {
    console.log(`🗑️ Bắt đầu xóa user ${uid}...`);

    // Delete from Firestore
    await db.collection('users').doc(uid).delete();
    console.log(`✅ Đã xóa từ Firestore`);

    // Delete from Auth
    await auth.deleteUser(uid);
    console.log(`✅ Đã xóa từ Firebase Auth`);

    console.log(`🎉 User ${uid} đã được xóa hoàn toàn!`);
    return { success: true, message: `User ${uid} deleted successfully` };

  } catch (error) {
    console.error(`❌ Lỗi xóa user ${uid}:`, error);
    return { success: false, message: error.message };
  }
}

module.exports = { deleteUserCompletely };