import React from "react";
import UserDashboard from "./components/UserDashboard";
import LoginScreen from "./components/LoginScreen";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
