import React from "react";
import { motion } from "framer-motion";
import { TableCell } from "@/modules/core/components/ui/table";
import { DepartmentConnection } from "../../model/department-connection.model";
import { TableActions } from "@/globals/components/TableActions";
import { formatDateLima } from "@/globals/utils/dateUtils";

interface DepartmentConnectionTableRowProps {
  departmentConnection: DepartmentConnection;
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

export const DepartmentConnectionTableRow: React.FC<
  DepartmentConnectionTableRowProps
> = ({ departmentConnection, index, onEdit, onDelete, onView }) => {
  const actions = [
    ...(onView
      ? [
          {
            type: "view" as const,
            onClick: () => onView(departmentConnection.id),
          },
        ]
      : []),
    { type: "edit" as const, onClick: () => onEdit(departmentConnection.id) },
    {
      type: "delete" as const,
      onClick: () => onDelete(departmentConnection.id),
    },
  ];

  return (
    <motion.tr
      key={departmentConnection.id}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-gray-100`}
    >
      <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {String(departmentConnection.id).padStart(5, "0")}
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
        {departmentConnection.sourceDepartmentName || "No asignado"}
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
        {departmentConnection.targetDepartmentName || "No asignado"}
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
        {departmentConnection.createdAt
          ? formatDateLima(departmentConnection.createdAt)
          : "N/A"}
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
        {departmentConnection.updatedAt
          ? formatDateLima(departmentConnection.updatedAt)
          : "N/A"}
      </TableCell>
      <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <TableActions
          id={departmentConnection.id}
          actions={actions}
          variant="hybrid"
        />
      </TableCell>
    </motion.tr>
  );
};
