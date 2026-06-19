import React from "react";
import { useAuth } from "../context/AuthContext";

function DashboardHeader() {
  const { user } = useAuth();
  return (
    <header className="flex justify-between items-center p-6 bg-white/60 backdrop-blur-md rounded-2xl mx-4 mt-4 border border-sky-100 shadow-sm">
      <h2 className="text-m font-semibold text-sky-800">welcome back</h2>

      <span>{user?.name}</span>
    </header>
  );
}

export default DashboardHeader;
