import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics";


const API_KEY = process.env.FIREBASE_API_KEY
const AUTH_DOMAIN = process.env.AUTH_DOMAIN
const PROJECT_ID = process.env.PROJECT_ID
const STORAGE_BUCKET = process.env.STORAGE_BUCKET
const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID
const APP_ID = process.env.APP_ID
const MEASUREMENT_ID = process.env.MEASUREMENT_ID


const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
  };

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);