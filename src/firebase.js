import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};