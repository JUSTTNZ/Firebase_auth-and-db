// Firebase imports
import { initializeApp } from "firebase/app"; // Initializes Firebase App
import { getAuth } from "firebase/auth"; // Handles user authentication
import { getFirestore } from "firebase/firestore"; // Firestore for database operations

// Firebase app configuration
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

// Export services for reuse
export const auth = getAuth(app);
export const db = getFirestore(app);

import React, { useState } from "react";
import { auth } from "./firebaseConfig"; // Firebase authentication service
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"; // Firebase methods for authentication

const Auth = () => {
  const [user, setUser] = useState(null);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Set logged-in user details
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state on logout
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}
    </div>
  );
};

export default Auth;



import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore"; // Firebase Firestore methods
import { db, auth } from "./firebaseConfig"; // Firebase services

const ChatList = ({ onSelectChat }) => {
  const [groups, setGroups] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);

  useEffect(() => {
    // Fetch group chats
    const groupQuery = collection(db, "groups");
    const unsubscribeGroups = onSnapshot(groupQuery, (snapshot) => {
      setGroups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch private chats
    const privateChatQuery = collection(db, "privateChats");
    const unsubscribePrivateChats = onSnapshot(privateChatQuery, (snapshot) => {
      const filteredChats = snapshot.docs.filter((doc) =>
        doc.data().members.includes(auth.currentUser?.uid)
      );
      setPrivateChats(filteredChats.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeGroups();
      unsubscribePrivateChats();
    };
  }, []);

  return (
    <div className="chat-list">
      <h3>Group Chats</h3>
      {groups.map((group) => (
        <div key={group.id} onClick={() => onSelectChat(group.id, "group")}>
          {group.name}
        </div>
      ))}

      <h3>Private Chats</h3>
      {privateChats.map((chat) => (
        <div key={chat.id} onClick={() => onSelectChat(chat.id, "private")}>
          {chat.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;



import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"; // Firestore methods
import { db } from "./firebaseConfig"; // Firebase service

const ChatMessages = ({ chatId, chatType }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      where("chatType", "==", chatType),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId, chatType]);

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.senderId === auth.currentUser.uid ? "sent" : "received"}`}>
          <p><strong>{message.senderName}</strong>: {message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;


import React, { useState } from "react";
import Auth from "./Auth";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatType, setChatType] = useState(null);

  const handleSelectChat = (chatId, type) => {
    setSelectedChat(chatId);
    setChatType(type);
  };

  return (
    <div className="chat-app">
      <Auth />
      <ChatList onSelectChat={handleSelectChat} />
      {selectedChat && <ChatMessages chatId={selectedChat} chatType={chatType} />}
    </div>
  );
};

export default ChatApp;



