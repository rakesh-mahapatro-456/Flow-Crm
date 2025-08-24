import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/custom/AppSidebar";
import {SidebarTrigger} from "./components/ui/sidebar"

import ProtectedRoute from "./components/custom/ProtectedRoute";

import { getUserInfo } from "./store/feature/auth/authThunk";
import { useDispatch } from "react-redux";

// Pages
import Leads from "./pages/Lead";
import {LeadForm} from "./pages/LeadForm";
import LeadEdit from "./pages/LeadEdit";
import {Login} from "./pages/Login";
import {Signup} from "./pages/Signup";
import LandingPage from "./pages/LandingPage";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import "./App.css"

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated,user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserInfo());
    }
  }, [isAuthenticated, dispatch]);

  console.log(user);
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {/* Sidebar only for authenticated users */}
        {isAuthenticated && <AppSidebar />}

        {/* Main Content */}
        <main className="flex-1 h-full overflow-auto">
          {isAuthenticated && <SidebarTrigger />}

          <Routes>
            {/* Protected routes */}
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/create"
              element={
                <ProtectedRoute>
                  <LeadForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/edit/:id"
              element={
                <ProtectedRoute>
                  <LeadEdit />
                </ProtectedRoute>
              }
            />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<LandingPage />} />

            {/* Redirect unknown route */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/leads" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default App;
