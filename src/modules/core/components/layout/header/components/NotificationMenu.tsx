import { Bell } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';
import { NotificationMenuProps } from '../types/header.types';

export const NotificationMenu = ({ 
    notificationCount, 
    onViewNotifications 
}: NotificationMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Notificaciones"
                    className="relative text-white hover:bg-[#4F4F4F] transition-colors duration-200"
                >
                    <Bell className="h-5 w-5" strokeWidth={3} />
                    {notificationCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-[#03A64A] text-white rounded-full">
                            {notificationCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2 bg-white">
                <DropdownMenuItem
                    onClick={onViewNotifications}
                    className="text-[#333333] hover:bg-[#F2F2F2] flex items-center"
                >
                    <Bell className="mr-2 h-4 w-4" strokeWidth={3} />
                    Ver notificaciones
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};