import { ReactNode } from 'react';

export type HeaderProps = {
    onOpenSidebar: () => void;
    title: ReactNode;
    notificationCount: number;
    onViewNotifications: () => void;
    onModalStateChange: (isOpen: boolean) => void;
};

export type NotificationMenuProps = {
    notificationCount: number;
    onViewNotifications: () => void;
};

export type UserMenuProps = {
    onOpenProfileModal: () => void;
    onOpenLogoutModal: () => void;
};