import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { formatRouteToLeafletFormat, formatRouteToDbFormat } from './helper';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { getUserID } from './Entity/app';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBW45aUJ4Xt3NaCe9YXWwA-AGee80A8gpY',
  authDomain: 'sonic-platform-264510.firebaseapp.com',
  databaseURL:
    'https://sonic-platform-264510-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'sonic-platform-264510',
  storageBucket: 'sonic-platform-264510.appspot.com',
  messagingSenderId: '503406174799',
  appId: '1:503406174799:web:aa483e374c6ebdfe42003a',
  measurementId: 'G-TSGBM850X1',
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

/**
 * Retrieves routes from the Firebase Firestore database.
 * @param {string} userID - The user's ID (optional).
 * @returns {Array} - Array of route objects or route IDs.
 */
// EXPORTS - need 'await' to use async function (see 'const snapshot = await getDocs(colRef)' below)
// returns list of ID when retrieving user routes
export async function retrieveRoutesFromDatabase(userID = null) {
  if (userID) {
    const colRef = collection(db, userID);
    let routeIDs = [];
    try {
      const snapshot = await getDocs(colRef);

      snapshot.forEach(doc => {
        routeIDs.unshift({ ...doc.data(), userRouteDocID: doc.id });
      });
    } catch (err) {
      console.error(err.message);
    }
    return routeIDs;
  }

  const colRef = collection(db, 'routes');
  let routes = [];
  try {
    const snapshot = await getDocs(colRef);

    snapshot.forEach(doc => {
      routes.push(formatRouteToLeafletFormat({ ...doc.data(), docID: doc.id }));
    });
  } catch (err) {
    console.error(first);
  }

  return routes;
}

export async function updateUserReviewedToDatabase(route, userID, duration) {
  const routeID = route.id;
  const docRef = doc(db, userID, route.userRouteDocID);
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  const totalHours = hours + (minutes / 60) + (seconds / 3600);

  try {
    await updateDoc(docRef, {
      routeID,
      fav: route.fav,
      reviewed: true,
      distance: route.distance,
      time: totalHours,
    });
  } catch (err) {
    console.error(err);
  }

  return;
}

export async function updateFavRouteToDatabase(route, userID) {
  const routeID = route.id;
  const docRef = doc(db, userID, route.userRouteDocID);

  try {
    await updateDoc(docRef, {
      routeID,
      fav: true,
      reviewed: route.reviewed,
    });
  } catch (err) {
    console.error(err);
  }

  return;
}

/**
 * Adds a route to the Firebase Firestore database.
 * @param {Object} route - The route object to add.
 * @param {string} userID - The user's ID (optional).
 */
export async function addRouteToDatabase(route, userID = null) {
  if (userID) {
    const routeID = route.id;
    try {
      const response = await addDoc(collection(db, userID), {
        routeID,
        fav: false,
        reviewed: false,
      });
    } catch (err) {
      console.error(err);
    }
    return;
  }

  const cleanedRoute = formatRouteToDbFormat(route);
  try {
    const response = await addDoc(collection(db, 'routes'), cleanedRoute);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Updates a new review to the Firebase Firestore database.
 * @param {Object} route - The route object with the new review.
 */
export async function addReviewToDatabase(route, img, username) {
  const docRef = doc(db, 'routes', route.docID);
  console.log(`in http ${route}`);

  await updateDoc(docRef, {
    reviews: route.reviews,
    ratings: route.ratings,
    duration: route.duration,
    leaderboard: route.leaderboard,
  });

  if (img)  {  
    const imgRef = ref(storage, 'images/' + route.id + '_' + username + '.jpg');
    await uploadBytes(imgRef, img).then(snapshot => {
      console.log('file uploaded!');
    });
  }
}

/**
 * Logs in a user using Firebase Authentication.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {string} - The user's ID.
 * @throws {Error} - If login fails.
 */
export async function loginUser(email, password) {
  const auth = getAuth();

  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    const userID = user.uid;
    return userID;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Signs up a user using Firebase Authentication.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
export async function signupUser(email, password) {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // The new user is signed up and signed in.
    return user;
  } catch (error) {
    const errorMessage = error.message;
    document.getElementById('error-message').innerText = errorMessage;
  }
}

/**
 * Retrieves the current user's email using Firebase Authentication.
 * @returns {string} - The current user's email.
 */
export function getCurrentUserEmail() {
  const auth = getAuth();
  onAuthStateChanged(auth, user => {
    if (user) {
      return user.email;
    } else {
      console.error('user null');
    }
  });
}

export async function updateStats(userID) {
  // console.log(userID);
  let totalRuns=0;
  let totalTime=0;
  let totalDistance=0;
  let maxSpeed=0;
  let avgSpeed=0;

  const querySnapshot = await getDocs(collection(db, userID));
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data().fav);
    if (doc.data().reviewed) {
      totalRuns++;
      if (doc.data().time) totalTime += doc.data().time;
      if (doc.data().distance) totalDistance += doc.data().distance;
      let speed = doc.data().distance/doc.data().time;
      if (speed && speed>maxSpeed) maxSpeed=speed;
    }
  });

  const timehour = totalTime.toFixed(0);
  const timeminute = ((totalTime-timehour)*60).toFixed(0);
  const timeseconds = Math.abs(((((totalTime-timehour)*60)-timeminute)*60).toFixed(0));
  if (totalTime>0) avgSpeed = (totalDistance/totalTime).toFixed(2);

  document.getElementById('total-runs').innerText = totalRuns;
  document.getElementById('total-time').innerText = timehour + ' h ' + timeminute + ' min ' + timeseconds + ' s';
  document.getElementById('total-distance').innerText = totalDistance.toFixed(2) + ' km';
  document.getElementById('avg-speed').innerText = avgSpeed + ' km/h';
  document.getElementById('fastest-run').innerText = maxSpeed.toFixed(2) + ' km/h';

}

export async function checkExistingRouteName(newname, username) {
  let found = false;
  const querySnapshot = await getDocs(collection(db, 'routes'));
  querySnapshot.forEach((doc) => {
    if ((doc.data().title === newname) && (doc.data().creator === username)) {
      found = true;
    }
  });
  return found;
}