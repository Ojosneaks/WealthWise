import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import AuthRoute from './AuthRoute.jsx'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7laZFNYFaLQkDFSbOLZGn-EMEcLDeSac",
  authDomain: "wealthwise-c8833.firebaseapp.com",
  projectId: "wealthwise-c8833",
  storageBucket: "wealthwise-c8833.firebasestorage.app",
  messagingSenderId: "1021601245238",
  appId: "1:1021601245238:web:b207aa924c64dbd25e1097",
  measurementId: "G-FC9GS7GDB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<AuthRoute><App /></AuthRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}