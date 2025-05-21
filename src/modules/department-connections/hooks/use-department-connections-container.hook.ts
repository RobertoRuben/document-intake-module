import { useState, useEffect, useCallback, useRef } from "react";
import { departmentConnectionService } from "../service/department-connection.service";
import { departmentService } from "@/modules/departments/services/department.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { DepartmentConnection } from "../model/department-connection.model";
import { Department } from "@/modules/departments/models/department.model";
import { PaginatedDepartmentsResponseModel } from "../model/department-page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

export const useDepartmentConnectionsContainerHook = () => {
    const [departmentConnections, setDepartmentConnections] = useState<DepartmentConnection[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
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
    const [selectedDepartmentConnection, setSelectedDepartmentConnection] = useState<DepartmentConnection | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [departmentConnectionToDelete, setDepartmentConnectionToDelete] = useState<DepartmentConnection | undefined>(undefined);
    const [selectedDepartmentConnectionIds, setSelectedDepartmentConnectionIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    
    const pagesCache = useRef<Record<string, {
        data: DepartmentConnection[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});
    
    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchDepartmentConnections = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setDepartmentConnections(cachedData.data);
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
            let response: PaginatedDepartmentsResponseModel;

            if (search) {
                response = await departmentConnectionService.searchDepartmentConnections(search, page);
            } else {
                response = await departmentConnectionService.getPaginatedDepartmentConnections(page);
            }

            if (response && response.data) {
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setDepartmentConnections(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setDepartmentConnections([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar las conexiones de departamentos";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setDepartmentConnections([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, CACHE_VALIDITY_TIME]);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    const fetchDepartments = useCallback(async () => {
        try {
            const departmentsData = await departmentService.getAllDepartments();
            setDepartments(departmentsData);
        } catch (err) {
            let errorMessage = "Error al cargar los departamentos";
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            toast.error("Error", {
                description: errorMessage,
            });
        }
    }, []);

    useEffect(() => {
        fetchDepartmentConnections(1, "");
        fetchDepartments();
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
            setDepartmentConnections(cachedData.data);
            setPaginationMeta(cachedData.meta);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchDepartmentConnections(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchDepartmentConnections, CACHE_VALIDITY_TIME]);

    const handleAddDepartmentConnection = useCallback(() => {
        setSelectedDepartmentConnection(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditDepartmentConnection = useCallback((id?: number) => {
        if (id) {
            const connection = departmentConnections.find(connection => connection.id === id);
            setSelectedDepartmentConnection(connection);
            setIsModalOpen(true);
        }
    }, [departmentConnections]);

    const handleDeleteDepartmentConnection = useCallback((id?: number) => {
        if (id) {
            const connection = departmentConnections.find(connection => connection.id === id);
            setDepartmentConnectionToDelete(connection);
            setIsDeleteModalOpen(true);
        }
    }, [departmentConnections]);

    const handleConfirmDelete = useCallback(async () => {
        if (departmentConnectionToDelete?.id) {
            setIsLoading(true);
            
            try {
                await departmentConnectionService.deleteDepartmentConnection(departmentConnectionToDelete.id);
                toast.success("Conexión eliminada", {
                    description: "La conexión entre departamentos ha sido eliminada correctamente"
                });
                
                invalidateCache();
                
                if (departmentConnections.length === 1 && currentPage > 1) {
                    const previousPage = currentPage - 1;
                    setCurrentPage(previousPage);
                    fetchDepartmentConnections(previousPage, searchTerm, true);
                } else {
                    fetchDepartmentConnections(currentPage, searchTerm, true);
                }
                setIsDeleteModalOpen(false);
            } catch (err) {
                let errorMessage = "Error al eliminar la conexión entre departamentos";
                
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
    }, [departmentConnectionToDelete, currentPage, searchTerm, fetchDepartmentConnections, invalidateCache, departmentConnections.length]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setDepartmentConnectionToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedDepartmentConnection(undefined);
    }, []);

    const handleSubmitDepartmentConnection = useCallback(async (data: DepartmentConnection) => {
        setIsLoading(true);
        
        try {
            if (data.id) {
                await departmentConnectionService.updateDepartmentConnection(data.id, data);
                toast.success("Conexión actualizada", {
                    description: "La conexión entre departamentos ha sido actualizada correctamente"
                });
                invalidateCache();
                fetchDepartmentConnections(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await departmentConnectionService.createDepartmentConnection(data);
                toast.success("Conexión creada", {
                    description: "La conexión entre departamentos ha sido creada correctamente"
                });
                
                invalidateCache();
                
                if (departmentConnections.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchDepartmentConnections(newTotalPages, searchTerm, true);
                    } else {
                        fetchDepartmentConnections(currentPage, searchTerm, true);
                    }
                } else {
                    fetchDepartmentConnections(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar la conexión entre departamentos";
            
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
    }, [currentPage, searchTerm, fetchDepartmentConnections, invalidateCache, departmentConnections.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setDepartmentConnections(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm, CACHE_VALIDITY_TIME]);

    const handleDeleteMultipleDepartmentConnections = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await departmentConnectionService.deleteMultipleDepartmentConnections(ids);
            toast.success("Conexiones eliminadas", {
                description: result.message || "Las conexiones entre departamentos han sido eliminadas correctamente"
            });
            
            invalidateCache();
            
            const allItemsDeleted = ids.length >= departmentConnections.length;
            
            if (allItemsDeleted && currentPage > 1) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                fetchDepartmentConnections(previousPage, searchTerm, true);
            } else {
                fetchDepartmentConnections(currentPage, searchTerm, true);
            }
            
            setSelectedDepartmentConnectionIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar las conexiones entre departamentos";
            
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
    }, [currentPage, searchTerm, fetchDepartmentConnections, invalidateCache, departmentConnections.length]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await departmentConnectionService.exportDepartmentConnectionsToExcel(ids);
            
            const url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement('a');
            link.href = url;
            
            const date = new Date();
            const fileName = `conexiones_departamentos_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}.xlsx`;
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Exportación completada", {
                description: "Las conexiones entre departamentos han sido exportadas a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar las conexiones entre departamentos";
            
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

    const handleSelectDepartmentConnections = useCallback((ids: number[]) => {
        setSelectedDepartmentConnectionIds(ids);
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
                                        const response = await departmentConnectionService.searchDepartmentConnections(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await departmentConnectionService.getPaginatedDepartmentConnections(page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    }
                                } catch {
                                    // Error silencioso - no interrumpe la experiencia del usuario
                                }
                            })();
                        }
                    });
                }, 1000); 
                
                return () => {
                    clearTimeout(preloadTimer);
                };
            }
        }
    }, [paginationMeta, searchTerm]);

    return {
        departmentConnections,
        departments,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedDepartmentConnection,
        isDeleteModalOpen,
        departmentConnectionToDelete,
        selectedDepartmentConnectionIds,
        isLoading,
        error,
        handleAddDepartmentConnection,
        handleEditDepartmentConnection,
        handleDeleteDepartmentConnection,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitDepartmentConnection,
        handleSearchChange,
        handlePageChange,
        handleDeleteMultipleDepartmentConnections,
        handleExportToExcel,
        handleSelectDepartmentConnections,
    };
};