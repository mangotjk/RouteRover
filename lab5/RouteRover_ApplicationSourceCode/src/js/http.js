import { firebaseConfig } from './config';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { formatRouteToLeafletFormat, formatRouteToDbFormat } from './helper';
import Chart from 'chart.js/auto';
import { trail_routes } from '../img/route/trail_route.jpeg';

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

/**
 * Retrieves routes from the Firebase Firestore database.
 * @param {string} userID - The user's ID (optional, if not provided will return all routes).
 * @returns {Array} - Array of route objects.
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

/**
 * Updates the user's reviewed route to the database.
 *
 * @param {Object} route - The route object containing route details.
 * @param {string} userID - The ID of the user.
 * @param {string} duration - The duration of the route in the format "HH:MM:SS".
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
export async function updateUserReviewedToDatabase(route, userID, duration) {
  const routeID = route.id;
  const docRef = doc(db, userID, route.userRouteDocID);
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  try {
    await updateDoc(docRef, {
      routeID,
      fav: route.fav,
      reviewed: true,
      distance: route.distance,
      time: totalSeconds,
    });
  } catch (err) {
    console.error(err);
  }

  return;
}

/**
 * Updates the favorite route in the database for a specific user.
 *
 * @param {Object} route - The route object to be updated.
 * @param {string} userID - The ID of the user.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 * @throws {Error} - If unable to add the favorite route.
 */
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
    throw new Error('unable to add favourite route. Please try again later.');
  }

  return;
}

/**
 * Adds a route to the database.
 *
 * @param {Object} route - The route object to add.
 * @param {string} userID - The user's ID (optional).
 */
export async function addRouteToDatabase(route, userID = null) {
  if (userID) {
    const routeID = route.id;
    try {
      await addDoc(collection(db, userID), {
        routeID,
        fav: false,
        reviewed: false,
      });
    } catch (err) {
      console.error(err);
    }
    return;
  }

  let cleanedRoute = formatRouteToDbFormat(route);
  try {
    await addDoc(collection(db, 'routes'), cleanedRoute);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Adds a new review to the database.
 *
 * @param {Object} route - The route object with the new review.
 * @param {Object} img - The image to be uploaded
 * @param {String} username - Username of user who is submitting the review
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

  if (img) {
    const imgRef = ref(storage, 'images/' + route.id + '_' + username + '.jpg');
    await uploadBytes(imgRef, img).then(snapshot => {
      console.log('file uploaded!');
    });
  }
}

/**
 * Logs in a user using Firebase Authentication.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {string} - The user's ID.
 * @throws {Error} - If login fails.
 */
export async function loginUser(email, password) {
  const auth = getAuth();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    const userID = user.uid;
    return userID;
  } catch (err) {
    throw new Error('Invalid email or password');
  }
}

/**
 * Signs up a user using Firebase Authentication.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object} - The user's information
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
    console.error(error.message);
    const errorMessage = error.message;
    document.getElementById('error-message').innerText = errorMessage;
  }
}

/**
 * Retrieves the current user's email using Firebase Authentication.
 *
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

/**
 * Updates the stats based on the user ID.
 *
 * @param {string} userID - The ID of the user.
 * @returns {Promise<void>} - A promise that resolves when the stats are updated.
 */
