import { SidebarProps } from '../types/sidebar.types';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { useSidebarState } from '../hooks/useSidebarState';

export function SidebarContainer({ isOpen, onClose, unconfirmedCount = 0 }: SidebarProps) {
    const { openMenus, toggleMenu, filteredNavItems, getFilteredSubItems } = useSidebarState(unconfirmedCount);

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#03A64A] to-black text-white p-4 transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:inset-auto flex-shrink-0 flex flex-col h-full`}
            aria-label="Sidebar de navegación"
        >
            <SidebarHeader onClose={onClose} />
            <SidebarNavigation 
                filteredNavItems={filteredNavItems}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                getFilteredSubItems={getFilteredSubItems}
                onClose={onClose}
                unconfirmedCount={unconfirmedCount}
            />
        </aside>
    );
}