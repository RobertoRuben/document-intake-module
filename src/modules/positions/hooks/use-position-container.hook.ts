import { useState, useEffect, useCallback, useRef } from "react";
import { positionService } from "../service/position.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { Position } from "../model/position.model";
import { PaginatedPositionsResponseModel } from "../model/position.page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

export const usePositionContainerHook = () => {
    const [positions, setPositions] = useState<Position[]>([]);
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
    const [selectedPosition, setSelectedPosition] = useState<Position | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [positionToDelete, setPositionToDelete] = useState<Position | undefined>(undefined);
    const [selectedPositionIds, setSelectedPositionIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    
    const pagesCache = useRef<Record<string, {
        data: Position[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});
    
    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchPositions = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setPositions(cachedData.data);
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
            let response: PaginatedPositionsResponseModel;

            if (search) {
                response = await positionService.searchPositions(search, page);
            } else {
                response = await positionService.getPaginatedPositions(page);
            }

            if (response && response.data) {
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setPositions(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setPositions([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar los cargos";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setPositions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    useEffect(() => {
        fetchPositions(1, "");
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
            setPositions(cachedData.data);
            setPaginationMeta(cachedData.meta);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchPositions(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchPositions]);

    const handleAddPosition = useCallback(() => {
        setSelectedPosition(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditPosition = useCallback((id?: number) => {
        if (id) {
            const position = positions.find(position => position.id === id);
            setSelectedPosition(position);
            setIsModalOpen(true);
        }
    }, [positions]);

    const handleDeletePosition = useCallback((id?: number) => {
        if (id) {
            const position = positions.find(position => position.id === id);
            setPositionToDelete(position);
            setIsDeleteModalOpen(true);
        }
    }, [positions]);

    const handleConfirmDelete = useCallback(async () => {
        if (positionToDelete?.id) {
            setIsLoading(true);
            
            try {
                await positionService.deletePosition(positionToDelete.id);
                toast.success("Cargo eliminado", {
                    description: "El cargo ha sido eliminado correctamente"
                });
                
                invalidateCache();
                
                if (positions.length === 1 && currentPage > 1) {
                    const previousPage = currentPage - 1;
                    setCurrentPage(previousPage);
                    fetchPositions(previousPage, searchTerm, true);
                } else {
                    fetchPositions(currentPage, searchTerm, true);
                }
                setIsDeleteModalOpen(false);
            } catch (err) {
                let errorMessage = "Error al eliminar el cargo";
                
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
    }, [positionToDelete, currentPage, searchTerm, fetchPositions, invalidateCache, positions.length]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setPositionToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedPosition(undefined);
    }, []);

    const handleSubmitPosition = useCallback(async (data: Position) => {
        setIsLoading(true);
        
        try {
            if (data.id) {
                await positionService.updatePosition(data.id, data);
                toast.success("Cargo actualizado", {
                    description: "El cargo ha sido actualizado correctamente"
                });
                invalidateCache();
                fetchPositions(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await positionService.createPosition(data);
                toast.success("Cargo creado", {
                    description: "El cargo ha sido creado correctamente"
                });
                
                invalidateCache();
                
                if (positions.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchPositions(newTotalPages, searchTerm, true);
                    } else {
                        fetchPositions(currentPage, searchTerm, true);
                    }
                } else {
                    fetchPositions(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar el cargo";
            
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
    }, [currentPage, searchTerm, fetchPositions, invalidateCache, positions.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setPositions(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm]);

    const handleDeleteMultiplePositions = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await positionService.deleteMultiplePositions(ids);
            toast.success("Cargos eliminados", {
                description: result.message || "Los cargos han sido eliminados correctamente"
            });
            
            invalidateCache();
            
            const allItemsDeleted = ids.length >= positions.length;
            
            if (allItemsDeleted && currentPage > 1) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                fetchPositions(previousPage, searchTerm, true);
            } else {
                fetchPositions(currentPage, searchTerm, true);
            }
            
            setSelectedPositionIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar los cargos";
            
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
    }, [currentPage, searchTerm, fetchPositions, invalidateCache, positions.length]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await positionService.exportPositionsToExcel(ids);
            
            const url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement('a');
            link.href = url;
            
            const date = new Date();
            const fileName = `cargos_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}.xlsx`;
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Exportación completada", {
                description: "Los cargos han sido exportados a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar los cargos";
            
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

    const handleSelectPositions = useCallback((ids: number[]) => {
        setSelectedPositionIds(ids);
    }, []);

    useEffect(() => {
        return () => {
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
                                        const response = await positionService.searchPositions(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await positionService.getPaginatedPositions(page);
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
        positions,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedPosition,
        isDeleteModalOpen,
        positionToDelete,
        selectedPositionIds,
        isLoading,
        error,
        handleAddPosition,
        handleEditPosition,
        handleDeletePosition,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitPosition,
        handleSearchChange,
        handlePageChange,
        handleDeleteMultiplePositions,
        handleExportToExcel,
        handleSelectPositions,
    };
};