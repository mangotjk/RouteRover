/**
 * Import the necessary functions from the Firebase SDKs.
 */
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/**
 * Firebase configuration object for initializing Firebase app.
 * @type {Object}
 */
const firebaseConfig = {
  apiKey: "AIzaSyBW45aUJ4Xt3NaCe9YXWwA-AGee80A8gpY",
  authDomain: "sonic-platform-264510.firebaseapp.com",
  projectId: "sonic-platform-264510",
  storageBucket: "sonic-platform-264510.appspot.com",
  messagingSenderId: "503406174799",
  appId: "1:503406174799:web:aa483e374c6ebdfe42003a",
  measurementId: "G-TSGBM850X1"
};
