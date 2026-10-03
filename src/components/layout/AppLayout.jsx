import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { MobileBottomNav } from '../common/MobileBottomNav';
import { Toast } from '../common/Toast';

export const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen pro-website-bg flex flex-col font-sans relative overflow-hidden">
      {/* Soft Ambient Background Lighting Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-teal-400/10 rounded-full filter blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full filter blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-[600px] h-[600px] bg-sky-400/8 rounded-full filter blur-[140px] pointer-events-none -z-10" />

      <Toast />
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 mb-16 lg:mb-0 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};
