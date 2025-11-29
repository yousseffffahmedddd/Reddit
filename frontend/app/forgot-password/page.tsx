"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
        {/* Title */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Reset your password
          </h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Email Field */}
        <form className="space-y-6">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 peer bg-transparent z-10 relative"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none peer-focus:text-blue-500 ${
                email
                  ? "-top-2px text-xs text-gray-500 bg-white px-1 z-20"
                  : "top-3 text-gray-400"
              }`}
            >
              Email
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold"
          >
            Send reset link
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
