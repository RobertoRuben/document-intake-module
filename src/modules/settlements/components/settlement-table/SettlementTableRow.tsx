import React from "react";
import { motion } from "framer-motion";
import { TableCell } from "@/modules/core/components/ui/table";
import { Settlement } from "../../model/settlement.model";
import { TableActions } from "@/globals/components/TableActions";

interface SettlementTableRowProps {
    settlement: Settlement;
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

export const SettlementTableRow: React.FC<SettlementTableRowProps> = ({ 
    settlement, 
    index, 
    onEdit, 
    onDelete,
    onView 
}) => {
    const actions = [
        ...(onView ? [{ type: 'view' as const, onClick: () => onView(settlement.id) }] : []),
        { type: 'edit' as const, onClick: () => onEdit(settlement.id) },
        { type: 'delete' as const, onClick: () => onDelete(settlement.id) }
    ];

    return (
        <motion.tr
            key={settlement.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
        >
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {String(settlement.id).padStart(5, "0")}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {settlement.name}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TableActions 
                    id={settlement.id} 
                    actions={actions}
                    variant="hybrid"
                />
            </TableCell>
        </motion.tr>
    );
};