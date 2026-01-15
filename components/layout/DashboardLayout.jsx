"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open bg-base-200 min-h-screen font-sans">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        {/* Top Navigation */}
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden w-full max-w-[1600px] mx-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div> 
      
      {/* Sidebar Drawer */}
      <div className="drawer-side z-40">
        <label 
          htmlFor="dashboard-drawer" 
          aria-label="close sidebar" 
          className="drawer-overlay bg-black/20 backdrop-blur-sm"
        ></label>
        
        {/* Sidebar Component */}
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;