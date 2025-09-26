// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBin8q9AYENaq5Up3v90jKQbrtV2zIwQwU",
    authDomain: "space-repetition-7a29e.firebaseapp.com",
    projectId: "space-repetition-7a29e",
    storageBucket: "space-repetition-7a29e.firebasestorage.app",
    messagingSenderId: "40672936283",
    appId: "1:40672936283:web:c19512816f040c41771a7e",
    measurementId: "G-37HBQBJ1LZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const TimestampLib = Timestamp;

// try to enable offline persistence (optional)
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("IndexedDb persistence failed:", err);
});
