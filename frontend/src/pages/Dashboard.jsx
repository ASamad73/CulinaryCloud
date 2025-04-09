// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "../Navbar";
// import Search from "../Search";
// import Recipe from "../Recipe";
// import Profile from "../Profile";
// import Create from "../Create";
// import GuestTimeoutModal from "../components/GuestTimeoutModal";
// // import { useNavigate } from "react-router-dom"; // Import useNavigate

// // import QuickRecipes from "QuickRecipes.jsx";  // Import the Quick Recipes page

// export default function Dashboard({ isGuest, onLogout }) {
//   const [post, setPost] = useState(false);
//   const [profile, setProfile] = useState(false);
//   const [showGuestModal, setShowGuestModal] = useState(false);

//   const navigate = useNavigate(); // Get the navigate function

//   useEffect(() => {
//     if (isGuest) {
//       const timer = setTimeout(() => {
//         setShowGuestModal(true);
//       }, 30000);
//       return () => clearTimeout(timer);
//     }
//   }, [isGuest]);

//   return (
//     <div className="original-page">
//       <div className="screen">
//         <div className="page">
//           <div className="left-part">
//             <Navbar setPost={setPost} setProfile={setProfile} onLogout={onLogout} />
//           </div>
//           <div className="middle-part">
//             {!post ? (
//               !profile ? (
//                 <>
//                   <Search />
//                   <Recipe />
//                   navigate("/dashboard")
//                 </>
//               ) : (
//                 isGuest ? (
//                   <div className="warning-msg">
//                     <p><strong>Please sign up or log in to view your profile.</strong></p>
//                   </div>
//                 ) : (
//                   <>
//                     <Profile />
//                     {/* navigate("/profile") */}
//                   </>
//                 )
//               )
//             ) : (
//               isGuest ? (
//                 <div className="warning-msg">
//                   <p><strong>Please sign up or log in to create a recipe.</strong></p>
//                 </div>
//               ) : (
//                 <>
//                   <Create setPost={setPost} />
//                   {/* navigate("/create") */}
//                 </>
//               )
//             )}
//           </div>
//         </div>

//         {showGuestModal && isGuest && (
//           <GuestTimeoutModal
//           onLogin={() => window.location.href = "/"}
//           onSignup={() => window.location.href = "/"}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Search from "../Search";
import Recipe from "../Recipe";
import Profile from "../Profile";
import Create from "../Create";
import QuickRecipes from "./QuickRecipes";
import SearchResults from "../SearchResults";
import GuestTimeoutModal from "../components/GuestTimeoutModal";

export default function Dashboard({ isGuest, onLogout }) {
  const [post, setPost] = useState(false);
  const [quick, setQuick] = useState(false);
  const [profile, setProfile] = useState(false);
  const [searchRecipeId, setSearchRecipeId] = useState(null); //New state
  const [showGuestModal, setShowGuestModal] = useState(false);

  useEffect(() => {
    if (isGuest) {
      const timer = setTimeout(() => {
        setShowGuestModal(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isGuest]);

  return (
    <div className="original-page">
      <div className="screen">
        <div className="page">
          <div className="left-part">
            <Navbar setPost={setPost} setProfile={setProfile} setQuick={setQuick} onLogout={onLogout} />
          </div>
          <div className="middle-part">
            {!post && !profile && !quick && !searchRecipeId ? (
              <>
                <Search setSearchRecipeId={setSearchRecipeId} />
                <Recipe />
              </>
            ) : searchRecipeId ? (
              <SearchResults recipeId={searchRecipeId} setSearchRecipeId={setSearchRecipeId} />
            ) : profile ? (
              isGuest ? (
                <div className="warning-msg">
                  <p><strong>Please sign up or log in to view your profile.</strong></p>
                </div>
              ) : (
                <Profile />
              )
            ) : post ? (
              isGuest ? (
                <div className="warning-msg">
                  <p><strong>Please sign up or log in to create a recipe.</strong></p>
                </div>
              ) : (
                <Create setPost={setPost} />
              )
            ) : quick ? (
              <QuickRecipes />
            ) : null}
          </div>
        </div>

        {showGuestModal && isGuest && (
          <GuestTimeoutModal
            onLogin={() => window.location.href = "/"}
            onSignup={() => window.location.href = "/"}
          />
        )}
      </div>
    </div>
  );
}
