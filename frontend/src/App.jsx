import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import { useAuthUser } from "./hooks";
import { socket } from "./lib/socket";

const App = () => {
  const { authUser } = useAuthUser();

  useEffect(() => {
    if (authUser?.isOnboarded && !socket.connected) {
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socket.emit("user-online", authUser._id);

      socket.on("online-users", (users) => {
        console.log("Online users:", users);
      });
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [authUser]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            authUser ? (
              authUser.isOnboarded ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={
            authUser ? (
              authUser.isOnboarded ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Signup />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            authUser ? (
              authUser.isOnboarded ? (
                <Navigate to="/dashboard" />
              ) : (
                <Onboarding />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            authUser ? (
              authUser.isOnboarded ? (
                <Dashboard />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
