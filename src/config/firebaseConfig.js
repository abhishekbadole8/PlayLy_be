const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAwxAeZmmM6COIyPjUL8C4myEhe-In7Y5g",
  authDomain: "play-ly.firebaseapp.com",
  projectId: "play-ly",
  storageBucket: "play-ly.appspot.com",
  messagingSenderId: "345572535655",
  appId: "1:345572535655:web:7ac12f712ea9cc732f13c2",
};

// Initialize Firebase app and storage
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

module.exports = { firebaseApp, storage };
