# Berry Bubble CS Platform
The goal of this project is to create a networking platform for Berry College Computer Science students and alumni to showcase their work, portfolios, LinkedIn profiles, and resumes, while fostering connections within the community. As the CS program at Berry College continues to expand, this platform will highlight the dedication, creativity, and achievements of its members, promoting a sense of unity and collaboration.

By bringing together the accomplishments and experiences of both current students and alumni, the platform will serve as a source of inspiration and a valuable resource. It is my hope that this resource will encourage students to push their boundaries, innovate, and grow.

Ultimately, the platform aims to bridge the gap between students and alumni, facilitating meaningful connections that offer insights, guidance, and opportunities to support their career journeys in Computer Science.

## Technologies Used

- `ReactJS`
- `TypeScript`
- `JavaScript`
- `Firebase`
- `Cloudinary`

## TODO

### Bug Fixes
- Take away Admin rendering for first loadup of site

### UI/UX
- Create projects url and picture upload
    - Projects have url, picture, brief summary, and technologies
- Expand the details page to show projects
- Make details page more clean
- Make dashboard user cards show project summary
- Get main dashboards to show rows of users
- Make a report user button for each card that sends notification to admin-only center
- Light and dark mode switch
- Expand search bar to work with gradyear

### Verification:
- Find a way to delete users who have not been verified for 3 days


const admin = require("firebase-admin");

const serviceAccount = require("./path-to-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore(); // Firestore instance

async function deleteUnverifiedUsers() {
  try {
    const listUsersResult = await auth.listUsers(1000); // Fetch up to 1000 users

    const usersToDelete = listUsersResult.users.filter(user => !user.emailVerified);

    if (usersToDelete.length === 0) {
      console.log("No unverified users found.");
      return;
    }

    // Delete users from Firebase Authentication
    const userUIDs = usersToDelete.map(user => user.uid);
    await auth.deleteUsers(userUIDs);
    console.log(`Deleted ${userUIDs.length} unverified users.`);

    // Delete corresponding Firestore documents
    const deletePromises = userUIDs.map(uid => db.collection("users").doc(uid).delete());
    await Promise.all(deletePromises);
    console.log(`Deleted ${userUIDs.length} user documents from Firestore.`);
  } catch (error) {
    console.error("Error deleting users and documents:", error);
  }
}

module.exports = deleteUnverifiedUsers;
