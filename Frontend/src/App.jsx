import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddBlog from "./pages/AddBlog";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import BlogDetails from "./pages/BlogDetails";
import DashboardComments from "./pages/DashboardComments";

function AppContent() {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith("/dashboard");
  return (
    <>
      {!isDashboardPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-blog" element={<Navigate to="/dashboard/add-blog" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />

        {/*  Dashboard routes with Outlet */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="comments" element={<DashboardComments />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "white",
              color: "#0c4a6e",
              border: "1px solid #bae6fd",
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: "#0ea5e9",
                secondary: "#fff",
              },
            },
            error: {
              style: {
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
              },
            },
          }}
        />
        <AppContent />
      </Router>
    </>
  );
}

export default App;
