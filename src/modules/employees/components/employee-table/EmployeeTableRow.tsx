import React from "react";
import { motion } from "framer-motion";
import { TableCell } from "@/modules/core/components/ui/table";
import { Employee } from "../../models/employee.model";
import { TableActions } from "@/globals/components/TableActions";

interface EmployeeTableRowProps {
    employee: Employee;
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

export const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({ 
    employee, 
    index, 
    onEdit, 
    onDelete,
    onView 
}) => {
    const actions = [
        ...(onView ? [{ type: 'view' as const, onClick: () => onView(employee.id) }] : []),
        { type: 'edit' as const, onClick: () => onEdit(employee.id) },
        { type: 'delete' as const, onClick: () => onDelete(employee.id) }
    ];

    const formatGender = (gender: string) => {
        switch (gender) {
            case 'Male':
                return 'Masculino';
            case 'Female':
                return 'Femenino';
            default:
                return 'Otro';
        }
    };

    return (
        <motion.tr
            key={employee.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
        >
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {String(employee.id).padStart(5, "0")}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {employee.dni}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {employee.paternalSurname}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {employee.maternalSurname}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {employee.names}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatGender(employee.gender)}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {employee.departmentName || 'No asignado'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {employee.positionName || 'No asignado'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TableActions 
                    id={employee.id} 
                    actions={actions}
                    variant="hybrid"
                />
            </TableCell>
        </motion.tr>
    );
};