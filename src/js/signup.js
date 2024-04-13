const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

// Optional: Initialize Analytics
// const analytics = getAnalytics(app);

const auth = getAuth(app);

/**
 * Signup function that creates a new user account using Firebase Authentication.
 * @param {Event} e - The submit event from the signup form.
 */
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log('User created:', user);
            // Redirect or inform of success
            window.location.href = './html/home.html';
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('error-message').innerText = errorMessage;
        });
});