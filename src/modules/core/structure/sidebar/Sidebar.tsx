import { SidebarProps } from './types/sidebar.types';
import { SidebarOverlay } from './components/SidebarOverlay';
import { SidebarContainer } from './components/SidebarContainer';

export function Sidebar({ isOpen, onClose, unconfirmedCount = 0 }: SidebarProps) {
    return (
        <>
            <SidebarOverlay isOpen={isOpen} onClose={onClose} />
            <SidebarContainer isOpen={isOpen} onClose={onClose} unconfirmedCount={unconfirmedCount} />
        </>
    );
}