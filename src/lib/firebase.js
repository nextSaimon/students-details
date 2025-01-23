import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBj474IttAIafDuyFjlECpkYWCfAWUCgA8",
  authDomain: "fir-383a5.firebaseapp.com",
  databaseURL:
    "https://fir-383a5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-383a5",
  storageBucket: "fir-383a5.firebasestorage.app",
  messagingSenderId: "766483370054",
  appId: "1:766483370054:web:37ecdfd11a89570212ba47",
  measurementId: "G-JTYGL0GQPP",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };
