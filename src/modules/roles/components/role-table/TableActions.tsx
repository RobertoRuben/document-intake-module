import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";

interface TableActionsProps {
    id?: number;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
}

export const TableActions: React.FC<TableActionsProps> = ({ id, onEdit, onDelete }) => {
    return (
        <>
            <Button
                onClick={() => onEdit(id)}
                className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
            >
                <Pencil className="w-5 h-5" />
            </Button>
            <Button
                onClick={() => onDelete(id)}
                className="bg-red-500 text-white hover:bg-red-600"
            >
                <Trash2 className="w-5 h-5" />
            </Button>
        </>
    );
};