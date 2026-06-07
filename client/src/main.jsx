import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0f0f0f',
          color: '#faf8f4',
          fontFamily: '"DM Sans", sans-serif',
          borderRadius: '8px',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#4a7c59', secondary: '#faf8f4' } },
        error:   { iconTheme: { primary: '#c0572b', secondary: '#faf8f4' } },
      }}
    />
  </React.StrictMode>
);
