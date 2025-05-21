import React from "react";
import {
  TableHeader,
  TableHead,
  TableRow,
} from "@/modules/core/components/ui/table";

export const DepartmentConnectionTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-[#145A32] border-b border-[#0E3D22] hover:bg-[#0E3D22]">
        <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
          Id
        </TableHead>
        <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
          Departamento Origen
        </TableHead>
        <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
          Departamento Destino
        </TableHead>
        <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
          Creado
        </TableHead>
        <TableHead className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
          Actualizado
        </TableHead>
        <TableHead className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
          Acciones
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
