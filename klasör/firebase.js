import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAgJYnFNEVM2A5WsTb40bMWc-uSLCBvJFA",
  authDomain: "kitap-takip-otomasyonu.firebaseapp.com",
  projectId: "kitap-takip-otomasyonu",
  storageBucket: "kitap-takip-otomasyonu.firebasestorage.app",
  messagingSenderId: "442022618437",
  appId: "1:442022618437:web:f1c6f7ad99f07993ba8a2c"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);