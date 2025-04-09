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
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");

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
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
      formData.append("dietaryPreferences", JSON.stringify(selectedCategories));
      if(bio)
      {
        formData.append("bio",bio);
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);


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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={4}
            placeholder="Tell us a bit about yourself..."
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
        <button
          onClick={toggleScreen}
          className="text-green-700 font-semibold hover:underline"
        >
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
}
