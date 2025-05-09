import { NavItem } from '../types/sidebar.types';
import { Settings, Building2, Briefcase, BadgeCheck, Users, Shield } from 'lucide-react';

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
            },
            {
                name: "Empleados",
                path: "/employees",
                icon: Users
            }
        ]
    },
    {
        name: "Sistema",
        icon: Settings,
        subItems: [
            {
                name: "Usuarios",
                path: "/users",
                icon: Users
            },
            {
                name: "Roles",
                path: "/roles",
                icon: Shield
            },
        ]
    },
];