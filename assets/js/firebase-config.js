import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB047uWFA2hs7NyM1RQyDF_FGg4fdW4j08",
  authDomain: "subir-archivos-4e8b3.firebaseapp.com",
  projectId: "subir-archivos-4e8b3",
  storageBucket: "subir-archivos-4e8b3.firebasestorage.app",
  messagingSenderId: "542304234772",
  appId: "1:542304234772:web:74d1b14df51679fcf76601"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
