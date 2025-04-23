import { NavItem, NavSubItem } from '../types/sidebar.types';
import { SidebarMenuItem } from './SidebarMenuItem';

type SidebarNavigationProps = {
    filteredNavItems: NavItem[];
    openMenus: { [key: string]: boolean };
    toggleMenu: (name: string) => void;
    getFilteredSubItems: (item: NavItem) => NavSubItem[];
    onClose: () => void;
    unconfirmedCount: number;
};

export function SidebarNavigation({ 
    filteredNavItems, 
    openMenus, 
    toggleMenu, 
    getFilteredSubItems,
    onClose,
    unconfirmedCount
}: SidebarNavigationProps) {
    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <nav>
                <ul className="space-y-2">
                    {filteredNavItems.map((item: NavItem, index: number) => {
                        const filteredSubItems = getFilteredSubItems(item);
                        return (
                            <li key={index}>
                                <SidebarMenuItem 
                                    item={item}
                                    openMenus={openMenus}
                                    toggleMenu={toggleMenu}
                                    onClose={onClose}
                                    filteredSubItems={filteredSubItems}
                                    unconfirmedCount={unconfirmedCount}
                                />
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}