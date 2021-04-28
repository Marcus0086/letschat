import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIjEIEPv_duk4Dq7Tn2c7iCei7CzpyQRE",
  authDomain: "letschat-c38ee.firebaseapp.com",
  projectId: "letschat-c38ee",
  storageBucket: "letschat-c38ee.appspot.com",
  messagingSenderId: "394742479030",
  appId: "1:394742479030:web:2468bbf5bed09735240e17",
  measurementId: "G-SCE99QCZEH",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { db, auth, provider };
