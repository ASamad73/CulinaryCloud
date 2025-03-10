import React from "react";
// import "../styles/styles.css";
import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Logo from "../components/Logo";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API Call (Backend will handle actual logic)
    console.log("Logging in with:", { email, password });

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <Logo />
        <h2 className="text-center text-xl font-semibold text-green-700 mb-4">
          Welcome to Culinary Cloud!
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button text="Sign in" loading={loading} />
        </form>

        <div className="flex justify-between text-sm text-gray-600 mt-4">
        <button onClick={() => console.log("Forgot Password Clicked")} className="text-blue-500">
  Forgot password?
</button>
          <a href="/signup" className="text-green-700 font-semibold hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
