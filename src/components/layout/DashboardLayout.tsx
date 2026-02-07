import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

const DashboardLayout = () => {
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
