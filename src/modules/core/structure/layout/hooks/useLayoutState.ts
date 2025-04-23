import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoadingSpinnerContext } from "../../loading-spinner/hooks/useLoadingSpinnerContext";

export function useLayoutState() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unconfirmedCount, setUnconfirmedCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, showLoading, hideLoading } = useLoadingSpinnerContext();

  const handleViewNotifications = () => {
    navigate("/notificaciones");
  };

  const excludedRoutes = ["/inicio", "/dashboard"];
  const shouldShowContentHeader = !excludedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

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
    shouldShowContentHeader,
    headerTitle
  };
}