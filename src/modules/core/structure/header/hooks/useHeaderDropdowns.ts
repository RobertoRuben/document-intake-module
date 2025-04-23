import { useState } from 'react';

export type DropdownType = 'notifications' | 'profile' | null;

export function useHeaderDropdowns() {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  
  const toggleDropdown = (dropdown: DropdownType) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };
  
  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };
  
  return {
    openDropdown,
    toggleDropdown,
    closeAllDropdowns,
    isNotificationOpen: openDropdown === 'notifications',
    isProfileOpen: openDropdown === 'profile'
  };
}