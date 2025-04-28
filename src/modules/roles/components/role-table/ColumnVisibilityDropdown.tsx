import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/modules/core/components/ui/dropdown-menu";

interface ColumnVisibilityDropdownProps {
    columns: {
        id: string;
        isVisible: boolean;
        toggleVisibility: (value: boolean) => void;
        getCanHide: () => boolean;
    }[];
}

export const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({ columns }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                    Columnas <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {columns
                    .filter(column => column.getCanHide())
                    .map(column => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.isVisible}
                            onCheckedChange={value => column.toggleVisibility(!!value)}
                        >
                            {column.id === "id" ? "ID" :
                                column.id === "name" ? "Nombre" :
                                    column.id === "createdAt" ? "Fecha de creación" :
                                        column.id === "updatedAt" ? "Fecha de actualización" :
                                            column.id === "actions" ? "Acciones" : column.id}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};