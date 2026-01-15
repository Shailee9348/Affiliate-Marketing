"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { api } from "@/lib/api";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Attempt to get current user from API service
    const currentUser = api.getUser();
    
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Redirect to login if no session exists
      router.push("/login");
    }

    // Listen for storage changes to update user state
    const handleStorageChange = () => {
      const updatedUser = api.getUser();
      setUser(updatedUser);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [router]);

  const handleLogout = async () => {
    await api.logout();
    router.push("/login");
  };

  if (!mounted) return <div className="navbar bg-base-100 h-16 border-b border-base-200"></div>;

  return (
    <header className="navbar bg-base-100 h-16 border-b border-base-200 sticky top-0 z-30 px-4 gap-4">
      {/* Mobile Menu Toggle */}
      <div className="flex-none lg:hidden">
        <label 
          htmlFor="dashboard-drawer" 
          aria-label="open sidebar" 
          className="btn btn-square btn-ghost btn-sm"
        >
          <Icon name="Menu" size={20} />
        </label>
      </div>

      {/* Brand Name (Mobile Only) */}
      <div className="flex-1 lg:hidden">
        <span className="text-lg font-bold tracking-tight">AffiliatePro</span>
      </div>

      {/* Spacer for Desktop */}
      <div className="flex-1 hidden lg:block"></div>

      {/* Right Side Actions */}
      <div className="flex-none flex items-center gap-3">
        
        {/* Theme Indicator (Static) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-base-200/50 rounded-full border border-base-200">
          <Icon name="Sun" size={14} className="text-warning" />
          <span className="text-xs font-medium text-base-content/70">Emerald</span>
        </div>

        {/* Notifications (Visual Only) */}
        <button className="btn btn-ghost btn-circle btn-sm relative">
          <Icon name="Bell" size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-base-100"></span>
        </button>

        <div className="w-px h-8 bg-base-200 mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost btn-circle avatar placeholder ring-2 ring-base-200 ring-offset-2 ring-offset-base-100"
          >
            <div className="bg-neutral text-neutral-content rounded-full w-9">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span className="text-lg font-semibold">{user?.name?.charAt(0) || "U"}</span>
              )}
            </div>
          </div>
          <ul 
            tabIndex={0} 
            className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-60 border border-base-200"
          >
            <li className="menu-title px-4 py-3 bg-base-200/30 rounded-t-lg mb-2">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-base-content text-sm">{user?.name || "User"}</span>
                <span className="text-xs font-normal text-base-content/60 truncate">{user?.email || "user@example.com"}</span>
              </div>
            </li>
            
            <li>
              <a className="py-2">
                <Icon name="User" size={16} />
                Profile Settings
              </a>
            </li>
            <li>
              <a className="py-2">
                <Icon name="Settings" size={16} />
                Preferences
              </a>
            </li>
            
            <div className="divider my-1"></div>
            
            <li>
              <button 
                onClick={handleLogout} 
                className="py-2 text-error hover:bg-error/10 hover:text-error active:bg-error/20"
              >
                <Icon name="LogOut" size={16} />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;