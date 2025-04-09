// import React, { useState } from "react";
// import axios from "axios";
// import InputField from "../components/InputField";
// import Button from "../components/Button";
// import Logo from "../components/Logo";
// import { useNavigate } from "react-router-dom";



// export default function LoginScreen({ onAuthSuccess, toggleScreen, onGuestLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate(); // Used to programmatically redirect
//   // const { login, guestLogin } = useAuth();
//   // Handles login through API
//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     setLoading(true);
//     setError("");

//     try {
//       // Send login request to backend
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/auth/login`,
//         { email, password }
//       );

//       // Extract token and user data
//       const { token, user } = response.data;

//       // Save to localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       // Update auth state
//       onAuthSuccess(); 

//       // Navigate to dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       if (err.response && err.response.data) {
//         setError(err.response.data.msg);
//       } else {
//         setError("An error occurred. Please try again.");
//       }
//     }

//     setLoading(false);
//   };

//   // Handles guest access
//   const handleGuestView = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     // Let App.jsx manage guest session logic (timeout, flags, etc.)
//     onGuestLogin();
//     navigate("/dashboard");
//   };

//   return (
//     <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
//       <Logo />
//       <h2 className="text-center text-xl font-semibold text-green-700 mb-4">
//         Welcome to Culinary Cloud!
//       </h2>

//       {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//       {/* Login Form */}
//       <form className="space-y-4" onSubmit={handleLogin}>
//         <InputField 
//           label="Email" 
//           type="email" 
//           value={email} 
//           onChange={(e) => setEmail(e.target.value)} 
//         />
//         <InputField 
//           label="Password" 
//           type="password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//         />
//         {/* <button onClick={()=>}>SignIn with Google</button> */}
//         <button 
//         type="button"
//         onClick={() => window.location.href = "http://localhost:5001/api/auth/google"}
//         className="w-max mx-auto border border-blue-500 bg-blue-500 text-white font-bold p-4 text-center hover:underline"
//         >
//           Sign in with Google
//         </button>
//         <Button text="Sign in" loading={loading} onClick={handleLogin} />
//       </form>

//       {/* Additional Actions */}
//       <div className="flex flex-col items-center mt-4 space-y-2">
//         <button 
//           onClick={toggleScreen} 
//           className="text-green-700 font-semibold hover:underline"
//         >
//           Sign up
//         </button>
//         <button 
//           onClick={handleGuestView} 
//           className="text-blue-500 font-semibold hover:underline"
//         >
//           Continue as Guest
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

export default function LoginScreen({ onAuthSuccess, toggleScreen, onGuestLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 

  // Handles login through API
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError("");

    try {
      // Send login request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );

      const { token, user } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update auth state
      onAuthSuccess();

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred. Please try again.");
      }
    }

    setLoading(false);
  };

  // Handles guest access
  const handleGuestView = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onGuestLogin();
    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <Logo />
      <h2 className="text-center text-xl font-semibold text-green-700 mb-4">
        Welcome to Culinary Cloud!
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* Login Form */}
      <form className="space-y-4" onSubmit={handleLogin}>
        <InputField 
          label="Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <InputField 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        {/* <button onClick={()=>}>SignIn with Google</button> */}
        <button
          type="button"
          onClick={() => window.location.href = "http://localhost:5001/api/auth/google"}
          className="w-full h-10 flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-100 transition duration-200"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>
        <Button text="Sign in" loading={loading} onClick={handleLogin} />
      </form>

      {/* Additional Actions */}
      <div className="flex items-center justify-between mt-6">
        <button 
          onClick={toggleScreen} 
          className="w-1/2 text-green-700 font-semibold hover:underline text-center"
        >
          Sign up
        </button>

        <span className="px-2 text-gray-400 font-medium select-none">OR</span>

        <button 
          onClick={handleGuestView} 
          className="w-1/2 text-blue-500 font-semibold hover:underline text-center"
        >
          Guest
        </button>
      </div>

    </div>
  );
}