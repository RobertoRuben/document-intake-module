import { NavItem } from '../types/sidebar.types';
import { Settings, UserCheck, Building2, Briefcase, BadgeCheck } from 'lucide-react';

export const navItems: NavItem[] = [
    {
        name: "Empresa",
        icon: Briefcase,
        subItems: [
            {
                name: "Departamentos",
                path: "/departments",
                icon: Building2
            },
            {
                name: "Cargos",
                path: "/positions",
                icon: BadgeCheck
            }
        ]
    },
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
];