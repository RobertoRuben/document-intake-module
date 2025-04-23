import { useState } from 'react';

export const useHeaderState = (onModalStateChange: (isOpen: boolean) => void) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleProfileModalOpen = () => {
        setIsProfileModalOpen(true);
        onModalStateChange(true);
    };

    const handleProfileModalClose = () => {
        setIsProfileModalOpen(false);
        onModalStateChange(false);
    };

    const handleLogoutModalOpen = () => {
        setIsLogoutModalOpen(true);
        onModalStateChange(true);
    };

    const handleLogoutModalClose = () => {
        setIsLogoutModalOpen(false);
        onModalStateChange(false);
    };

    const handleLogout = () => {
        handleLogoutModalClose();
    };

    return {
        isProfileModalOpen,
        isLogoutModalOpen,
        handleProfileModalOpen,
        handleProfileModalClose,
        handleLogoutModalOpen,
        handleLogoutModalClose,
        handleLogout
    };
};