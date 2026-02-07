import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, Plug, QrCode, Settings, ShieldCheck, Home } from "lucide-react";
import { useUserRole, UserRole } from "@/context/UserRoleContext";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  roles: UserRole[];
}

const allNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["company"] },
  { label: "Inventory", icon: Package, path: "/inventory", roles: ["company"] },
  { label: "Verified Actors", icon: ShieldCheck, path: "/actors", roles: ["actor", "company"] },
  { label: "ERP Connect", icon: Plug, path: "/erp", roles: ["company"] },
  { label: "QR Verify", icon: QrCode, path: "/verify", roles: ["consumer", "company"] },
  { label: "Settings", icon: Settings, path: "/settings", roles: ["actor", "company"] },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, clearUserRole } = useUserRole();

  // Filter navigation items based on user role
  const navItems = allNavItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleBackToHome = () => {
    clearUserRole();
    navigate("/home");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-cp-sidebar flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <img
            src="/favicon.png"
            alt="ClearPath logo"
            className="w-8 h-8"
          />
        </div>
        <span className="text-xl font-bold tracking-tight text-sidebar-accent-foreground">
          ClearPath
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-cp-sidebar-active/15 text-sidebar-accent-foreground"
                  : "text-cp-sidebar-foreground hover:bg-cp-sidebar-hover hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-primary" : ""}`} />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </NavLink>
          );
        })}

        {/* Back to Home button */}
        <button
          onClick={handleBackToHome}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cp-sidebar-foreground hover:bg-cp-sidebar-hover hover:text-sidebar-accent-foreground transition-all duration-200 mt-4 border-t border-sidebar-border pt-4"
        >
          <Home className="w-[18px] h-[18px]" />
          Back to Home
        </button>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-cp-sidebar-hover flex items-center justify-center text-sm">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-accent-foreground truncate">Admin User</p>
            <p className="text-[11px] text-cp-sidebar-foreground truncate">admin@clearpath.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
