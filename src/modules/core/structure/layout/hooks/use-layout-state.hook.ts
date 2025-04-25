import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoadingSpinnerContextHook } from "../../loading-spinner/hooks/use-loading-spinner-context.hook.ts";

export function useLayoutStateHook() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unconfirmedCount, setUnconfirmedCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, showLoading, hideLoading } = useLoadingSpinnerContextHook();

  const handleViewNotifications = () => {
    navigate("/notificaciones");
  };

  useEffect(() => {
    showLoading();

    const timer = setTimeout(() => {
      hideLoading();
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, showLoading, hideLoading]);

  const headerTitle = location.pathname === "/inicio" ? "Bienvenido" : "SGDOC";

  return {
    sidebarOpen,
    setSidebarOpen,
    modalOpen,
    setModalOpen,
    notificationCount,
    setNotificationCount,
    unconfirmedCount,
    setUnconfirmedCount,
    isLoading,
    handleViewNotifications,
    headerTitle
  };
}