import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCP4qhZatJosjewWUcKPuMnQDgRl_Erzng",
    authDomain: "resume-builder-74f65.firebaseapp.com",
    projectId: "resume-builder-74f65",
    storageBucket: "resume-builder-74f65.appspot.com",
    messagingSenderId: "923525840072",
    appId: "1:923525840072:web:e3b87e81d2a9162b0379fd"
};

const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
const db= getFirestore(app);
const storage= getStorage(app)
export {auth,db,storage}
