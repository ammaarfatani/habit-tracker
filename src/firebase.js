

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvULNRINNWijR25_Vplq7gOr9Fwz13bYI",
  authDomain: "react-native-course-19fb8.firebaseapp.com",
  databaseURL: "https://react-native-course-19fb8-default-rtdb.firebaseio.com",
  projectId: "react-native-course-19fb8",
  storageBucket: "react-native-course-19fb8.firebasestorage.app",
  messagingSenderId: "7684361167",
  appId: "1:7684361167:web:a571c0a63a61b5b35ea0ba",
  measurementId: "G-JQ9YLM2XES"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
