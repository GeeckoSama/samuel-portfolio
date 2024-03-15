import {
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "~/libs/firebase";

export interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string | null;
}

export const UserContext = createContextId<User>("auth.user-context");

export const AuthContext = component$(() => {
  const user = useStore<User>({
    displayName: null,
    email: null,
    photoURL: null,
    uid: null,
  });
  useContextProvider(UserContext, user);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (auth.currentUser) {
      console.log("User already logged in");
      user.displayName = auth.currentUser.displayName;
      user.email = auth.currentUser.email;
      user.photoURL = auth.currentUser.photoURL;
      user.uid = auth.currentUser.uid;
    }

    const unsubscribe = onAuthStateChanged(auth, (result) => {
      console.log("Auth state changed : ", result ? "logged in" : "logged out");
      user.displayName = result ? result.displayName : null;
      user.email = result ? result.email : null;
      user.photoURL = result ? result.photoURL : null;
      user.uid = result ? result.uid : null;
    });

    return () => {
      //console.log("Unsubscribing from auth listener");
      unsubscribe();
    };
  });
  return (
    <>
      <Slot />
    </>
  );
});
