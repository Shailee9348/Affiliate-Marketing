"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Affiliates", href: "/affiliates", icon: "Users" },
  ];

  return (
    <aside className="bg-base-100 w-80 min-h-full flex flex-col border-r border-base-200 text-base-content transition-all duration-300">
      {/* Logo Section */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-base-200 bg-base-100/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content shadow-lg shadow-primary/20">
          <Icon name="BarChart2" size={20} />
        </div>
        <span className="text-lg font-bold tracking-tight">AffiliatePro</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="menu menu-lg gap-2 p-0">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? "bg-primary text-primary-content shadow-md shadow-primary/20 font-medium" 
                      : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                    }
                  `}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    className={`transition-colors ${isActive ? "text-primary-content" : "text-base-content/50 group-hover:text-base-content"}`} 
                  />
                  {item.name}
                  {isActive && (
                    <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/50"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Version Info */}
      <div className="p-4 border-t border-base-200 bg-base-50/50">
        <div className="card bg-base-200/50 border border-base-200 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-info/10 text-info">
              <Icon name="Info" size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-xs font-medium">Operational</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-base-content/30 mt-4">
          v1.0.2 &copy; 2024 AffiliatePro
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;