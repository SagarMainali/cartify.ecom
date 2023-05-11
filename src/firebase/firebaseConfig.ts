import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
     apiKey: "AIzaSyAtTXkmseLsLXpXEijQcaOoizs_IhcK9Sw",
     authDomain: "cartify-10415.firebaseapp.com",
     projectId: "cartify-10415",
     storageBucket: "cartify-10415.appspot.com",
     messagingSenderId: "499966273448",
     appId: "1:499966273448:web:ec76e99a532be5a38f5f9d"
}

const firebase_Project = initializeApp(firebaseConfig)
export const auth = getAuth(firebase_Project)
export const firestore = getFirestore(firebase_Project)