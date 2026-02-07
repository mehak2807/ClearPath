import { Outlet, Navigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";
import { useUserRole } from "@/context/UserRoleContext";

const DashboardLayout = () => {
  const { userRole } = useUserRole();

  // If no role selected, redirect to home
  if (!userRole) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
