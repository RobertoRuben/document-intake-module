import React from "react";
import { motion } from "framer-motion";
import { TableCell } from "@/modules/core/components/ui/table";
import { User, UserStatus } from "../../models/user.model";
import { TableActions } from "@/globals/components/TableActions";
import { Badge } from "@/modules/core/components/ui/badge";

interface UserTableRowProps {
    user: User;
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

export const UserTableRow: React.FC<UserTableRowProps> = ({ 
    user, 
    index, 
    onEdit, 
    onDelete,
    onView 
}) => {
    const actions = [
        ...(onView ? [{ type: 'view' as const, onClick: () => onView(user.id) }] : []),
        { type: 'edit' as const, onClick: () => onEdit(user.id) },
        { type: 'delete' as const, onClick: () => onDelete(user.id) }
    ];

    const formatStatus = (status: UserStatus) => {
        switch (status) {
            case UserStatus.ACTIVATE:
                return (
                    <Badge className="bg-green-600 hover:bg-green-700">
                        Activo
                    </Badge>
                );
            case UserStatus.DEACTIVATE:
                return (
                    <Badge className="bg-red-600 hover:bg-red-700">
                        Inactivo
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-500 hover:bg-gray-600">
                        Desconocido
                    </Badge>
                );
        }
    };

    return (
        <motion.tr
            key={user.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
        >
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {String(user.id).padStart(5, "0")}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.username}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.employeeName || 'No asignado'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatStatus(user.isActive)}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.roleName || 'No asignado'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'No disponible'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'No disponible'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TableActions 
                    id={user.id} 
                    actions={actions}
                    variant="hybrid"
                />
            </TableCell>
        </motion.tr>
    );
};