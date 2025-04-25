import { ReactNode } from 'react';

export type HeaderProps = {
    onOpenSidebar: () => void;
    title: ReactNode;
    notificationCount: number;
    onViewNotifications: () => void;
    onModalStateChange: (isOpen: boolean) => void;
};

import { DropdownType } from '../hooks/use-header-dropdowns.hook.ts';

export interface NotificationMenuProps {
  notificationCount: number;
  onViewNotifications: () => void;
  openDropdown: DropdownType;
  toggleDropdown: (dropdown: DropdownType) => void;
}

export interface UserMenuProps {
  onOpenProfileModal: () => void;
  onOpenLogoutModal: () => void;
  openDropdown: DropdownType;
  toggleDropdown: (dropdown: DropdownType) => void;
}