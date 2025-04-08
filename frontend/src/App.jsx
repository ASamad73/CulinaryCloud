import { useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";

import LoginScreen from "./pages/login.jsx";
import SignupScreen from "./pages/signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./Profile.jsx";
import Search from "./Search.jsx";
import SearchResults from "./SearchResults.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsGuest(false);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.removeItem("isGuest");
    navigate("/dashboard");
  };

  const handleGuestLogin = () => {
    setIsAuthenticated(true);
    setIsGuest(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("isGuest", "true");
    navigate("/dashboard");
  };

  const toggleAuthScreen = () => {
    setShowSignup(!showSignup);
  };

  return (
    <div className="main-container">
      {/* Navigation bar for easy route access */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/profile">Profile</Link>
        <Link to="/search">Search</Link>
      </nav>
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
        {/* Route for dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* New route for the profile page */}
        <Route path="/profile" element={<Profile />} />
        {/* Search route: displays the search input and suggestions */}
        <Route path="/search" element={<Search />} />
        {/* Search results route: displays detailed recipes based on search selections */}
        <Route path="/search-results" element={<SearchResults />} />

      </Routes>
    </div>
  );
}

export default App;
