import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import { LoadingState } from "../components/ui/AsyncState";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, navigate, user]);

  if (loading) return <div className="min-h-screen bg-slate-50 pt-24"><LoadingState message="Checking your session..." /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <DashboardSidebar />
      <div className="min-w-0">
        <DashboardHeader />
        <main className="min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
