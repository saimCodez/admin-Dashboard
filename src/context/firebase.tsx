import { initializeApp } from "firebase/app";
import { createContext, useContext } from "react";
import { getDatabase, set, ref } from "firebase/database";
import type { FirebaseContextType, FirebaseProviderProps } from "@/types";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword as firebaseSignIn,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzmnctZs2QHse40eHKZPIkniZV4ByRKgM",
  authDomain: "school-app-97ba5.firebaseapp.com",
  projectId: "school-app-97ba5",
  storageBucket: "school-app-97ba5.firebasestorage.app",
  messagingSenderId: "1055658419959",
  appId: "1:1055658419959:web:02b71c3f37ff92dfbd95f2",
  databaseURL: "https://school-app-97ba5-default-rtdb.firebaseio.com/",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const signupUserWithEmailAndPassword = (email: string, password: string) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  const signInWithEmailAndPassword = (email: string, password: string) => {
    return firebaseSignIn(firebaseAuth, email, password);
  };

  const putData = async (key: string, data: object): Promise<any> => {
    try {
      const res = await set(ref(database, key), data);
      return res;
    } catch (error) {
      return error;
    } 
  };

  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        putData,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
