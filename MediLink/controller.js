
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAOqXAyZ9yX8sWhL-Tw4pCsnoV-5ZrhMXc",
  authDomain: "medlink-bf5ba.firebaseapp.com",
  projectId: "medlink-bf5ba",
  storageBucket: "medlink-bf5ba.firebasestorage.app",
  messagingSenderId: "305165957073",
  appId: "1:305165957073:web:b0ce895b2a4a1144bcd2f0"
};

const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
 export const db = getFirestore(app);