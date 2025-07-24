// firebase-app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzzszzPyK70p8KIc1KIS4JRLHzxVpyTPE",
  authDomain: "projectmanagementapp-16cc3.firebaseapp.com",
  projectId: "projectmanagementapp-16cc3",
  storageBucket: "projectmanagementapp-16cc3.firebasestorage.app",
  messagingSenderId: "803008521708",
  appId: "1:803008521708:web:3fef5d3ffa7aef65b4ccc9",
  measurementId: "G-1VV8NBD9NF"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };