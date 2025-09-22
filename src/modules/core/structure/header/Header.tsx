import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { NotificationMenu } from './components/NotificationMenu';
import { UserMenu } from './components/UserMenu';
import { useHeaderDropdownsHook } from './hooks/use-header-dropdowns.hook.ts';

interface HeaderProps {
  onOpenSidebar: () => void;
  title: string;
  notificationCount: number;
  onViewNotifications: () => void;
  onModalStateChange: (isOpen: boolean) => void;
  onToggleSidebarCollapsed: () => void;
  isSidebarCollapsed: boolean;
}

export function Header({
  onOpenSidebar,
  title,
  notificationCount,
  onViewNotifications,
  onModalStateChange,
  onToggleSidebarCollapsed,
  isSidebarCollapsed
}: HeaderProps) {
  const { openDropdown, toggleDropdown } = useHeaderDropdownsHook();

  const handleOpenProfileModal = () => {
    toggleDropdown(null);
    onModalStateChange(true);
    // Aquí podrías abrir el modal de perfil específico
  };

  const handleOpenLogoutModal = () => {
    toggleDropdown(null);
    onModalStateChange(true);
    // Aquí podrías abrir el modal de logout específico
  };

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white px-4 py-3 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden mr-2"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" strokeWidth={3} />
        </button>
        <button
          onClick={onToggleSidebarCollapsed}
          className="hidden lg:inline-flex items-center justify-center mr-3 rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/10 transition-colors"
          aria-label={isSidebarCollapsed ? 'Mostrar sidebar' : 'Ocultar sidebar'}
          title={isSidebarCollapsed ? 'Mostrar sidebar' : 'Ocultar sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" strokeWidth={3} />
          ) : (
            <ChevronLeft className="h-5 w-5" strokeWidth={3} />
          )}
        </button>
        <div className="text-xl font-medium">{title}</div>
      </div>
      <div className="flex items-center space-x-2">
        <NotificationMenu 
          notificationCount={notificationCount}
          onViewNotifications={onViewNotifications}
          openDropdown={openDropdown}
          toggleDropdown={toggleDropdown}
        />
        <UserMenu 
          onOpenProfileModal={handleOpenProfileModal}
          onOpenLogoutModal={handleOpenLogoutModal}
          openDropdown={openDropdown}
          toggleDropdown={toggleDropdown}
        />
      </div>
    </header>
  );
}