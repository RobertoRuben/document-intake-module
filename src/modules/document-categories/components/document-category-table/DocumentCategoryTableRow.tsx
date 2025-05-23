import React from "react";
import { motion } from "framer-motion";
import { TableCell } from "@/modules/core/components/ui/table";
import { DocumentCategory } from "../../model/document-category.model";
import { TableActions } from "@/globals/components/TableActions";
import { formatDateLima } from "@/globals/utils/dateUtils";

interface DocumentCategoryTableRowProps {
    documentCategory: DocumentCategory;
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

export const DocumentCategoryTableRow: React.FC<DocumentCategoryTableRowProps> = ({ 
    documentCategory, 
    index, 
    onEdit, 
    onDelete,
    onView 
}) => {
    const actions = [
        ...(onView ? [{ type: 'view' as const, onClick: () => onView(documentCategory.id) }] : []),
        { type: 'edit' as const, onClick: () => onEdit(documentCategory.id) },
        { type: 'delete' as const, onClick: () => onDelete(documentCategory.id) }
    ];

    return (
        <motion.tr
            key={documentCategory.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
        >
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {String(documentCategory.id).padStart(5, "0")}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {documentCategory.name}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {documentCategory.createdAt ? formatDateLima(documentCategory.createdAt) : 'N/A'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {documentCategory.updatedAt ? formatDateLima(documentCategory.updatedAt) : 'N/A'}
            </TableCell>
            <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TableActions 
                    id={documentCategory.id} 
                    actions={actions}
                    variant="hybrid"
                />
            </TableCell>
        </motion.tr>
    );
};