// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuXYJide2ANt9J96I0SqdVQv7_1lg46H8",
  authDomain: "gaebooks-31fbe.firebaseapp.com",
  projectId: "gaebooks-31fbe",
  storageBucket: "gaebooks-31fbe.firebasestorage.app",
  messagingSenderId: "5831670682",
  appId: "1:5831670682:web:d764981db4750f406b1823",
  measurementId: "G-XT0QM2H35V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseConfig)

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  }),
});