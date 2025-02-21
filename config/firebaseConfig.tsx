import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyA4PszHlBHzE7cgHi2HGQDNbJiisW_dv5o",
    authDomain: "bite-guide-1d626.firebaseapp.com",
    projectId: "bite-guide-1d626",
    storageBucket: "bite-guide-1d626.firebasestorage.app",
    messagingSenderId: "799354674612",
    appId: "1:799354674612:web:e4f5d4cd71e21d153da6e1",
    measurementId: "G-HMWT5VFWXS"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, db };