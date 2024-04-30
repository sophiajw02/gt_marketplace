import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyAVNXOhCTEr4kQ31CN6h7PPE51wDHb2wNQ",
  authDomain: "cs-4675.firebaseapp.com",
  projectId: "cs-4675",
  storageBucket: "cs-4675.appspot.com",
  messagingSenderId: "959736110600",
  appId: "1:959736110600:web:b94c86c60dccb8d48ffbbd",
  measurementId: "G-RJK768NH18",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const perf = getPerformance(app);

export { auth, db, storage, analytics, perf };
