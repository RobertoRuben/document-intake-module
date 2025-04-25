"use client";

import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLayoutStateHook } from "./hooks/use-layout-state.hook.ts";
import { Sidebar } from "../sidebar/Sidebar";
import { Header } from "../header/Header";
import { MainContent } from "../main-content/MainContent";
import { Footer } from "../footer/Footer";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

export function Layout() {
  const {
    sidebarOpen,
    setSidebarOpen,
    modalOpen,
    setModalOpen,
    notificationCount,
    unconfirmedCount,
    isLoading,
    handleViewNotifications,
    headerTitle
  } = useLayoutStateHook();

  return (
      <div
          className={`flex h-screen overflow-hidden bg-gray-100 ${
              modalOpen ? "pointer-events-none" : "pointer-events-auto"
          }`}
      >
        <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            unconfirmedCount={unconfirmedCount}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
              onOpenSidebar={() => setSidebarOpen(true)}
              title={headerTitle}
              notificationCount={notificationCount}
              onViewNotifications={handleViewNotifications}
              onModalStateChange={setModalOpen}
          />

          <MainContent>
            <AnimatePresence>
              {isLoading && <LoadingSpinner />}
            </AnimatePresence>
            {!isLoading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                  <Outlet />
                </motion.div>
            )}
          </MainContent>

          <Footer />
        </div>
      </div>
  );
}