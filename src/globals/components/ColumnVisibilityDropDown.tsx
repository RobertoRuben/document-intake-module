import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/modules/core/components/ui/dropdown-menu";

interface ColumnDefinition {
    id: string;
    isVisible: boolean;
    toggleVisibility: (value: boolean) => void;
    getCanHide: () => boolean;
    label?: string; 
}

interface ColumnVisibilityDropdownProps {
    columns: ColumnDefinition[];
    buttonText?: string; 
    buttonClassName?: string; 
    columnLabels?: Record<string, string>; 
}

export const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({ 
    columns, 
    buttonText = "Columnas",
    buttonClassName = "w-full",
    columnLabels = {} 
}) => {
    const getColumnLabel = (column: ColumnDefinition): string => {
        if (column.label) {
            return column.label;
        }
        if (columnLabels[column.id]) {
            return columnLabels[column.id];
        }
        
        switch (column.id) {
            case "id": return "ID";
            case "createdAt": return "Fecha de creación";
            case "updatedAt": return "Fecha de actualización";
            case "actions": return "Acciones";
            default: return column.id;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={buttonClassName}>
                    {buttonText} <ChevronDown className="ml-2 h-4 w-4" />
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
                            {getColumnLabel(column)}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};