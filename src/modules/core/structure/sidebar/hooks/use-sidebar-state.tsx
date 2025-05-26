import { useState } from 'react';
import { navItems } from '../config/sidebar-config.ts';
import { NavItem, NavSubItem } from '../types/sidebar.types';
import { TokenCookieUtils } from '@/globals/utils/cookieUtils';

export function useSidebarState(unconfirmedCount = 0) {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
    const userRole = TokenCookieUtils.getUserRole();
    
    const toggleMenu = (name: string) => {
        setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const filteredNavItems = navItems.filter((item) => {
        const hasParentAccess = !item.allowedRoles || item.allowedRoles.includes(userRole);
        const hasAccessibleSubItems = item.subItems 
            ? item.subItems.some(sub => !sub.allowedRoles || sub.allowedRoles.includes(userRole))
            : true;

        return hasParentAccess && hasAccessibleSubItems;
    });
    
    const getFilteredSubItems = (item: NavItem): NavSubItem[] => {
        return item.subItems?.filter(subItem => 
            !subItem.allowedRoles || subItem.allowedRoles.includes(userRole)
        ) || [];
    };
    
    return {
        openMenus,
        toggleMenu,
        filteredNavItems,
        getFilteredSubItems,
        userRole,
        unconfirmedCount
    };
}