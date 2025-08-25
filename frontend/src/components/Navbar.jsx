import React from "react";
import { useLogout, useAuthUser } from "../hooks";

const Navbar = () => {
  const { logoutMutation, isLoggingOut } = useLogout();
  const { authUser: user } = useAuthUser();

  return (
    <nav className="bg-gray-800 text-white h-16 ">
      <div className="flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Chat Socket</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-lg font-bold  text-lime-400">{user?.username}</span>
          {user && (
            <button
              onClick={logoutMutation}
              disabled={isLoggingOut}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
