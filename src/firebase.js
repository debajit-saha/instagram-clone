import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDJEnhEZbgMq2kNdOhYWSfmgYI4SUyHPSE",
    authDomain: "instagram-c35ae.firebaseapp.com",
    projectId: "instagram-c35ae",
    storageBucket: "instagram-c35ae.appspot.com",
    messagingSenderId: "980836727227",
    appId: "1:980836727227:web:dd42937df368044377ec9e",
    measurementId: "G-HGH3WPWZ98"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };