
import React from "react";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebaseConfig';

export function GoogleSignInButton() {
  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();


      await fetch(`${process.env.REACT_APP_API_URL}/auth/firebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        credentials: "include",
      });


    } catch (err) {
      console.error("Google Sign-In error:", err);
    }
  };

  return <button onClick={handleSignIn}>Войти через Google</button>;
}
