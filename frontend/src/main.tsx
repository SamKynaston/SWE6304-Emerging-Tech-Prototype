import { StrictMode, use } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Styling
import "./Styles/tailwind.css";

// Icon
import icon from "../public/logo.svg"

// Components
import Navigation from "./Components/Navigation";

// Pages
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import Footer from "./Components/Footer";
import AccountPage from "./Pages/Account";
import AuthenticationPage from "./Pages/Authentication";
import AccountEditPage from "./Pages/AccountEdit";
import ChatPage from "./Pages/Chat";
import PasswordResetPage from "./Pages/PasswordReset";
import AdminHome from "./Pages/Admin/Home";
import TimetablePage from "./Pages/Timetable";

// Admin
import AdminAccountPage from "./Pages/Admin/AdminAccountManagement";

import MobileNavigation from "./Components/MobileNavigation";
import { checkAuth, AuthProvider, useAuth } from "./Context/Authentication";

const bookDirectory = import.meta.env.VITE_BOOK_DIRECTORY || "/book";

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) return <div className="bg-gray-900 h-screen w-screen" />; 
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isMobileDevice, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(query.matches);
    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <BrowserRouter>      
      <AuthProvider>
        <AuthGate>
          {!isMobileDevice && <Navigation />}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthenticationPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="*" element={<Error code={404} />} />

            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/edit" element={<AccountEditPage />} />
            <Route path="/account/timetable" element={<TimetablePage />} />
            <Route path="/account/courses" element={<Home />} />
            <Route path="/account/chat" element={<ChatPage />} />

            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/accounts" element={<AdminAccountPage />} />
            <Route path="/admin/model" element={<Home />} />
            <Route path="/admin/modules" element={<Home />} />
            <Route path="/admin/courses" element={<Home />} />
          </Routes>

          {isMobileDevice && <MobileNavigation />}
          {!isMobileDevice && <Footer />}
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

export default App;
