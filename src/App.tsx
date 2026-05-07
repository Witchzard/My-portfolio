import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminExperiences from "./pages/admin/AdminExperiences";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminSkills from "./pages/admin/AdminSkills";
import Login from "./pages/auth/Login";
import Home from "./pages/public/Home";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>
          
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="experiences" element={<AdminExperiences />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="blogs" element={<AdminBlogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}
