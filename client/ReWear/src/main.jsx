import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
// import Index from "./Index.jsx"; // If you have a home/index component

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // { path: "/", element: <Index /> },
      { path: "login", element: <LoginScreen /> },
      { path: "userDashboard", element: <UserDashboard /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
