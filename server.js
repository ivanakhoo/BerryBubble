import express from 'express';
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./berrybubble-74a27-firebase-adminsdk-fbsvc-16a607accf.json', 'utf8'));
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware to parse JSON requests
app.use(express.json());

// Route to delete users with emailVerified = false
app.delete('/deleteUnverifiedUsers', async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const unverifiedUids = listUsersResult.users
      .filter(user => !user.emailVerified)
      .map(user => user.uid);

    if (unverifiedUids.length === 0) {
      return res.status(404).send('No unverified users found.');
    }

    const deleteUsersResult = await admin.auth().deleteUsers(unverifiedUids);

    console.log(`Successfully deleted ${deleteUsersResult.successCount} users`);
    console.log(`Failed to delete ${deleteUsersResult.failureCount} users`);
    
    if (deleteUsersResult.errors.length > 0) {
      deleteUsersResult.errors.forEach(err => {
        console.error(err.error.toJSON());
      });
    }

    res.status(200).send(`Successfully deleted ${deleteUsersResult.successCount} users.`);
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).send('Error deleting users: ' + error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
