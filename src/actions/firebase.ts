// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYh4rlFuRh7OdjVUtgn4ztHyEOd5GbuTc",
  authDomain: "clarity-97940.firebaseapp.com",
  projectId: "clarity-97940",
  storageBucket: "clarity-97940.appspot.com",
  messagingSenderId: "873523492475",
  appId: "1:873523492475:web:ec1ae85cf1f479af6ed4de",
  measurementId: "G-2MC225HVW2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);