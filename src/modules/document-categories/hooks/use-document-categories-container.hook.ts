import { useState, useEffect, useCallback, useRef } from "react";
import { documentCategoryService } from "../service/document-category.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { DocumentCategory } from "../model/document-category.model";
import { PaginatedDocumentCategoriesResponseModel } from "../model/document-categogry-page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

export const useDocumentCategoriesContainer = () => {
    const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>([]);
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
    const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<DocumentCategory | undefined>(undefined);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    const pagesCache = useRef<Record<string, {
        data: DocumentCategory[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});
    
    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchCategories = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setDocumentCategories(cachedData.data);
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
            let response: PaginatedDocumentCategoriesResponseModel;

            if (search) {
                response = await documentCategoryService.searchDocumentCategories(search, page);
            } else {
                response = await documentCategoryService.getPaginatedDocumentCategories(page);
            }

            if (response && response.data) {
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setDocumentCategories(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setDocumentCategories([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar las categorías";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setDocumentCategories([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, CACHE_VALIDITY_TIME]);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    useEffect(() => {
        fetchCategories(1, "");
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
            setDocumentCategories(cachedData.data);
            setPaginationMeta(cachedData.meta);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchCategories(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchCategories, CACHE_VALIDITY_TIME]);

    const handleAddCategory = useCallback(() => {
        setSelectedCategory(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditCategory = useCallback((id?: number) => {
        if (id) {
            const category = documentCategories.find(category => category.id === id);
            setSelectedCategory(category);
            setIsModalOpen(true);
        }
    }, [documentCategories]);

    const handleDeleteCategory = useCallback((id?: number) => {
        if (id) {
            const category = documentCategories.find(category => category.id === id);
            setCategoryToDelete(category);
            setIsDeleteModalOpen(true);
        }
    }, [documentCategories]);

    const handleConfirmDelete = useCallback(async () => {
        if (categoryToDelete?.id) {
            setIsLoading(true);
            
            try {
                await documentCategoryService.deleteDocumentCategory(categoryToDelete.id);
                toast.success("Categoría eliminada", {
                    description: "La categoría ha sido eliminada correctamente"
                });
                
                invalidateCache();
                
                if (documentCategories.length === 1 && currentPage > 1) {
                    const previousPage = currentPage - 1;
                    setCurrentPage(previousPage);
                    fetchCategories(previousPage, searchTerm, true);
                } else {
                    fetchCategories(currentPage, searchTerm, true);
                }
                setIsDeleteModalOpen(false);
            } catch (err) {
                let errorMessage = "Error al eliminar la categoría";
                
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
    }, [categoryToDelete, currentPage, searchTerm, fetchCategories, invalidateCache, documentCategories.length]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedCategory(undefined);
    }, []);

    const handleSubmitCategory = useCallback(async (data: DocumentCategory) => {
        setIsLoading(true);
        
        try {
            if (data.id) {
                await documentCategoryService.updateDocumentCategory(data.id, data);
                toast.success("Categoría actualizada", {
                    description: "La categoría ha sido actualizada correctamente"
                });
                invalidateCache();
                fetchCategories(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await documentCategoryService.createDocumentCategory(data);
                toast.success("Categoría creada", {
                    description: "La categoría ha sido creada correctamente"
                });
                
                invalidateCache();
                
                if (documentCategories.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchCategories(newTotalPages, searchTerm, true);
                    } else {
                        fetchCategories(currentPage, searchTerm, true);
                    }
                } else {
                    fetchCategories(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar la categoría";
            
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
    }, [currentPage, searchTerm, fetchCategories, invalidateCache, documentCategories.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setDocumentCategories(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm, CACHE_VALIDITY_TIME]);

    const handleDeleteMultipleCategories = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await documentCategoryService.deleteMultipleDocumentCategories(ids);
            toast.success("Categorías eliminadas", {
                description: result.message || "Las categorías han sido eliminadas correctamente"
            });
            
            invalidateCache();
            
            const allItemsDeleted = ids.length >= documentCategories.length;
            
            if (allItemsDeleted && currentPage > 1) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                fetchCategories(previousPage, searchTerm, true);
            } else {
                fetchCategories(currentPage, searchTerm, true);
            }
            
            setSelectedCategoryIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar las categorías";
            
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
    }, [currentPage, searchTerm, fetchCategories, invalidateCache, documentCategories.length]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await documentCategoryService.exportDocumentCategoriesToExcel(ids);
            
            const url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement('a');
            link.href = url;
            
            const date = new Date();
            const fileName = `categorias_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}.xlsx`;
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Exportación completada", {
                description: "Las categorías han sido exportadas a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar las categorías";
            
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

    const handleSelectCategories = useCallback((ids: number[]) => {
        setSelectedCategoryIds(ids);
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
                                        const response = await documentCategoryService.searchDocumentCategories(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await documentCategoryService.getPaginatedDocumentCategories(page);
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
        documentCategories,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedCategory,
        isDeleteModalOpen,
        categoryToDelete,
        selectedCategoryIds,
        isLoading,
        error,
        handleAddCategory,
        handleEditCategory,
        handleDeleteCategory,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitCategory,
        handleSearchChange,
        handlePageChange,
        handleDeleteMultipleCategories,
        handleExportToExcel,
        handleSelectCategories,
    };
};