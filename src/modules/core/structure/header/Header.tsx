import { Menu } from 'lucide-react';
import { NotificationMenu } from './components/NotificationMenu';
import { UserMenu } from './components/UserMenu';
import { useHeaderDropdownsHook } from './hooks/use-header-dropdowns.hook.ts';

interface HeaderProps {
  onOpenSidebar: () => void;
  title: string;
  notificationCount: number;
  onViewNotifications: () => void;
  onModalStateChange: (isOpen: boolean) => void;
}

export function Header({
  onOpenSidebar,
  title,
  notificationCount,
  onViewNotifications,
  onModalStateChange
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