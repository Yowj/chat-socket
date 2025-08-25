import React from "react";

const ChatUser = ({ user, isOnline = false, onClick }) => {
  return (
    <div 
      className="flex items-center p-3 hover:bg-emerald-700 cursor-pointer transition-colors rounded-lg mx-2 my-1"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={user.avatar || `https://i.pravatar.cc/150?img=${user._id?.slice(-1) || 1}`}
          alt={user.username || user.email}
          className="w-10 h-10 rounded-full object-cover"
        />
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-emerald-800 rounded-full"></div>
        )}
      </div>
      
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium text-sm truncate">
            {user.username || user.email?.split('@')[0]}
          </h4>
          {isOnline && (
            <span className="text-green-400 text-xs">●</span>
          )}
        </div>
        <p className="text-emerald-300 text-xs truncate">
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default ChatUser;
