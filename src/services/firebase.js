// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9KtY9vX3iVzzvOdhS0Y9qqK2idyfQnU0",
  authDomain: "eduflow-ai-1435.firebaseapp.com",
  projectId: "eduflow-ai-1435",
  storageBucket: "eduflow-ai-1435.appspot.com",
  messagingSenderId: "217209599494",
  appId: "1:217209599494:web:f95de8d53eb62ef036b587",
  measurementId: "G-DL0WQQ2GKK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 