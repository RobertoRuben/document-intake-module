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
import { Hamlet } from "../model/hamlet.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { formatDateLima } from "@/globals/utils/dateUtils";

interface UseHamletTableProps {
    hamlets: Hamlet[];
    dataVersion: number;
    paginationMeta: PaginationMetaModel;
    searchTerm: string;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onBulkDelete?: (ids: number[]) => void;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
}

export const useHamletTable = ({
    hamlets,
    dataVersion,
    paginationMeta,
    searchTerm,
    onEdit,
    onDelete,
    onBulkDelete,
    onSearchChange,
    onPageChange,
}: UseHamletTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        createdAt: false,
        updatedAt: false,
        settlementName: false,
        actions: true,
    });
    
    const [selectedHamletIds, setSelectedHamletIds] = useState<Record<number, boolean>>({});
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
        hamlets.forEach((hamlet, index) => {
            if (hamlet.id !== undefined && (selectedHamletIds[hamlet.id] || allSelected)) {
                selection[index] = true;
            }
        });
        return selection;
    }, [hamlets, selectedHamletIds, allSelected]);

    useEffect(() => {
        if (allSelected && paginationMeta?.total) {
            setTotalSelectedRows(paginationMeta.total);
        } else {
            const selectedCount = Object.values(selectedHamletIds).filter(Boolean).length;
            setTotalSelectedRows(selectedCount);
        }
    }, [selectedHamletIds, paginationMeta?.total, allSelected]);

    const getSelectedHamletIds = (): number[] => {
        if (allSelected) {
            return hamlets.map(hamlet => hamlet.id as number);
        } else {
            return Object.keys(selectedHamletIds)
                .filter(id => selectedHamletIds[Number(id)])
                .map(id => Number(id));
        }
    };

    const handleBulkDelete = () => {
        const selectedIds = getSelectedHamletIds();
        if (onBulkDelete && selectedIds.length > 0) {
            onBulkDelete(selectedIds);
            setAllSelected(false);
            setSelectedHamletIds({});
            setTotalSelectedRows(0);
        }
    };

    const handleRowSelectionChange = (newSelection: RowSelectionState) => {
        const newSelectedHamletIds = { ...selectedHamletIds };
        
        Object.entries(newSelection).forEach(([indexStr, isSelected]) => {
            const index = parseInt(indexStr, 10);
            const hamlet = hamlets[index];
            
            if (hamlet && typeof hamlet.id === 'number') {
                if (isSelected) {
                    newSelectedHamletIds[hamlet.id] = true;
                } else {
                    delete newSelectedHamletIds[hamlet.id];
                }
            }
        });
        
        const allCurrentPageSelected = 
            hamlets.length > 0 && 
            hamlets.every(hamlet => typeof hamlet.id === 'number' && newSelectedHamletIds[hamlet.id]);
            
        if (allCurrentPageSelected && Object.keys(newSelectedHamletIds).length === paginationMeta?.total) {
            setAllSelected(true);
        } else if (Object.keys(newSelectedHamletIds).length === 0) {
            setAllSelected(false);
        }
        
        setSelectedHamletIds(newSelectedHamletIds);
    };

    const columns = useMemo<ColumnDef<Hamlet>[]>(
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
                                setSelectedHamletIds({});
                                setTotalSelectedRows(0);
                            }
                        }}
                        aria-label="Seleccionar todos"
                    />
                ),
                cell: ({ row }) => {
                    const hamlet = row.original;
                    return (
                        <Checkbox
                            checked={allSelected || (hamlet.id !== undefined && selectedHamletIds[hamlet.id] === true)}
                            onCheckedChange={(value) => {
                                row.toggleSelected(!!value);
                                
                                if (value) {
                                    if (typeof hamlet.id === 'number') {
                                        const id = hamlet.id;
                                        setSelectedHamletIds(prev => ({ ...prev, [id.toString()]: true }));
                                    }
                                } else {
                                    setSelectedHamletIds(prev => {
                                        const updated = { ...prev };
                                        if (typeof hamlet.id === 'number') {
                                            delete updated[hamlet.id];
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
                accessorKey: "settlementName",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Asentamiento
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.settlementName || 'No asignado'}</div>,
                enableHiding: true,
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
        [onEdit, onDelete, allSelected, paginationMeta?.total, selectedHamletIds]
    );

    useEffect(() => {
        // No aplicamos filtros cuando usamos paginación manual
        // Los datos ya vienen filtrados desde el backend
    }, [searchTerm]);

    useEffect(() => {
        const backendPageIndex = (paginationMeta?.currentPage || 1) - 1;
        if (pagination.pageIndex !== backendPageIndex) {
            setPagination(prev => ({
                ...prev,
                pageIndex: backendPageIndex
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
        isEmpty: hamlets.length === 0,
        dataVersion,
        searchTerm,
        onSearchChange,
        allSelected,
        setAllSelected,
        handleBulkDelete,
        getSelectedHamletIds,
        hamlets,
    };
};