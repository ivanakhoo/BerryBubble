import express from 'express';
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./berrybubble-74a27-firebase-adminsdk-fbsvc-16a607accf.json', 'utf8'));

const app = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());

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

    console.log(`Successfully deleted ${deleteUsersResult.successCount} users from Authentication`);
    console.log(`Failed to delete ${deleteUsersResult.failureCount} users from Authentication`);
    
    if (deleteUsersResult.errors.length > 0) {
      deleteUsersResult.errors.forEach(err => {
        console.error(err.error.toJSON());
      });
    }

    res.status(200).send(`Successfully deleted ${deleteUsersResult.successCount} users from Authentication.`);
  } catch (error) {
    console.error('Error deleting users from Authentication:', error);
    res.status(500).send('Error deleting users from Authentication: ' + error.message);
  }
});

app.delete('/deleteUnverifiedUsersFromFirestore', async (req, res) => {
  try {
    const firestore = admin.firestore();
    const usersRef = firestore.collection('users'); 
    const snapshot = await usersRef.where('emailVerified', '==', false).get();

    if (snapshot.empty) {
      return res.status(404).send('No unverified users found in Firestore.');
    }

    const batch = firestore.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref); 
    });

    await batch.commit(); 

    res.status(200).send(`Successfully deleted ${snapshot.size} unverified users from Firestore.`);
  } catch (error) {
    console.error('Error deleting users from Firestore:', error);
    res.status(500).send('Error deleting users from Firestore: ' + error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
