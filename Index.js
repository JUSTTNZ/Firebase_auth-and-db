// firebase.js
import firebase from "firebase/app";
import "firebase/auth";  // For Authentication
import "firebase/firestore";  // For Firestore

// Firebase config details (replace with your Firebase project config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Firebase Auth and Firestore services
const auth = firebaseApp.auth();
const db = firebaseApp.firestore();

export { auth, db };
// SignUp.js
import React, { useState } from "react";
import { auth, db } from "./firebase"; // Import the Firebase services

const SignUp = () => {
  // Local state to store the input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();  // Prevent page refresh

    try {
      // Create a new user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update the user's display name
      await user.updateProfile({
        displayName: name,
      });

      // Store user info in Firestore
      await db.collection("users").doc(user.uid).set({
        name: name,
        email: email
      });

      console.log("User signed up and profile created in Firestore:", user);
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};
export default SignUp; 

// SignIn.js
import React, { useState } from "react";
import { auth } from "./firebase"; // Import Firebase auth service

const SignIn = () => {
  // Local state to store email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle sign-in form submission
  const handleSignIn = async (e) => {
    e.preventDefault();  // Prevent page refresh

    try {
      // Sign in the user with email and password
      await auth.signInWithEmailAndPassword(email, password);
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;

// UserProfile.js
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase"; // Import Firebase services

const UserProfile = () => {
  // Local state for storing the user profile data
  const [user, setUser] = useState(null);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // Get user details from Firebase Authentication
        setUser({
          name: currentUser.displayName,
          email: currentUser.email
        });

        // Optionally, fetch user data from Firestore (for example)
        const userDoc = await db.collection("users").doc(currentUser.uid).get();
        if (userDoc.exists) {
          console.log("User data from Firestore:", userDoc.data());
        }
      } else {
        setUser(null);  // Set user to null if no user is signed in
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <p>No user logged in.</p>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default UserProfile;


// UpdateProfile.js
import React, { useState } from "react";
import { auth, db } from "./firebase"; // Import Firebase services

const UpdateProfile = () => {
  // Local state for user input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Handle profile update
  const handleUpdateProfile = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Update display name in Firebase Authentication
        await currentUser.updateProfile({
          displayName: name,
        });

        // Update email in Firebase Authentication
        if (email) {
          await currentUser.updateEmail(email);
        }

        // Update Firestore document
        await db.collection("users").doc(currentUser.uid).update({
          name: name,
          email: email,
        });

        console.log("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error.message);
      }
    } else {
      console.log("No user signed in");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Update Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Update Email"
      />
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default UpdateProfile;


// SignOut.js
import React from "react";
import { auth } from "./firebase"; // Import Firebase auth service

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();  // Sign out the current user
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default SignOut;


// with destructuring 

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config details (replace with your Firebase project config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth and Firestore services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


// SignUp.js
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
      });

      console.log("User signed up and profile created");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;


// SignIn.js
import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;


// UserProfile.js
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          userData: userDoc.exists() ? userDoc.data() : {},
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <p>No user logged in.</p>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Additional Data:</strong> {JSON.stringify(user.userData)}</p>
    </div>
  );
};

export default UserProfile;


// UpdateProfile.js
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleUpdateProfile = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Update name in Firebase Authentication
        await updateProfile(currentUser, { displayName: name });

        // Update email in Firebase Authentication
        if (email) {
          await updateEmail(currentUser, email);
        }

        // Update Firestore document
        await updateDoc(doc(db, "users", currentUser.uid), {
          name: name,
          email: email,
        });

        console.log("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error.message);
      }
    } else {
      console.log("No user signed in");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Update Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Update Email"
      />
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default UpdateProfile;

// SignOut.js
import React from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Log out the current user
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default SignOut;


