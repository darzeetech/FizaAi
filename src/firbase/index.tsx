// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDSeD1Kgjjlkf9C1GNxP93T2mArqmdYns0',
  authDomain: 'darzee-be75c.firebaseapp.com',
  projectId: 'darzee-be75c',
  storageBucket: 'darzee-be75c.appspot.com',
  messagingSenderId: '311722897343',
  appId: '1:311722897343:web:d00ce5b9b9a2dfd2413b0a',
  measurementId: 'G-RW2S8Y31MG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
auth.languageCode = 'en';

export { auth, firebaseConfig };
