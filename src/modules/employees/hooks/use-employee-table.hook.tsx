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
import { Employee } from "@/modules/employees/models/employee.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { formatDateLima } from "@/globals/utils/dateUtils";

interface UseEmployeeTableProps {
    employees: Employee[];
    dataVersion: number;
    paginationMeta: PaginationMetaModel;
    searchTerm: string;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onBulkDelete?: (ids: number[]) => void;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
}

export const useEmployeeTable = ({
    employees,
    dataVersion,
    paginationMeta,
    searchTerm,
    onEdit,
    onDelete,
    onBulkDelete,
    onSearchChange,
    onPageChange,
}: UseEmployeeTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        createdAt: false,
        updatedAt: false,
        gender: true,
        names: true,
        paternalSurname: true,
        maternalSurname: true,
        actions: true,
    });
    
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Record<number, boolean>>({});
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
        employees.forEach((employee, index) => {
            if (employee.id !== undefined && (selectedEmployeeIds[employee.id] || allSelected)) {
                selection[index] = true;
            }
        });
        return selection;
    }, [employees, selectedEmployeeIds, allSelected]);

    useEffect(() => {
        if (allSelected && paginationMeta?.total) {
            setTotalSelectedRows(paginationMeta.total);
        } else {
            const selectedCount = Object.values(selectedEmployeeIds).filter(Boolean).length;
            setTotalSelectedRows(selectedCount);
        }
    }, [selectedEmployeeIds, paginationMeta?.total, allSelected]);

    const getSelectedEmployeeIds = (): number[] => {
        if (allSelected) {
            return employees.map(employee => employee.id as number);
        } else {
            return Object.keys(selectedEmployeeIds)
                .filter(id => selectedEmployeeIds[Number(id)])
                .map(id => Number(id));
        }
    };

    const handleBulkDelete = () => {
        const selectedIds = getSelectedEmployeeIds();
        if (onBulkDelete && selectedIds.length > 0) {
            onBulkDelete(selectedIds);
            setAllSelected(false);
            setSelectedEmployeeIds({});
            setTotalSelectedRows(0);
        } else {
            console.warn("Función onBulkDelete no proporcionada o no hay empleados seleccionados");
        }
    };

    const handleRowSelectionChange = (newSelection: RowSelectionState) => {
        const newSelectedEmployeeIds = { ...selectedEmployeeIds };
        
        Object.entries(newSelection).forEach(([indexStr, isSelected]) => {
            const index = parseInt(indexStr, 10);
            const employee = employees[index];
            
            if (employee && typeof employee.id === 'number') {
                if (isSelected) {
                    newSelectedEmployeeIds[employee.id] = true;
                } else {
                    delete newSelectedEmployeeIds[employee.id];
                }
            }
        });
        
        const allCurrentPageSelected = 
            employees.length > 0 && 
            employees.every(employee => typeof employee.id === 'number' && newSelectedEmployeeIds[employee.id]);
            
        if (allCurrentPageSelected && Object.keys(newSelectedEmployeeIds).length === paginationMeta?.total) {
            setAllSelected(true);
        } else if (Object.keys(newSelectedEmployeeIds).length === 0) {
            setAllSelected(false);
        }
        
        setSelectedEmployeeIds(newSelectedEmployeeIds);
    };

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

    const columns = useMemo<ColumnDef<Employee>[]>(
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
                                setSelectedEmployeeIds({});
                                setTotalSelectedRows(0);
                            }
                        }}
                        aria-label="Seleccionar todos"
                    />
                ),
                cell: ({ row }) => {
                    const employee = row.original;
                    return (
                        <Checkbox
                            checked={allSelected || (employee.id !== undefined && selectedEmployeeIds[employee.id] === true)}
                            onCheckedChange={(value) => {
                                row.toggleSelected(!!value);
                                
                                if (value) {
                                    if (typeof employee.id === 'number') {
                                        const id = employee.id;
                                        setSelectedEmployeeIds(prev => ({ ...prev, [id.toString()]: true }));
                                    }
                                } else {
                                    setSelectedEmployeeIds(prev => {
                                        const updated = { ...prev };
                                        if (typeof employee.id === 'number') {
                                            delete updated[employee.id];
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
                accessorKey: "dni",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        DNI
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.dni}</div>,
            },
            {
                accessorKey: "paternalSurname",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Apellido Paterno
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.paternalSurname}</div>,
                enableHiding: true,
            },
            {
                accessorKey: "maternalSurname",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Apellido Materno
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.maternalSurname}</div>,
                enableHiding: true,
            },
            {
                accessorKey: "names",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nombres
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.names}</div>,
                enableHiding: true,
            },
            {
                accessorKey: "gender",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Género
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{formatGender(row.original.gender)}</div>,
                enableHiding: true,
            },
            {
                accessorKey: "departmentName",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Área
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.departmentName || 'No asignado'}</div>,
            },
            {
                accessorKey: "positionName",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Cargo
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.positionName || 'No asignado'}</div>,
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
        [onEdit, onDelete, allSelected, paginationMeta?.total, selectedEmployeeIds]
    );

    useEffect(() => {
        if (searchTerm) {
            setColumnFilters([
                { id: "names", value: searchTerm },
                { id: "paternalSurname", value: searchTerm },
                { id: "maternalSurname", value: searchTerm },
                { id: "dni", value: searchTerm }
            ]);
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
        isEmpty: employees.length === 0,
        dataVersion,
        searchTerm,
        onSearchChange,
        allSelected,
        setAllSelected,
        handleBulkDelete,
        getSelectedEmployeeIds,
    };
};