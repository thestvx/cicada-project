/**
 * Firebase Configuration & Authentication
 */

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCJNrIQ3JbDAufK9cju11IoneXPMVVWf0",
    authDomain: "cicada-project-9f28b.firebaseapp.com",
    projectId: "cicada-project-9f28b",
    storageBucket: "cicada-project-9f28b.firebasestorage.app",
    messagingSenderId: "419871694470",
    appId: "1:419871694470:web:e765f74e23868d35647b07",
    measurementId: "G-2ZJ2L8NSMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Facebook Provider
const facebookProvider = new FacebookAuthProvider();

// Export for use in other files
export { 
    auth, 
    db,
    googleProvider,
    facebookProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
};
