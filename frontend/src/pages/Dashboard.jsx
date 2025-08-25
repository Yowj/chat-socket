import React, { useState, useEffect, useRef } from "react";
import ChatUser from "../components/ChatUser";
import { useAuthUser, useMessages, useSendMessage, useUsers, useSocket } from "../hooks";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  // Hooks
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const { users } = useUsers();
  const { messages } = useMessages({
    senderId: authUser?._id,
    receiverId: selectedUser?._id,
  });
  const { sendMessage, isSending } = useSendMessage();
  const socket = useSocket(authUser);

  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [localMessages?.length]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Received message:", data);
      setLocalMessages((prevMessages) => [...prevMessages, data]);
      
      // Invalidate queries to refetch messages when needed
      queryClient.invalidateQueries({
        queryKey: ["messages"]
      });
    };

    if (socket) {
      socket.on("receive-message", handleReceiveMessage);
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off("receive-message", handleReceiveMessage);
      }
    };
  }, [socket, queryClient]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        senderId: authUser._id,
        receiverId: selectedUser._id,
        message,
      };

      // Immediately add message to local state for instant feedback
      const localMessage = {
        _id: `temp-${Date.now()}`,
        sender_id: authUser._id,
        receiver_id: selectedUser._id,
        message,
        createdAt: new Date(),
      };
      setLocalMessages(prev => [...prev, localMessage]);

      // Send via socket for real-time delivery
      socket.emit("send-message", messageData);

      // Send via API for persistence
      sendMessage(messageData);
      setMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-br from-gray-700 to-gray-900 py-4 px-4">
      <div className="w-full max-w-7xl mx-auto bg-slate-800/90 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex h-[calc(100vh-120px)]">
          {/* Users Sidebar */}
          <div className="w-80 bg-emerald-800/90 border-r border-emerald-700">
            <div className="p-4 border-b border-emerald-700">
              <h2 className="text-white font-semibold text-lg flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Users
              </h2>
            </div>

            <div className="overflow-y-auto h-full pb-4">
              {users?.map((user) =>
                user._id === authUser._id ? null : (
                  <ChatUser key={user._id} user={user} onClick={() => setSelectedUser(user)} />
                )
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-slate-700/50 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-600 bg-slate-800/50">
                  <div className="flex items-center">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="text-white font-medium">{selectedUser.username}</h3>
                      <p className="text-emerald-300 text-sm">● Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  className="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth"
                  ref={messagesContainerRef}
                >
                  {localMessages?.length > 0 ? (
                    localMessages?.map((msg) => {
                      const isMyMessage = (msg.sender_id?._id || msg.sender_id) === authUser._id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isMyMessage
                                ? "bg-emerald-600 text-white rounded-br-sm"
                                : "bg-gray-200 text-gray-800 rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <div
                              className={`text-xs mt-1 ${
                                isMyMessage ? "text-emerald-100" : "text-gray-500"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <p>No messages yet</p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-600">
                  <form
                    className="flex items-center bg-slate-800 rounded-lg"
                    onSubmit={handleSendMessage}
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-white px-4 py-3 outline-none placeholder-gray-400"
                    />
                    <button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-r-lg transition-colors disabled:opacity-50"
                      onClick={handleSendMessage}
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : "Send"}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-medium mb-2">Welcome to Chat Socket</h3>
                  <p>Select a user from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
