// Firebase Imports
import { initializeApp } from "firebase/app"; // Initializes the Firebase App
import { getAuth } from "firebase/auth"; // Firebase Authentication service
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"; // Google authentication and sign-out methods
import { getFirestore, collection, onSnapshot, query, where, orderBy } from "firebase/firestore"; // Firestore methods

// 1. **`initializeApp`**
// Initializes the Firebase app with the provided configuration.
// It connects your app to Firebase services.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initializing Firebase with the provided config
const app = initializeApp(firebaseConfig); // This starts the Firebase services for the app

// 2. **`getAuth`**
// Initializes Firebase Authentication and returns the authentication service.
// It is used to manage users' sign-in, sign-out, and user state.
const auth = getAuth(app);

// 3. **`GoogleAuthProvider`**
// This is used to configure Google as a provider for Firebase Authentication.
// Allows users to sign in using their Google account.
const provider = new GoogleAuthProvider(); 

// 4. **`signInWithPopup`**
// A method that handles the sign-in flow with a Google account using a pop-up window.
// The user will authenticate and the result will be returned.
const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider); // Open the popup to sign in with Google
    const user = result.user; // The authenticated user
    console.log(user); // Logging the authenticated user details
  } catch (error) {
    console.error("Error signing in:", error.message); // If there's an error
  }
};

// 5. **`signOut`**
// Logs the current user out of the app and clears their session.
const logout = async () => {
  try {
    await signOut(auth); // Logs the user out
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error.message); // If there's an error
  }
};

// 6. **`getFirestore`**
// Initializes Firestore (Firebase's NoSQL database) and provides methods to interact with it.
// It allows you to read, write, and query data from Firebase.
const db = getFirestore(app); // This allows us to interact with Firestore

// 7. **`collection`**
// Retrieves a reference to a specific Firestore collection.
// A collection is like a table in a database where related documents are stored.
const groupsCollection = collection(db, "groups"); // Reference to the 'groups' collection in Firestore
const messagesCollection = collection(db, "messages"); // Reference to the 'messages' collection in Firestore

// 8. **`onSnapshot`**
// A method used to listen for real-time updates to a collection or document in Firestore.
// Every time the data changes, the callback function will be triggered.
const unsubscribe = onSnapshot(groupsCollection, (snapshot) => {
  // Whenever the 'groups' collection changes, this code runs
  snapshot.docs.forEach(doc => {
    console.log(doc.data()); // Log the data for each group
  });
});

// 9. **`query`**
// This is used to create a query to filter Firestore documents based on certain conditions.
// For example, fetching messages in a specific chat or group.
const messagesQuery = query(
  messagesCollection,
  where("chatId", "==", "someChatId"), // Filter messages by chatId
  orderBy("timestamp", "asc") // Order messages by timestamp in ascending order
);

// 10. **`where`**
// A method used in Firestore queries to filter documents based on field values.
// In this case, it filters messages where the `chatId` is equal to a given ID.
const filteredMessages = query(
  messagesCollection,
  where("chatId", "==", "specificChatId") // Fetch only messages in the selected chat
);

// 11. **`orderBy`**
// A method used in Firestore queries to order documents by a specific field.
// It's often used to order messages by timestamp (ascending or descending).
const orderedMessages = query(
  messagesCollection,
  orderBy("timestamp", "asc") // Order messages by timestamp in ascending order
);

// **Summary of Methods and Their Usage in the Chat App:**
// 1. `initializeApp`: Initializes Firebase services.
// 2. `getAuth`: Retrieves the authentication service to manage users.
// 3. `GoogleAuthProvider`: Google authentication provider for Firebase Authentication.
// 4. `signInWithPopup`: Used for Google sign-in via a pop-up window.
// 5. `signOut`: Logs out the current authenticated user.
// 6. `getFirestore`: Initializes Firestore to manage app's data storage.
// 7. `collection`: Fetches a reference to a Firestore collection (like 'groups' or 'messages').
// 8. `onSnapshot`: Real-time listener that triggers a callback on data changes.
// 9. `query`: Used to create complex Firestore queries to filter or order documents.
// 10. `where`: Adds conditions to Firestore queries to filter documents.
// 11. `orderBy`: Orders Firestore query results by specific fields (e.g., timestamp).