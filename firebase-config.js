// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyDccl6ysVMztdKx0D87seb_nzH3DerdgTE",
  authDomain: "luminous-app-48b07.firebaseapp.com",
  projectId: "luminous-app-48b07",
  storageBucket: "luminous-app-48b07.firebasestorage.app",
  messagingSenderId: "960561460789",
  appId: "1:960561460789:web:a46c9c855d989a7803237c",
  measurementId: "G-BKD39W5303"
};

// Инициализируем Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.enablePersistence(); // Включаем офлайн-режим
