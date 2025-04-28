import { NavItem } from '../types/sidebar.types';
import { Settings, UserCheck } from 'lucide-react';

export const navItems: NavItem[] = [
    {
        name: "Sistema",
        icon: Settings,
        subItems: [
            {
                name: "Roles",
                path: "/roles",
                icon: UserCheck
            }
        ]
    }
];