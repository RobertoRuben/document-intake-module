import { NavItem } from '../types/sidebar.types';
import { Settings, Building2, Briefcase, BadgeCheck, Users, Shield, Map, MapPin, MapPinHouse, Network, FileText, FolderTree, BookOpen } from 'lucide-react';

export const navItems: NavItem[] = [

    {
        name: "Documentos",
        icon: FileText,
        subItems: [
            {
                name: "Categorías",
                path: "/document-categories",
                icon: FolderTree,
            },
            {
                name: "Ambitos Documentales",
                path: "/documentary-topics",
                icon: BookOpen,
            },
        ]
    },
    {
        name: "Ubicaciones",
        icon: Map,
        subItems: [
            {
                name: "Centros Poblados",
                path: "/settlements",
                icon: MapPin
            },
            {
                name: "Caserios",
                path: "/hamlets",
                icon: MapPinHouse
            },
        ]
    },
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
                name: "Conexiones",
                path: "/department-connections",
                icon: Network
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