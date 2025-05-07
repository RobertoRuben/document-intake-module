import { useState, useEffect, useCallback, useRef } from "react";
import { employeeService } from "../services/employee.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { Employee } from "../models/employee.model";
import { PaginatedEmployeesResponseModel } from "../models/employe-page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

export const useEmployeeContainerHook = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMetaModel>({
        currentPage: 1,
        perPage: 5,
        total: 0,
        totalPages: 0,
        nextPage: null,
        previousPage: null
    });
    const [dataVersion, setDataVersion] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | undefined>(undefined);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    
    const pagesCache = useRef<Record<string, {
        data: Employee[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});
    
    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchEmployees = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setEmployees(cachedData.data);
            setPaginationMeta(cachedData.meta);
            setIsLoading(false);
            return;
        }
        
        const fetchParams = { page, search };
        if (!forceRefresh && lastFetchParamsRef.current && 
            lastFetchParamsRef.current.page === page && 
            lastFetchParamsRef.current.search === search) {
            return;
        }
        
        lastFetchParamsRef.current = fetchParams;
        
        setIsLoading(true);
        setError(null);
        
        try {
            let response: PaginatedEmployeesResponseModel;

            if (search) {
                response = await employeeService.searchEmployees(search, page);
            } else {
                response = await employeeService.getPaginatedEmployees(page);
            }

            if (response && response.data) {
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setEmployees(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setEmployees([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar los empleados";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setEmployees([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm]);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    useEffect(() => {
        fetchEmployees(1, "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }

        const cacheKey = `${currentPage}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setEmployees(cachedData.data);
            setPaginationMeta(cachedData.meta);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchEmployees(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchEmployees]);

    const handleAddEmployee = useCallback(() => {
        setSelectedEmployee(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditEmployee = useCallback((id?: number) => {
        if (id) {
            const employee = employees.find(employee => employee.id === id);
            setSelectedEmployee(employee);
            setIsModalOpen(true);
        }
    }, [employees]);

    const handleDeleteEmployee = useCallback((id?: number) => {
        if (id) {
            const employee = employees.find(employee => employee.id === id);
            setEmployeeToDelete(employee);
            setIsDeleteModalOpen(true);
        }
    }, [employees]);

    const handleConfirmDelete = useCallback(async () => {
        if (employeeToDelete?.id) {
            setIsLoading(true);
            
            try {
                await employeeService.deleteEmployee(employeeToDelete.id);
                toast.success("Empleado eliminado", {
                    description: "El empleado ha sido eliminado correctamente"
                });
                
                invalidateCache();
                
                if (employees.length === 1 && currentPage > 1) {
                    const previousPage = currentPage - 1;
                    setCurrentPage(previousPage);
                    fetchEmployees(previousPage, searchTerm, true);
                } else {
                    fetchEmployees(currentPage, searchTerm, true);
                }
                setIsDeleteModalOpen(false);
            } catch (err) {
                let errorMessage = "Error al eliminar el empleado";
                
                if (err instanceof AppOperationError) {
                    errorMessage = err.details || err.message;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
                toast.error("Error", {
                    description: errorMessage
                });
            } finally {
                setIsLoading(false);
            }
        }
    }, [employeeToDelete, currentPage, searchTerm, fetchEmployees, invalidateCache, employees.length]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedEmployee(undefined);
    }, []);

    const handleSubmitEmployee = useCallback(async (data: Employee) => {
        setIsLoading(true);
        
        try {
            if (data.id) {
                await employeeService.updateEmployee(data.id, data);
                toast.success("Empleado actualizado", {
                    description: "El empleado ha sido actualizado correctamente"
                });
                invalidateCache();
                fetchEmployees(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await employeeService.createEmployee(data);
                toast.success("Empleado creado", {
                    description: "El empleado ha sido creado correctamente"
                });
                
                invalidateCache();
                
                if (employees.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchEmployees(newTotalPages, searchTerm, true);
                    } else {
                        fetchEmployees(currentPage, searchTerm, true);
                    }
                } else {
                    fetchEmployees(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar el empleado";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage
            });
            setIsLoading(false);
            return false;
        }
    }, [currentPage, searchTerm, fetchEmployees, invalidateCache, employees.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setEmployees(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm]);

    const handleDeleteMultipleEmployees = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await employeeService.deleteMultipleEmployees(ids);
            toast.success("Empleados eliminados", {
                description: result.message || "Los empleados han sido eliminados correctamente"
            });
            
            invalidateCache();
            
            const allItemsDeleted = ids.length >= employees.length;
            
            if (allItemsDeleted && currentPage > 1) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                fetchEmployees(previousPage, searchTerm, true);
            } else {
                fetchEmployees(currentPage, searchTerm, true);
            }
            
            setSelectedEmployeeIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar los empleados";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, fetchEmployees, invalidateCache, employees.length]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await employeeService.exportEmployeesToExcel(ids);
            
            const url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement('a');
            link.href = url;
            
            const date = new Date();
            const fileName = `empleados_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}.xlsx`;
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Exportación completada", {
                description: "Los empleados han sido exportados a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar los empleados";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectEmployees = useCallback((ids: number[]) => {
        setSelectedEmployeeIds(ids);
    }, []);

    useEffect(() => {
        return () => {
            // Cleanup if needed
        };
    }, [dataVersion]);

    useEffect(() => {
        if (paginationMeta && paginationMeta.totalPages > 1) {
            const pagesToPreload: number[] = [];
        
            if (paginationMeta.nextPage) {
                pagesToPreload.push(paginationMeta.nextPage);
            }
            
            if (pagesToPreload.length > 0) {
                const preloadTimer = setTimeout(() => {
                    pagesToPreload.forEach(page => {
                        const cacheKey = `${page}:${searchTerm}`;
                        if (!pagesCache.current[cacheKey]) {
                            (async () => {
                                try {
                                    if (searchTerm) {
                                        const response = await employeeService.searchEmployees(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await employeeService.getPaginatedEmployees(page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    }
                                } catch (err) {
                                    if (err instanceof AppOperationError) {
                                        console.log(`Error en precarga: ${err.details || err.message}`);
                                    } else {
                                        console.log(`Error en precarga: `, err);
                                    }
                                }
                            })();
                        }
                    });
                }, 1000); 
                
                return () => clearTimeout(preloadTimer);
            }
        }
    }, [paginationMeta, searchTerm]);

    return {
        employees,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedEmployee,
        isDeleteModalOpen,
        employeeToDelete,
        selectedEmployeeIds,
        isLoading,
        error,
        handleAddEmployee,
        handleEditEmployee,
        handleDeleteEmployee,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitEmployee,
        handleSearchChange,
        handlePageChange,
        handleDeleteMultipleEmployees,
        handleExportToExcel,
        handleSelectEmployees,
    };
};