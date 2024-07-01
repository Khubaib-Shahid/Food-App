import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, where, query, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js'

// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCim0CpcU2TW0uUEleQr5XntNZTr55YSmg",
  authDomain: "food-link-b14b0.firebaseapp.com",
  projectId: "food-link-b14b0",
  storageBucket: "food-link-b14b0.appspot.com",
  messagingSenderId: "579587934999",
  appId: "1:579587934999:web:e978856dfbb04c1aba8552",
  measurementId: "G-SN936R7VVY"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const querySnapshot = await getDocs(collection(db, "users"));
const auth = getAuth(app);
const storage = getStorage(app);


export { db, addDoc, collection, querySnapshot, auth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, getDocs, onAuthStateChanged, storage, ref, getDownloadURL, uploadBytesResumable, doc, updateDoc, where, query, getDoc, deleteDoc};