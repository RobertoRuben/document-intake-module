import React from "react";
import { motion } from "framer-motion";
import { TableCell } from "@/modules/core/components/ui/table";
import { DepartmentModel } from "@/modules/departments/models/department.model";
import { TableActions } from "@/globals/components/TableActions";

interface DepartmentTableRowProps {
    department: DepartmentModel;
    index: number;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onView?: (id?: number) => void;
}

const rowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

export const DepartmentTableRow: React.FC<DepartmentTableRowProps> = ({ 
    department, 
    index, 
    onEdit, 
    onDelete,
    onView 
}) => {
    const actions = [
        ...(onView ? [{ type: 'view' as const, onClick: () => onView(department.id) }] : []),
        { type: 'edit' as const, onClick: () => onEdit(department.id) },
        { type: 'delete' as const, onClick: () => onDelete(department.id) }
    ];

    return (
        <motion.tr
            key={department.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
        >
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {String(department.id).padStart(5, "0")}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {department.name}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TableActions 
                    id={department.id} 
                    actions={actions}
                    variant="hybrid"
                />
            </TableCell>
        </motion.tr>
    );
};