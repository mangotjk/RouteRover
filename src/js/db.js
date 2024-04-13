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

import { getDatabase } from "firebase/database";

const database = getDatabase();
import { getDatabase, ref, set } from "firebase/database";

/**
 * Writes user data to the Firebase Realtime Database.
 * @param {string} userId - The user's ID.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} imageUrl - The URL of the user's profile picture.
 */
export function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

import { ref, set } from "firebase/database";

/**
 * Saves a map instance to the Firebase Realtime Database.
 * @param {Object} mapInstance - The map instance to save.
 * @param {string} userId - The user's ID.
 */
function saveMapToDatabase(mapInstance, userId) {
  const mapData = mapInstance.serialize();
  const db = getDatabase();

  const newMapId = Date.now().toString(); // Example ID generator based on timestamp

  set(ref(db, 'users/' + userId + '/maps/' + newMapId), JSON.parse(mapData))
    .then(() => {
      console.log('Map saved to database with id:', newMapId);
    })
    .catch((error) => {
      console.error('Failed to save map to database', error);
    });
}
