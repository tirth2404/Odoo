import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import LandingPage from "./components/LandingPage.jsx";
import RegisterScreen from "./components/RegisterScreen.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminItems from "./components/admin/AdminItems.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";
import AdminFeatured from "./components/admin/AdminFeatured.jsx";
import AdminAnalytics from "./components/admin/AdminAnalytics.jsx";
import SwapDashboard from "./components/SwapDashboard.jsx";
import SwapDetail from "./components/SwapDetail.jsx";
import SwapRequest from "./components/SwapRequest.jsx";
import AddItem from "./components/AddItem.jsx";
import ItemDetail from "./components/ItemDetail.jsx";
import MensWear from "./components/MensWear.jsx";
import WomensWear from "./components/WomensWear.jsx";
import KidsWear from "./components/KidsWear.jsx";
import Accessories from "./components/Accessories.jsx";
import Footwear from "./components/Footwear.jsx";
import Outerwear from "./components/Outerwear.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "login", element: <LoginScreen /> },
      { path: "register", element: <RegisterScreen /> },
      { path: "dashboard", element: <UserDashboard /> },
      { path: "userDashboard", element: <UserDashboard /> },
      { path: "admin/login", element: <LoginScreen /> },
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/items", element: <AdminItems /> },
      { path: "admin/users", element: <AdminUsers /> },
      { path: "admin/featured", element: <AdminFeatured /> },
      { path: "admin/analytics", element: <AdminAnalytics /> },
      { path: "swaps", element: <SwapDashboard /> },
      { path: "swaps/:swapId", element: <SwapDetail /> },
      { path: "swap-request/:itemId", element: <SwapRequest /> },
      { path: "item/:itemId", element: <ItemDetail /> },
      { path: "add-item", element: <AddItem /> },
      { path: "mens-wear", element: <MensWear /> },
      { path: "womens-wear", element: <WomensWear /> },
      { path: "kids-wear", element: <KidsWear /> },
      { path: "accessories", element: <Accessories /> },
      { path: "footwear", element: <Footwear /> },
      { path: "outerwear", element: <Outerwear /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
