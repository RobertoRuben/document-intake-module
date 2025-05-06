import { useState, useMemo, useEffect } from "react";
import {
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    ColumnDef,
    RowSelectionState
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import { Checkbox } from "@/modules/core/components/ui/checkbox";
import { DepartmentModel } from "@/modules/departments/models/department.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { formatDateLima } from "@/globals/utils/dateUtils";

interface UseDepartmentTableProps {
    departments: DepartmentModel[];
    dataVersion: number;
    paginationMeta: PaginationMetaModel;
    searchTerm: string;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onBulkDelete?: (ids: number[]) => void;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
}

export const useDepartmentTable = ({
                                 departments,
                                 dataVersion,
                                 paginationMeta,
                                 searchTerm,
                                 onEdit,
                                 onDelete,
                                 onBulkDelete,
                                 onSearchChange,
                                 onPageChange,
                             }: UseDepartmentTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        createdAt: false,
        updatedAt: false,
        actions: true,
    });
    
    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<Record<number, boolean>>({});
    const [totalSelectedRows, setTotalSelectedRows] = useState<number>(0);
    const [allSelected, setAllSelected] = useState<boolean>(false);

    const [pagination, setPagination] = useState({
        pageIndex: (paginationMeta?.currentPage || 1) - 1,
        pageSize: paginationMeta?.perPage || 5,
    });

    useEffect(() => {
        setColumnVisibility(prev => ({
            ...prev,
            actions: totalSelectedRows === 0
        }));
    }, [totalSelectedRows]);

    const rowSelection = useMemo(() => {
        const selection: RowSelectionState = {};
        departments.forEach((department, index) => {
            if (department.id !== undefined && (selectedDepartmentIds[department.id] || allSelected)) {
                selection[index] = true;
            }
        });
        return selection;
    }, [departments, selectedDepartmentIds, allSelected]);

    useEffect(() => {
        if (allSelected && paginationMeta?.total) {
            setTotalSelectedRows(paginationMeta.total);
        } else {
            const selectedCount = Object.values(selectedDepartmentIds).filter(Boolean).length;
            setTotalSelectedRows(selectedCount);
        }
    }, [selectedDepartmentIds, paginationMeta?.total, allSelected]);

    const getSelectedDepartmentIds = (): number[] => {
        if (allSelected) {
            return departments.map(department => department.id as number);
        } else {
            return Object.keys(selectedDepartmentIds)
                .filter(id => selectedDepartmentIds[Number(id)])
                .map(id => Number(id));
        }
    };

    const handleBulkDelete = () => {
        const selectedIds = getSelectedDepartmentIds();
        if (onBulkDelete && selectedIds.length > 0) {
            onBulkDelete(selectedIds);
            setAllSelected(false);
            setSelectedDepartmentIds({});
            setTotalSelectedRows(0);
        } else {
            console.warn("Función onBulkDelete no proporcionada o no hay departamentos seleccionados");
        }
    };

    const handleRowSelectionChange = (newSelection: RowSelectionState) => {
        const newSelectedDepartmentIds = { ...selectedDepartmentIds };
        
        Object.entries(newSelection).forEach(([indexStr, isSelected]) => {
            const index = parseInt(indexStr, 10);
            const department = departments[index];
            
            if (department && typeof department.id === 'number') {
                if (isSelected) {
                    newSelectedDepartmentIds[department.id] = true;
                } else {
                    delete newSelectedDepartmentIds[department.id];
                }
            }
        });
        
        const allCurrentPageSelected = 
            departments.length > 0 && 
            departments.every(department => typeof department.id === 'number' && newSelectedDepartmentIds[department.id]);
            
        if (allCurrentPageSelected && Object.keys(newSelectedDepartmentIds).length === paginationMeta?.total) {
            setAllSelected(true);
        } else if (Object.keys(newSelectedDepartmentIds).length === 0) {
            setAllSelected(false);
        }
        
        setSelectedDepartmentIds(newSelectedDepartmentIds);
    };

    const columns = useMemo<ColumnDef<DepartmentModel>[]>(
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
                                setSelectedDepartmentIds({});
                                setTotalSelectedRows(0);
                            }
                        }}
                        aria-label="Seleccionar todos"
                    />
                ),
                cell: ({ row }) => {
                    const department = row.original;
                    return (
                        <Checkbox
                            checked={allSelected || (department.id !== undefined && selectedDepartmentIds[department.id] === true)}
                            onCheckedChange={(value) => {
                                row.toggleSelected(!!value);
                                
                                if (value) {
                                    if (typeof department.id === 'number') {
                                        const id = department.id;
                                        setSelectedDepartmentIds(prev => ({ ...prev, [id.toString()]: true }));
                                    }
                                } else {
                                    setSelectedDepartmentIds(prev => {
                                        const updated = { ...prev };
                                        if (typeof department.id === 'number') {
                                            delete updated[department.id];
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
                accessorKey: "name",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nombre
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.name}</div>,
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
        [onEdit, onDelete, allSelected, paginationMeta?.total, selectedDepartmentIds]
    );

    useEffect(() => {
        if (searchTerm) {
            setColumnFilters([{ id: "name", value: searchTerm }]);
        } else {
            setColumnFilters([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        const backendPageIndex = (paginationMeta?.currentPage || 1) - 1;
        if (pagination.pageIndex !== backendPageIndex) {
            setPagination(prev => ({
                ...prev,
                pageIndex: backendPageIndex
            }));
        }
    }, [paginationMeta?.currentPage]);

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
        isEmpty: departments.length === 0,
        dataVersion,
        searchTerm,
        onSearchChange,
        allSelected,
        setAllSelected,
        handleBulkDelete,
        getSelectedDepartmentIds,
    };
};