import { useState, useMemo, useEffect } from "react";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import { Checkbox } from "@/modules/core/components/ui/checkbox";
import { DepartmentConnection } from "../model/department-connection.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { formatDateLima } from "@/globals/utils/dateUtils";

interface UseDepartmentConnectionTableProps {
  departmentConnections: DepartmentConnection[];
  dataVersion: number;
  paginationMeta: PaginationMetaModel;
  searchTerm: string;
  onEdit: (id?: number) => void;
  onDelete: (id?: number) => void;
  onBulkDelete?: (ids: number[]) => void;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

export const useDepartmentConnectionTable = ({
  departmentConnections,
  dataVersion,
  paginationMeta,
  searchTerm,
  onEdit,
  onDelete,
  onBulkDelete,
  onSearchChange,
  onPageChange,
}: UseDepartmentConnectionTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  const [selectedConnectionIds, setSelectedConnectionIds] = useState<
    Record<number, boolean>
  >({});
  const [totalSelectedRows, setTotalSelectedRows] = useState<number>(0);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    pageIndex: (paginationMeta?.currentPage || 1) - 1,
    pageSize: paginationMeta?.perPage || 5,
  });

  useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      actions: totalSelectedRows === 0,
    }));
  }, [totalSelectedRows]);

  const rowSelection = useMemo(() => {
    const selection: RowSelectionState = {};
    departmentConnections.forEach((connection, index) => {
      if (
        connection.id !== undefined &&
        (selectedConnectionIds[connection.id] || allSelected)
      ) {
        selection[index] = true;
      }
    });
    return selection;
  }, [departmentConnections, selectedConnectionIds, allSelected]);

  useEffect(() => {
    if (allSelected && paginationMeta?.total) {
      setTotalSelectedRows(paginationMeta.total);
    } else {
      const selectedCount = Object.values(selectedConnectionIds).filter(
        Boolean
      ).length;
      setTotalSelectedRows(selectedCount);
    }
  }, [selectedConnectionIds, paginationMeta?.total, allSelected]);

  const getSelectedConnectionIds = (): number[] => {
    if (allSelected) {
      return departmentConnections.map((connection) => connection.id as number);
    } else {
      return Object.keys(selectedConnectionIds)
        .filter((id) => selectedConnectionIds[Number(id)])
        .map((id) => Number(id));
    }
  };

  const handleBulkDelete = () => {
    const selectedIds = getSelectedConnectionIds();
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setAllSelected(false);
      setSelectedConnectionIds({});
      setTotalSelectedRows(0);
    } else {
      console.warn(
        "Función onBulkDelete no proporcionada o no hay conexiones seleccionadas"
      );
    }
  };

  const handleRowSelectionChange = (newSelection: RowSelectionState) => {
    const newSelectedConnectionIds = { ...selectedConnectionIds };

    Object.entries(newSelection).forEach(([indexStr, isSelected]) => {
      const index = parseInt(indexStr, 10);
      const connection = departmentConnections[index];

      if (connection && typeof connection.id === "number") {
        if (isSelected) {
          newSelectedConnectionIds[connection.id] = true;
        } else {
          delete newSelectedConnectionIds[connection.id];
        }
      }
    });

    const allCurrentPageSelected =
      departmentConnections.length > 0 &&
      departmentConnections.every(
        (connection) =>
          typeof connection.id === "number" &&
          newSelectedConnectionIds[connection.id]
      );

    if (
      allCurrentPageSelected &&
      Object.keys(newSelectedConnectionIds).length === paginationMeta?.total
    ) {
      setAllSelected(true);
    } else if (Object.keys(newSelectedConnectionIds).length === 0) {
      setAllSelected(false);
    }

    setSelectedConnectionIds(newSelectedConnectionIds);
  };

  const columns = useMemo<ColumnDef<DepartmentConnection>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getRowModel().rows.length > 0 &&
              (allSelected || table.getIsAllRowsSelected())
            }
            onCheckedChange={(value) => {
              table.toggleAllRowsSelected(!!value);

              if (value) {
                setAllSelected(true);

                if (paginationMeta?.total) {
                  setTotalSelectedRows(paginationMeta.total);
                }
              } else {
                setAllSelected(false);
                setSelectedConnectionIds({});
                setTotalSelectedRows(0);
              }
            }}
            aria-label="Seleccionar todos"
          />
        ),
        cell: ({ row }) => {
          const connection = row.original;
          return (
            <Checkbox
              checked={
                allSelected ||
                (connection.id !== undefined &&
                  selectedConnectionIds[connection.id] === true)
              }
              onCheckedChange={(value) => {
                row.toggleSelected(!!value);

                if (value) {
                  if (typeof connection.id === "number") {
                    const id = connection.id;
                    setSelectedConnectionIds((prev) => ({
                      ...prev,
                      [id.toString()]: true,
                    }));
                  }
                } else {
                  setSelectedConnectionIds((prev) => {
                    const updated = { ...prev };
                    if (typeof connection.id === "number") {
                      delete updated[connection.id];
                    }
                    return updated;
                  });

                  if (allSelected) {
                    setAllSelected(false);
                  }
                }
              }}
              aria-label="Seleccionar fila"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {String(row.original.id).padStart(5, "0")}
          </div>
        ),
      },
      {
        accessorKey: "sourceDepartmentName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Departamento Origen
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>{row.original.sourceDepartmentName || "No asignado"}</div>
        ),
      },
      {
        accessorKey: "targetDepartmentName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Departamento Destino
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>{row.original.targetDepartmentName || "No asignado"}</div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha de creación
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{formatDateLima(row.original.createdAt)}</div>,
        enableHiding: true,
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha de actualización
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{formatDateLima(row.original.updatedAt)}</div>,
        enableHiding: true,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Acciones</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              onClick={() => onEdit(row.original.id)}
              className="bg-amber-500 text-white hover:bg-amber-600 mr-2"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => onDelete(row.original.id)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [
      onEdit,
      onDelete,
      allSelected,
      paginationMeta?.total,
      selectedConnectionIds,
    ]
  );

  useEffect(() => {
    if (searchTerm) {
      setColumnFilters([{ id: "sourceDepartmentName", value: searchTerm }]);
    } else {
      setColumnFilters([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const backendPageIndex = (paginationMeta?.currentPage || 1) - 1;
    if (pagination.pageIndex !== backendPageIndex) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: backendPageIndex,
      }));
    }
  }, [paginationMeta?.currentPage, pagination.pageIndex]);

  const handlePaginationChange = (updatedPagination: typeof pagination) => {
    setPagination(updatedPagination);
    if (updatedPagination.pageIndex !== pagination.pageIndex) {
      onPageChange(updatedPagination.pageIndex + 1);
    }
  };

  const tableVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection: handleRowSelectionChange,
    totalSelectedRows,
    pagination,
    setPagination: handlePaginationChange,
    columns,
    tableVariants,
    isEmpty: departmentConnections.length === 0,
    dataVersion,
    searchTerm,
    onSearchChange,
    allSelected,
    setAllSelected,
    handleBulkDelete,
    getSelectedConnectionIds,
    departmentConnections,
  };
};
