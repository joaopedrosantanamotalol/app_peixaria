import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOGj_M3BD1UvbmCYsbURP92ZAOC2Vd1I0",
  authDomain: "peixaria-237b7.firebaseapp.com",
  projectId: "peixaria-237b7",
  storageBucket: "peixaria-237b7.firebasestorage.app",
  messagingSenderId: "827510879448",
  appId: "1:827510879448:web:fa3597c3c27668904513ad"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);

export default app;