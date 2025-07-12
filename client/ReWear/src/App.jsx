import React from "react";
import UserDashboard from "./components/UserDashboard";
import LoginScreen from "./components/LoginScreen";
import { Outlet } from "react-router";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  );
}

export default App;
