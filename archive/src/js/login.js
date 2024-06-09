const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBW45aUJ4Xt3NaCe9YXWwA-AGee80A8gpY",
  authDomain: "sonic-platform-264510.firebaseapp.com",
  databaseURL: "https://sonic-platform-264510-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sonic-platform-264510",
  storageBucket: "sonic-platform-264510.appspot.com",
  messagingSenderId: "503406174799",
  appId: "1:503406174799:web:aa483e374c6ebdfe42003a",
  measurementId: "G-TSGBM850X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { writeUserData } from './db.js';

/**
 * Logs in a user using Firebase Authentication.
 */
export function loginUser() {
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Login successful
      console.log("Logged in as:", userCredential.user);
      writeUserData('userId', 'John Doe', email, 'imageURL');
      // Redirect to home.html
      window.location.href = './html/home.html';
    })
    .catch((error) => {
      console.error("Error logging in:", error.message);
      alert("Failed to login: " + error.message);
    });
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submit action
  loginUser();
  
});

  