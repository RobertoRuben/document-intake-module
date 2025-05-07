import React from "react";
import {
    TableHeader,
    TableHead,
    TableRow,
} from "@/modules/core/components/ui/table";

export const PositionTableHeader: React.FC = () => {
    return (
        <TableHeader>
            <TableRow className="bg-[#145A32] border-b border-[#0E3D22] hover:bg-[#0E3D22]">
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Id
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Nombre
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                    Acciones
                </TableHead>
            </TableRow>
        </TableHeader>
    );
};