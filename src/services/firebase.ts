import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIN5vWYZujbKNMBfCwOYkaXG-_k6hRh8Y",
  authDomain: "gerencia-mobile.firebaseapp.com",
  projectId: "gerencia-mobile",
  storageBucket: "gerencia-mobile.firebasestorage.app",
  messagingSenderId: "352973120933",
  appId: "1:352973120933:web:dd9ffe6ba35d64a45ab44c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// experimentalForceLongPolling evita um bug conhecido de conexão do Firestore
// em apps React Native/Expo (escritas que travam sem erro nenhum)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});