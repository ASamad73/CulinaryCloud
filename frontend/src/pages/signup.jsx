import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Logo from "../components/Logo";
import DietaryPreferencesSelector from "../components/DietaryPreferencesSelector";
import { ALLOWED_CATEGORIES } from "../constants/dietaryCategories";

export default function SignupScreen({ onAuthSuccess, toggleScreen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Store the actual file rather than a string URL.
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle dietary preference checkboxes.
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      if (selectedCategories.length < 10) {
        setSelectedCategories([...selectedCategories, value]);
      } else {
        alert("You can only select up to 10 categories.");
      }
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== value));
    }
  };

  // Handle file selection for profile picture.
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create a FormData object to handle file upload along with other fields.
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      // Append the file if selected.
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
      // Append dietary preferences as a JSON string.
      formData.append("dietaryPreferences", JSON.stringify(selectedCategories));

      // Send a POST request to your backend registration endpoint.
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      // Assume the backend returns a token and user object.
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onAuthSuccess();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <Logo />
      <h2 className="text-center text-xl font-semibold text-green-700 mb-4">
        Create an Account
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form className="space-y-4" onSubmit={handleSignup}>
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
        <InputField 
          label="Confirm Password" 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        {/* New file input for uploading the profile picture */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </div>
        <DietaryPreferencesSelector
          allowedCategories={ALLOWED_CATEGORIES}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />
        <Button text="Sign up" loading={loading} onClick={handleSignup} />
      </form>

      <div className="flex justify-between text-sm text-gray-600 mt-4">
        <button onClick={toggleScreen} className="text-green-700 font-semibold hover:underline">
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
}
