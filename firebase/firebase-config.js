// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCH4AxyOpQCNyPFcux9lfgr-TeYUx2VMFU",
  authDomain: "academic-771ec.firebaseapp.com",
  projectId: "academic-771ec",
  storageBucket: "academic-771ec.firebasestorage.app",
  messagingSenderId: "577614362103",
  appId: "1:577614362103:web:b398dcdd2047f3f393aaf2",
  measurementId: "G-4QD9R9J80Y"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();