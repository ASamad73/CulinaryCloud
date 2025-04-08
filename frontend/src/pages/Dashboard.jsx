import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Search from "../Search";
import Recipe from "../Recipe";
import Create from "../Create";
import GuestTimeoutModal from "../components/GuestTimeoutModal";

export default function Dashboard() {
  const [post, setPost] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

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

  const handleGuestExit = () => {
    setShowGuestModal(false);
    setIsGuest(false);
    localStorage.removeItem("isGuest");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/"; // force return to login
  };

  return (
    <div className="screen">
      <div className="page">
        <div className="left-part">
          <Navbar setPost={setPost} onLogout={handleGuestExit} />
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
