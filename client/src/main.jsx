import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthContextProvider } from './context/AuthContext'; // Import this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider> {/* Wrap App */}
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
);