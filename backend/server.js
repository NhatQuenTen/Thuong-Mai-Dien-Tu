const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { deleteUserCompletely } = require('./import-users');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://myteamproject-36c2f-default-rtdb.firebaseio.com'
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to delete user completely
app.delete('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ error: 'User UID is required' });
    }

    console.log(`🗑️ API request to delete user: ${uid}`);

    const result = await deleteUserCompletely(uid);

    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(500).json({ error: result.message });
    }

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   DELETE /api/users/:uid - Delete user completely`);
  console.log(`   GET /api/health - Health check`);
});