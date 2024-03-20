import { isServer } from "@builder.io/qwik/build";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbjKbi4grjfEO7y148qAWAyhAKtToVCuk",
  authDomain: "samuel-freret-portfolio.firebaseapp.com",
  projectId: "samuel-freret-portfolio",
  storageBucket: "samuel-freret-portfolio.appspot.com",
  messagingSenderId: "1039550519253",
  appId: "1:1039550519253:web:adcbc98f69d375c9cbcf5c",
  measurementId: "G-5V85ZN3GZR",
};
const activeApps = getApps();
export const app =
  activeApps.length === 0 ? initializeApp(firebaseConfig) : activeApps[0];
export const auth = isServer ? null : getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
