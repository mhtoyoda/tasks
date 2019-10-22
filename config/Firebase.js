import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC6SEXyQCpUJW6ljEjJC2zkiSVL8GXoiYI",
    authDomain: "tasks-68a32.firebaseapp.com",
    databaseURL: "https://tasks-68a32.firebaseio.com",
    projectId: "tasks-68a32",
    storageBucket: "tasks-68a32.appspot.com",
    messagingSenderId: "143129144974",
    appId: "1:143129144974:web:0bc9437003327d0928a3df"
}

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig)

export default Firebase