import React, { useState } from "react";
import { useOnboarding } from "../hooks";

const Onboarding = () => {
  const [formData, setFormData] = useState({
    username: "",
    avatar: "https://avatar.iran.liara.run/public/1"
  });
  
  const { onboardingMutation, isOnboarding, onboardingError } = useOnboarding();

  const avatarNumbers = Array.from({ length: 40 }, (_, i) => i + 1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (avatarNum) => {
    setFormData({
      ...formData,
      avatar: `https://avatar.iran.liara.run/public/${avatarNum}`
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      return;
    }
    onboardingMutation(formData);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-gray-300">Let's set up your profile</p>
        </div>

        {onboardingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {onboardingError.response?.data?.message || 'Onboarding failed'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar Selection */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3 text-center">
              Choose your avatar
            </label>
            <div className="flex justify-center mb-4">
              <img
                src={formData.avatar}
                alt="Selected avatar"
                className="size-36 rounded-full border-4 border-emerald-500"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto bg-slate-700 p-3 rounded-lg">
              {avatarNumbers.map((num) => (
                <img
                  key={num}
                  src={`https://avatar.iran.liara.run/public/${num}`}
                  alt={`Avatar ${num}`}
                  className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all hover:scale-110 ${
                    formData.avatar === `https://avatar.iran.liara.run/public/${num}`
                      ? 'border-emerald-500 scale-110'
                      : 'border-gray-600 hover:border-emerald-400'
                  }`}
                  onClick={() => handleAvatarSelect(num)}
                />
              ))}
            </div>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isOnboarding || !formData.username.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOnboarding ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            You can change these settings later in your profile
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;