export async function updateStats(userID) {
  // console.log(userID);
  let totalRuns = 0;
  let totalTime = 0;
  let totalDistance = 0;
  let maxSpeed = 0;
  let avgSpeed = 0;
  let avgSecPerKM = 0;
  let maxMinPerKM = 0;
  let graphdata = [];

  /**
   * Retrieves the documents from the 'routes' collection.
   * @returns {Promise<QuerySnapshot>} - A promise that resolves with the query snapshot.
   */
  const routesSnapshot = await getDocs(collection(db, 'routes'));

  /**
   * Retrieves the documents from the user's collection.
   * @returns {Promise<QuerySnapshot>} - A promise that resolves with the query snapshot.
   */
  const reviewSnapshot = await getDocs(collection(db, userID));
  reviewSnapshot.forEach(doc => {
    if (doc.data().reviewed) {
      totalRuns++;
      if (doc.data().time) totalTime += doc.data().time;
      if (doc.data().distance) totalDistance += doc.data().distance;
      let speed;
      let spdmpk;
      if (doc.data().time)
        speed = (doc.data().distance / doc.data().time) * 3600;
      if (doc.data().distance)
        spdmpk = doc.data().time / doc.data().distance / 60; // speed in mins per km
      if (speed && speed > maxSpeed) maxSpeed = speed;
      let name;
      routesSnapshot.forEach(rdoc => {
        if (rdoc.data().id === doc.data().routeID) {
          name = rdoc.data().title;
        }
      });
      graphdata.push({
        ind: name,
        spd: speed,
        spdmpk: spdmpk,
        dist: doc.data().distance,
        time: doc.data().time / 3600,
        totaldist: totalDistance,
        totaltime: totalTime / 3600,
      });
    }
  });

  const timehour = Math.floor(totalTime / 3600);
  const timeminute = Math.floor((totalTime - timehour * 3600) / 60);
  const timeseconds = (totalTime - timehour * 3600 - timeminute * 60).toFixed(
    0
  );
  if (totalTime > 0) avgSpeed = (totalDistance / totalTime) * 3600;
  if (totalDistance > 0) avgSecPerKM = totalTime / totalDistance;

  const avgSpdmin = Math.floor(avgSecPerKM / 60);
  const avgSpdsec = (avgSecPerKM - avgSpdmin * 60).toFixed(0);

  if (maxSpeed > 0) maxMinPerKM = 60 / maxSpeed;
  const maxSpdmin = Math.floor(maxMinPerKM);
  const maxSpdsec = ((maxMinPerKM - maxSpdmin) * 60).toFixed(0);

  document.getElementById('total-runs').innerText = totalRuns;

  document.getElementById('total-time').innerText =
    timehour + 'h  ' + timeminute + 'm  ' + timeseconds + 's';

  document.getElementById('total-distance').innerText =
    totalDistance.toFixed(2) + ' km';

  document.getElementById('avg-speed').innerText =
    avgSpdmin + ' min ' + avgSpdsec + ' s/km';

  document.getElementById('fastest-run').innerText =
    maxSpdmin + ' min ' + maxSpdsec + ' s/km';

  new Chart(document.getElementById('stats-graph'), {
    type: 'line',
    data: {
      labels: graphdata.map(row => row.ind),
      datasets: [
        {
          label: 'Avg Speed (min/km)',
          data: graphdata.map(row => row.spdmpk),
          hidden: false,
        },
        {
          label: 'Distance (km)',
          data: graphdata.map(row => row.dist),
          hidden: true,
        },
        {
          label: 'Duration (h)',
          data: graphdata.map(row => row.time),
          hidden: true,
        },
      ],
    },
    options: {
      scales: {
        x: {
          display: false,
        },
      },
      plugins: {
        legend: {
          onClick: function (event, legendItem, legend) {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;

            if (!ci.isDatasetVisible(index)) {
              const numitems = ci.legend.legendItems.length;
              for (let i = 0; i < numitems; i++) {
                if (i == index) {
                  ci.show(index);
                  legendItem.hidden = false;
                } else {
                  ci.hide(i);
                }
              }
            }
          },
        },
      },
    },
  });
}

/**
 * Checks if the user has an existing route with the same name
 *
 * @param {String} newname - the name to check for
 * @param {String} username - the user to check for
 * @returns {boolean} - boolean indicating whether or not a route with the same name exists
 */
export async function checkExistingRouteName(newname, username) {
  let found = false;
  const querySnapshot = await getDocs(collection(db, 'routes'));
  querySnapshot.forEach(doc => {
    if (doc.data().title === newname && doc.data().creator === username) {
      found = true;
    }
  });
  return found;
}

/**
 * get the url for an image stored in firebase storage
 *
 * @param {String} url - string containg the path to image for route review
 * @returns image url
 */
export async function getRouteImg(url = null) {
  const imgRef = ref(storage, url);
  try {
    const imgURL = await getDownloadURL(imgRef);
    if (imgURL) return imgURL;
    return trail_routes;
  } catch (err) {
    return trail_routes;
  }
}
