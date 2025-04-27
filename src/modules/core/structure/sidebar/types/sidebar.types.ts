import { LucideIcon } from 'lucide-react';

export type NavSubItem = {
    name: string;
    path: string;
    allowedRoles?: string[];
    icon?: LucideIcon;
};

export type NavItem = {
    name: string;
    path?: string;
    icon: LucideIcon;
    subItems?: NavSubItem[];
    allowedRoles?: string[];
};

export type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    unconfirmedCount?: number;
};