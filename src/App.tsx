import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import FuelEntry from "./pages/FuelEntry";
import Trucks from "./pages/Trucks";
import Drivers from "./pages/Drivers";
import Customers from "./pages/Customers";
import BudgetedRates from "./pages/BudgetedRates";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/fuel-entry" element={
        <ProtectedRoute>
          <FuelEntry />
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      
      <Route path="/trucks" element={
        <ProtectedRoute requireAdmin>
          <Trucks />
        </ProtectedRoute>
      } />
      
      <Route path="/drivers" element={
        <ProtectedRoute requireAdmin>
          <Drivers />
        </ProtectedRoute>
      } />
      
      <Route path="/customers" element={
        <ProtectedRoute requireAdmin>
          <Customers />
        </ProtectedRoute>
      } />
      
      <Route path="/rates" element={
        <ProtectedRoute requireAdmin>
          <BudgetedRates />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute requireAdmin>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
