import { useState, useEffect, useCallback, useRef } from "react";
import { documentaryTopicService } from "../service/documentary-topic.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { DocumentaryTopic } from "../model/documentary-topic-model";
import { DocumentaryTopicResponseModel } from "../model/documentary-topic.page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

export const useDocumentaryTopicContainer = () => {
    const [documentaryTopics, setDocumentaryTopics] = useState<DocumentaryTopic[]>([]);
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
    const [selectedTopic, setSelectedTopic] = useState<DocumentaryTopic | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState<DocumentaryTopic | undefined>(undefined);
    const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    const pagesCache = useRef<Record<string, {
        data: DocumentaryTopic[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});

    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchTopics = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setDocumentaryTopics(cachedData.data);
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
            let response: DocumentaryTopicResponseModel;

            if (search) {
                response = await documentaryTopicService.searchDocumentaryTopics(search, page);
            } else {
                response = await documentaryTopicService.getPaginatedDocumentaryTopics(page);
            }

            if (response && response.data) {
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setDocumentaryTopics(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setDocumentaryTopics([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar los temas documentales";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setDocumentaryTopics([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, CACHE_VALIDITY_TIME]);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    useEffect(() => {
        fetchTopics(1, "");
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
            setDocumentaryTopics(cachedData.data);
            setPaginationMeta(cachedData.meta);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchTopics(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchTopics, CACHE_VALIDITY_TIME]);

    const handleAddTopic = useCallback(() => {
        setSelectedTopic(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditTopic = useCallback((id?: number) => {
        if (id) {
            const topic = documentaryTopics.find(topic => topic.id === id);
            setSelectedTopic(topic);
            setIsModalOpen(true);
        }
    }, [documentaryTopics]);

    const handleDeleteTopic = useCallback((id?: number) => {
        if (id) {
            const topic = documentaryTopics.find(topic => topic.id === id);
            setTopicToDelete(topic);
            setIsDeleteModalOpen(true);
        }
    }, [documentaryTopics]);

    const handleConfirmDelete = useCallback(async () => {
        if (topicToDelete?.id) {
            setIsLoading(true);
            
            try {
                await documentaryTopicService.deleteDocumentaryTopic(topicToDelete.id);
                toast.success("Tema documental eliminado", {
                    description: "El tema documental ha sido eliminado correctamente"
                });
                
                invalidateCache();
                
                if (documentaryTopics.length === 1 && currentPage > 1) {
                    const previousPage = currentPage - 1;
                    setCurrentPage(previousPage);
                    fetchTopics(previousPage, searchTerm, true);
                } else {
                    fetchTopics(currentPage, searchTerm, true);
                }
                setIsDeleteModalOpen(false);
            } catch (err) {
                let errorMessage = "Error al eliminar el tema documental";
                
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
    }, [topicToDelete, currentPage, searchTerm, fetchTopics, invalidateCache, documentaryTopics.length]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setTopicToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedTopic(undefined);
    }, []);

    const handleSubmitTopic = useCallback(async (data: DocumentaryTopic) => {
        setIsLoading(true);
        
        try {
            if (data.id) {
                await documentaryTopicService.updateDocumentaryTopic(data.id, data);
                toast.success("Tema documental actualizado", {
                    description: "El tema documental ha sido actualizado correctamente"
                });
                invalidateCache();
                fetchTopics(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await documentaryTopicService.createDocumentaryTopic(data);
                toast.success("Tema documental creado", {
                    description: "El tema documental ha sido creado correctamente"
                });
                
                invalidateCache();
                
                if (documentaryTopics.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchTopics(newTotalPages, searchTerm, true);
                    } else {
                        fetchTopics(currentPage, searchTerm, true);
                    }
                } else {
                    fetchTopics(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar el tema documental";
            
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
    }, [currentPage, searchTerm, fetchTopics, invalidateCache, documentaryTopics.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setDocumentaryTopics(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm, CACHE_VALIDITY_TIME]);

    const handleDeleteMultipleTopics = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await documentaryTopicService.deleteMultipleDocumentaryTopics(ids);
            toast.success("Temas documentales eliminados", {
                description: result.message || "Los temas documentales han sido eliminados correctamente"
            });
            
            invalidateCache();
            
            const allItemsDeleted = ids.length >= documentaryTopics.length;
            
            if (allItemsDeleted && currentPage > 1) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                fetchTopics(previousPage, searchTerm, true);
            } else {
                fetchTopics(currentPage, searchTerm, true);
            }
            
            setSelectedTopicIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar los temas documentales";
            
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
    }, [currentPage, searchTerm, fetchTopics, invalidateCache, documentaryTopics.length]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await documentaryTopicService.exportDocumentaryTopicsToExcel(ids);
            
            const url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement('a');
            link.href = url;
            
            const date = new Date();
            const fileName = `temas_documentales_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}.xlsx`;
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Exportación completada", {
                description: "Los temas documentales han sido exportados a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar los temas documentales";
            
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

    const handleSelectTopics = useCallback((ids: number[]) => {
        setSelectedTopicIds(ids);
    }, []);

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
                                        const response = await documentaryTopicService.searchDocumentaryTopics(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await documentaryTopicService.getPaginatedDocumentaryTopics(page);
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
        documentaryTopics,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedTopic,
        isDeleteModalOpen,
        topicToDelete,
        selectedTopicIds,
        isLoading,
        error,
        handleAddTopic,
        handleEditTopic,
        handleDeleteTopic,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitTopic,
        handleSearchChange,
        handlePageChange,
        handleDeleteMultipleTopics,
        handleExportToExcel,
        handleSelectTopics,
    };
};