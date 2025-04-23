"use client";

import { Menu } from 'lucide-react';
import { HeaderProps } from './types/header.types';
import { NotificationMenu } from './components/NotificationMenu';
import { UserMenu } from './components/UserMenu';

export function Header({
    onOpenSidebar,
    title,
    notificationCount,
    onViewNotifications,
    onModalStateChange,
}: HeaderProps) {
    const handleProfileModalOpen = () => onModalStateChange(true);
    const handleLogoutModalOpen = () => onModalStateChange(true);

    return (
        <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-4 px-6 shadow-md w-full">
            <div className="flex items-center justify-between">
                <button
                    onClick={onOpenSidebar}
                    className="lg:hidden mr-4 text-white hover:text-[#E0E0E0] transition-colors duration-200"
                    aria-label="Abrir menú"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="flex-1 flex items-center">
                    <span className="font-bold text-lg">{title}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <NotificationMenu 
                        notificationCount={notificationCount}
                        onViewNotifications={onViewNotifications}
                    />
                    <UserMenu 
                        onOpenProfileModal={handleProfileModalOpen}
                        onOpenLogoutModal={handleLogoutModalOpen}
                    />
                </div>
            </div>
        </header>
    );
}