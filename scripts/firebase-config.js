/**
 * Firebase Configuration & Authentication
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    setPersistence,
    browserLocalPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { 
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// 🛠️ FIX: Force Local Persistence (هذا يحل مشكلة الخروج المتكرر)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("✅ Session persistence set to LOCAL");
    })
    .catch((error) => {
        console.error("❌ Persistence error:", error);
    });

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { 
    auth, 
    db, 
    googleProvider, 
    facebookProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    doc,
    setDoc,
    serverTimestamp
};
