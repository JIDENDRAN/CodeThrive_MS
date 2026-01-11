import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import Payments from "./pages/Payments";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/payments" element={<Payments />} />
          </Route>
        </Route>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
