import React, { useEffect, useState } from "react";
import "./App.css";
import Splash from "./pages/Splash";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { FinanceProvider } from "./contexts/FinanceContext";

import { IonApp, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

setupIonicReact();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('finkar_logged_in') === 'true';
  });

  // Show splash on initial load for 2.5s
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderContent = () => {
    if (showSplash) {
      return <Splash />;
    }
    
    if (!isLoggedIn) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    
    return <Dashboard onLogout={handleLogout} />;
  };

  return (
    <FinanceProvider>
      <IonApp>{renderContent()}</IonApp>
    </FinanceProvider>
  );
}

export default App;
