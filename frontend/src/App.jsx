import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";

// Pages
import LoginScreen from "./pages/login.jsx";
import SignupScreen from "./pages/signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./Profile.jsx";
import Search from "./Search.jsx";
import SearchResults from "./SearchResults.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import QuickRecipes from "./pages/QuickRecipes.jsx";  


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );  
  const [isGuest, setIsGuest] = useState(localStorage.getItem("isGuest") === "true");
  const [showSignup, setShowSignup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      // Store token and update auth state
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.removeItem("isGuest");
      setIsAuthenticated(true);
      setIsGuest(false);

      // Clean up the URL
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsGuest(false);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.removeItem("isGuest");
    navigate("/dashboard");
  };

  const handleGuestLogin = () => {
    setIsAuthenticated(false);
    setIsGuest(true);
    localStorage.setItem("isAuthenticated", "false");
    localStorage.setItem("isGuest", "true");
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
    localStorage.clear();
    navigate("/");
  };

  const toggleAuthScreen = () => {
    setShowSignup(!showSignup);
  };

  return (
    <div className="main-container">
      <Routes>
        <Route
          path="/"
          element={
            <div className="body-lo">
              {showSignup ? (
                <SignupScreen
                  onAuthSuccess={handleAuthSuccess}
                  toggleScreen={toggleAuthScreen}
                />
              ) : (
                <LoginScreen
                  onAuthSuccess={handleAuthSuccess}
                  toggleScreen={toggleAuthScreen}
                  onGuestLogin={handleGuestLogin}
                />
              )}
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              isGuest={isGuest}
              onLogout={handleLogout}
            />
          }
        />

        {/* ✅ These are now protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search-results"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/quick-recipes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <QuickRecipes />
            </ProtectedRoute>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
