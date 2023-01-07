import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAqlbOJ6Ldci5O-iHxwtBFbScDnI1osqyU",
  authDomain: "w3-marketplace.firebaseapp.com",
  projectId: "w3-marketplace",
  storageBucket: "w3-marketplace.appspot.com",
  messagingSenderId: "55412688979",
  appId: "1:55412688979:web:cbe328bd13f2d2c5f1dea6"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth,fs,storage}