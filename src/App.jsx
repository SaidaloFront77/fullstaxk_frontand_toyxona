import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

import { decodeToken } from './auth';


import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MusicProvider } from './context/MusicContext'; // 🎵 Musiqa konteksti
import MusicModal from './components/MusicModal'; // 🎵 Modal oynasi

const AppContent = () => {
  const user = decodeToken();
  const isAdmin = user?.role === 'admin';

  const { darkMode } = useTheme();



  return (
    <>
      {!isAdmin && <Navbar />}
      <main>
        <AppRoutes />
      </main>
      <ToastContainer position="bottom-right" autoClose={1000} theme="colored" />
      <MusicModal /> {/* 🎵 Modal global */}
    </>
  );
};

function App() {
  return (
    <ThemeProvider> {/* 🌒 Tungi rejim konteksti */}
      <MusicProvider> {/* 🎵 Musiqa konteksti */}
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
