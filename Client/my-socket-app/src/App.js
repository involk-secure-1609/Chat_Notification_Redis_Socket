import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import MainPage from "./MainPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route 
        path="/login" 
        element={<Login setIsAuthenticated={setIsAuthenticated} />} 
      />
      <Route
        path="/home"
        element={
          isAuthenticated ? (
            <>
              <button onClick={handleLogout}>Logout</button>
              <MainPage />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;