import React from "react";
import { motion } from "framer-motion";
import { TableCell } from "@/modules/core/components/ui/table";
import { Hamlet } from "../../model/hamlet.model";
import { TableActions } from "@/globals/components/TableActions";

interface HamletTableRowProps {
    hamlet: Hamlet;
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

export const HamletTableRow: React.FC<HamletTableRowProps> = ({ 
    hamlet, 
    index, 
    onEdit, 
    onDelete,
    onView 
}) => {
    const actions = [
        ...(onView ? [{ type: 'view' as const, onClick: () => onView(hamlet.id) }] : []),
        { type: 'edit' as const, onClick: () => onEdit(hamlet.id) },
        { type: 'delete' as const, onClick: () => onDelete(hamlet.id) }
    ];

    return (
        <motion.tr
            key={hamlet.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
        >
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {String(hamlet.id).padStart(5, "0")}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {hamlet.name}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {hamlet.settlementName || 'No asignado'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {hamlet.createdAt ? hamlet.createdAt.toString() : 'N/A'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {hamlet.updatedAt ? hamlet.updatedAt.toString() : 'N/A'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TableActions 
                    id={hamlet.id} 
                    actions={actions}
                    variant="hybrid"
                />
            </TableCell>
        </motion.tr>
    );
};