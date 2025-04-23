import { LogOut, User, UserCircle } from 'lucide-react';
import { Button } from '@/modules/core/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/modules/core/components/ui/dropdown-menu';
import { UserMenuProps } from '../types/header.types';

export const UserMenu = ({ 
    onOpenProfileModal, 
    onOpenLogoutModal 
}: UserMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Perfil de usuario"
                    className="text-white hover:bg-[#4F4F4F] transition-colors duration-200"
                >
                    <User className="h-5 w-5" strokeWidth={3} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2 bg-white">
                <DropdownMenuItem
                    onClick={onOpenProfileModal}
                    className="text-[#333333] hover:bg-[#F2F2F2] flex items-center"
                >
                    <UserCircle className="mr-2 h-4 w-4" strokeWidth={3} />
                    Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onOpenLogoutModal}
                    className="text-[#333333] hover:bg-[#F2F2F2] flex items-center"
                >
                    <LogOut className="mr-2 h-4 w-4" strokeWidth={3} />
                    Cerrar sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};