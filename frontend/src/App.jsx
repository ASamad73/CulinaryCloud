import { useState, useEffect } from 'react';
import Recipe from './Recipe.jsx';
import Search from './Search.jsx';
import Navbar from './Navbar.jsx';
import Create from './Create.jsx';
import LoginScreen from './pages/login.jsx';
import SignupScreen from './pages/signup.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [post, setPost] = useState(false);

  useEffect(() => {
    // Remove this line for production
    localStorage.removeItem('isAuthenticated'); // Reset on every load during dev
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const toggleAuthScreen = () => {
    setShowSignup(!showSignup);
  };

  return (
    <div className="main-container">
      {!isAuthenticated ? (
        <div className="body-lo">
          {showSignup ? (
            <SignupScreen onAuthSuccess={handleAuthSuccess} toggleScreen={toggleAuthScreen} />
          ) : (
            <LoginScreen onAuthSuccess={handleAuthSuccess} toggleScreen={toggleAuthScreen} />
          )}
        </div>
      ) : (
        <div className="screen">
          <div className="page">
            <div className="left-part">
              <Navbar setPost={setPost} onLogout={handleLogout} />
            </div>
            <div className="middle-part">
              {!post ? (
                <>
                  <Search />
                  <Recipe />
                </>
              ) : (
                <Create />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
