import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from "@firebase/auth";
import {getFirestore} from "@firebase/firestore"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDw8S2oUbiAnVIuPrZ-KO1l9StGDm97OvI",
  authDomain: "orca-ai1444.firebaseapp.com",
  projectId: "orca-ai1444",
  storageBucket: "orca-ai1444.firebasestorage.app",
  messagingSenderId: "346117387354",
  appId: "1:346117387354:android:7ef328f92fe85365a39463",
//   measurementId: "G-88ZDBR2G7X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firebase_auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export {app,firebase_auth,db,getAuth}