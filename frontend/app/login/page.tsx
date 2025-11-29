"use client";

import { useState } from "react";
import Link from "next/link";
import TopBanner from "@/components/TopBanner";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Login successful!");
        setShowSuccess(true);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
      <TopBanner
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Log in</h1>
          <p className="text-gray-500 text-sm mt-1">Continue to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <button className="w-full py-3 border rounded-full flex items-center justify-center gap-2 hover:bg-gray-100 transition mb-6 font-medium">
          <img src="/Google__G__logo.svg" className="w-5" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="text-gray-400 text-sm">OR</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 peer bg-transparent z-10 relative"
              required
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none peer-focus:text-blue-500 ${
                formData.email
                  ? "-top-2px text-xs text-gray-500 bg-white px-1 z-20"
                  : "top-3 text-gray-400"
              }`}
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 peer bg-transparent z-10 relative"
              required
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none peer-focus:text-blue-500 ${
                formData.password
                  ? "-top-2px text-xs text-gray-500 bg-white px-1 z-20"
                  : "top-3 text-gray-400"
              }`}
            >
              Password
            </label>
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-orange-500 text-white rounded-full transition font-semibold ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-600"
            }`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          New to Reddit?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
