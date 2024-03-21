import type { App, ServiceAccount } from "firebase-admin/app";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";

const activeApps = getApps();
let _app!: App;
let _firestore!: Firestore;

export function initialiseAdmin(serviceAccount: ServiceAccount) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (_app) {
    return _app;
  }
  _app =
    activeApps.length === 0
      ? initializeApp({ credential: cert(serviceAccount) })
      : activeApps[0];
}

export function getAdminApp() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!_app) {
    throw new Error("Admin app not initialised");
  }
  return _app;
}

export function getAdminFirestore() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!_firestore) {
    _firestore = getFirestore(_app);
  }
  return _firestore;
}
