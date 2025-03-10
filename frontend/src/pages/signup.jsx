import React from "react";
// import "../styles/styles.css";
import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Logo from "../components/Logo";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    console.log("Signing up with:", { email, password });

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <Logo />
        <h2 className="text-center text-xl font-semibold text-green-700 mb-4">
          Create an Account
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleSignup}>
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Button text="Sign up" loading={loading} />
        </form>

        <div className="flex justify-between text-sm text-gray-600 mt-4">
          <a href="/login" className="text-green-700 font-semibold hover:underline">Already have an account? Log in</a>
        </div>
      </div>
    </div>
  );
}
