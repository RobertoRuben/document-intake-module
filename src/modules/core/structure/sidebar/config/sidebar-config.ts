import { NavItem } from '../types/sidebar.types';
import { Settings, UserCheck, Building2 } from 'lucide-react';

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
    },
    {
        name: "Empresa",
        icon: Building2,
        subItems: [
            {
                name: "Departamentos",
                path: "/departments",
                icon: Building2
            }
        ]
    }
];