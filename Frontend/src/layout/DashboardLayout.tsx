import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardHeader";
import DashboardHeader from "../components/DashboardSidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-sky-50 via-cyan-50 to-emerald-50 ">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-8 bg-white/70 backdrop-blur-md m-4 rounded-2xl shadow-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
