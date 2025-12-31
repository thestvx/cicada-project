/**
 * Firebase Configuration & Authentication
 */

// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
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
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { 
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
let app;
let analytics;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

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
