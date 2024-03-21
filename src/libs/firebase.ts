import { isServer } from "@builder.io/qwik/build";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_APIKEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.PUBLIC_FIREBASE_APPID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENTID,
};
const activeApps = getApps();
export const app =
  activeApps.length === 0 ? initializeApp(firebaseConfig) : activeApps[0];
export const auth = isServer ? null : getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
