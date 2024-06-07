import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPi7eT1bE9nuDtwJu69QvubFL0jBtafcQ",
  authDomain: "test-task-file-system.firebaseapp.com",
  projectId: "test-task-file-system",
  storageBucket: "test-task-file-system.appspot.com",
  messagingSenderId: "319084072923",
  appId: "1:319084072923:web:581787ce90882f6dca61fe",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
