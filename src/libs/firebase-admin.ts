/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { isServer } from "@builder.io/qwik/build";
import type { App, ServiceAccount } from "firebase-admin/app";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";

let _app!: App;
let _firestore!: Firestore;

export function initialiseAdmin(serviceAccount: ServiceAccount) {
  if (!isServer)
    console.error("Firebase Admin should be initialised on server only");
  if (_app) {
    return _app;
  }
  const activeApps = getApps();
  _app =
    activeApps.length === 0
      ? initializeApp({ credential: cert(serviceAccount) })
      : activeApps[0];
  console.log("Firebase Admin initialised");
}

export function getAdminApp() {
  if (!_app) {
    throw new Error("Admin app not initialised");
  }
  return _app;
}

export function getAdminFirestore() {
  if (!_firestore) {
    _firestore = getFirestore(_app);
  }
  return _firestore;
}
