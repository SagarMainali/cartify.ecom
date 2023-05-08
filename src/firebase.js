import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
     apiKey: "AIzaSyAtTXkmseLsLXpXEijQcaOoizs_IhcK9Sw",
     authDomain: "cartify-10415.firebaseapp.com",
     projectId: "cartify-10415",
     storageBucket: "cartify-10415.appspot.com",
     messagingSenderId: "499966273448",
     appId: "1:499966273448:web:ec76e99a532be5a38f5f9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);