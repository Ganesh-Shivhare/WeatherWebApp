import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import WeatherDetail from './pages/WeatherDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PWAInstallDialog from './components/PWAInstallDialog';
import './i18n/i18n';
import { useTheme, useMediaQuery } from '@mui/material';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  if (window.confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch(err => {
          console.error('ServiceWorker registration failed: ', err);
        });
      
      // Detect controller change and refresh
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);

      // For mobile/tablet, show dialog every time
      if (isMobile) {
        setShowInstallDialog(true);
      } else {
        // For desktop, show once per day
        const lastShownDate = localStorage.getItem('pwaInstallDialogLastShown');
        const today = new Date().toDateString();
        
        if (!lastShownDate || lastShownDate !== today) {
          setShowInstallDialog(true);
          localStorage.setItem('pwaInstallDialogLastShown', today);
        }
      }
    };

    // Handle successful installation
    const handleAppInstalled = () => {
      setShowInstallDialog(false);
      setDeferredPrompt(null);
    };

    // Check if the app is already installed
    const checkIfAppIsInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallDialog(false);
      }
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkIfAppIsInstalled);

    // Initial check
    checkIfAppIsInstalled();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkIfAppIsInstalled);
    };
  }, [isMobile]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no deferredPrompt, show instructions for manual installation
      if (isMobile) {
        // For mobile, show instructions to install from browser menu
        setShowInstallDialog(true);
      }
      return;
    }
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallDialog(false);
      }
    } catch (error) {
      console.error('Error during installation:', error);
      // If there's an error, show manual installation instructions
      setShowInstallDialog(true);
    } finally {
      // Clear the deferredPrompt
      setDeferredPrompt(null);
    }
  };

  const handleCloseDialog = () => {
    setShowInstallDialog(false);
  };

  return (
    <ThemeProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, paddingBottom: '2rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/weather/:city" element={<WeatherDetail />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
            </Routes>
          </main>
          <Footer />
          <PWAInstallDialog
            open={showInstallDialog}
            onClose={handleCloseDialog}
            onInstall={handleInstall}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
