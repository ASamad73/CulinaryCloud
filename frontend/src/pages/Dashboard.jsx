import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Search from "../Search";
import Recipe from "../Recipe";
import Profile from "../Profile";
import Create from "../Create";
import GuestTimeoutModal from "../components/GuestTimeoutModal";

export default function Dashboard() {
  const [post, setPost] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [profile,setProfile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Step 1: Extract the token from the URL when the component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      // Save the token for authenticated requests
      localStorage.setItem("token", token);
      // Optionally, update any global or local authentication state here

      // Clean the URL by navigating to "/dashboard" without the query parameters
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  // Step 2: Check if the user is a guest and set up the timeout to show modal
  useEffect(() => {
    const guest = localStorage.getItem("isGuest") === "true";
    setIsGuest(guest);

    if (guest) {
      const timer = setTimeout(() => {
        setShowGuestModal(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handler to log out a guest (or exit guest mode)
  const handleGuestExit = () => {
    setShowGuestModal(false);
    setIsGuest(false);
    localStorage.removeItem("isGuest");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/"; // Force return to login
  };

  return (
    <div className="screen">
      <div className="page">
        <div className="left-part">
          <Navbar setPost={setPost} setProfile={setProfile} onLogout={handleGuestExit} />
        </div>
        <div className="middle-part">
          {/* Conditional Rendering */}
          {!post ? (
            !profile ? (
              <>
                <Search />
                <Recipe />
              </>
            ) : (
              <Profile />
            )
          ) : (
            <Create setPost={setPost} />
          )}
        </div>
      </div>
  
      {/* Guest timeout popup */}
      {showGuestModal && isGuest && (
        <GuestTimeoutModal
          onLogin={handleGuestExit}
          onSignup={handleGuestExit}
        />
      )}
    </div>
  );
}












