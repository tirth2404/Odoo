import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import LandingPage from "./components/LandingPage.jsx";
import RegisterScreen from "./components/RegisterScreen.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "login", element: <LoginScreen /> },
      { path: "register", element: <RegisterScreen /> },
      { path: "userDashboard", element: <UserDashboard /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
