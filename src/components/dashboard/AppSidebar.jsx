import {
  LayoutDashboard,
  CreditCard,
  GitBranch,
  TrendingUp,
  Layers,
  Rocket,
  Settings,
  ChevronLeft,
  Users,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";

const navItems = [
  { title: "Overview", url: "/app", icon: LayoutDashboard },
  { title: "My Subscriptions", url: "/app/subscriptions", icon: CreditCard },
  { title: "Deploy Branch", url: "/app/deploy", icon: Rocket },
  { title: "Branch Dashboard", url: "/app/branch", icon: GitBranch },
  { title: "Passive Income", url: "/app/passive", icon: TrendingUp },
  { title: "Incubator", url: "/app/incubator", icon: Rocket },
  { title: "Referral System", url: "/app/referrals", icon: Users },
  { title: "Account", url: "/app/account", icon: Settings },
];

const AppSidebar = ({ collapsed, onToggle, isMobile }) => {
  const location = useLocation();
  const { shortAddress, disconnect } = useWallet();

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300`}
    >
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4 h-16 border-b border-sidebar-border`}>
        {!collapsed && (
          <Link
            to="/"
            className="font-display text-lg font-bold gradient-text hover:opacity-80 transition-opacity"
          >
            VaultIQ
          </Link>
        )}
        {/* Hide toggle on mobile — always collapsed */}
        {!isMobile && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.url ||
            (item.url !== "/app" && location.pathname.startsWith(item.url));

          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/app"}
              className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Connected</p>
            <p className="text-xs text-primary font-mono mt-1">{shortAddress}</p>
          </div>
          <button
            onClick={disconnect}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Disconnect
          </button>
        </div>
      )}

      {/* Collapsed footer — just disconnect icon */}
      {collapsed && (
        <div className="p-2 border-t border-sidebar-border flex justify-center">
          <button
            onClick={disconnect}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Disconnect"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
