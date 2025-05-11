import React from "react";
import { motion } from "framer-motion";
import { TableCell } from "@/modules/core/components/ui/table";
import { Role } from "@/modules/roles/models/role.model";
import { TableActions } from "./TableActions";

interface RoleTableRowProps {
    role: Role;
    index: number;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
}

const rowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

export const RoleTableRow: React.FC<RoleTableRowProps> = ({ role, index, onEdit, onDelete }) => {
    return (
        <motion.tr
            key={role.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
        >
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {String(role.id).padStart(5, "0")}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {role.name}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TableActions id={role.id} onEdit={onEdit} onDelete={onDelete} />
            </TableCell>
        </motion.tr>
    );
};