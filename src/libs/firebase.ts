/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { FirebaseApp } from "firebase/app";
import { getApps, initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let _app!: FirebaseApp;
let _auth!: Auth;
let _firestore!: Firestore;
let _storage!: FirebaseStorage;

export function initialise() {
  if (_app) {
    return _app;
  }
  const activeApps = getApps();
  _app =
    activeApps.length === 0 ? initializeApp(firebaseConfig) : activeApps[0];
  return _app;
  console.log("Firebase initialised");
}

export function auth() {
  if (!_auth) {
    _auth = getAuth(initialise());
  }
  return _auth;
}

export function firestore() {
  if (!_firestore) {
    _firestore = getFirestore(initialise());
  }
  return _firestore;
}

export function storage() {
  if (!_storage) {
    _storage = getStorage(initialise());
  }
  return _storage;
}
