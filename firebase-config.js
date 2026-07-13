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

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Firestore с кешированием (новый способ, без предупреждения)
firebase.firestore().enablePersistence({
  synchronizeTabs: true
}).catch(function(err) {
  if (err.code === 'failed-precondition') {
    console.warn('Офлайн-режим доступен только в одной вкладке');
  } else if (err.code === 'unimplemented') {
    console.warn('Браузер не поддерживает офлайн-режим');
  }
});

const db = firebase.firestore();
