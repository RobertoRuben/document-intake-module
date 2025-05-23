import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { DocumentCategory } from "@/modules/document-categories/model/document-category.model";
import { PaginatedDocumentCategoriesResponseModel } from "@/modules/document-categories/model/document-categogry-page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing document categories
 */
export class DocumentCategoryService {
    private readonly baseEndpoint = "/document-categories";

    /**
     * Gets all document categories
     * @returns List of document categories
     */
    async getAllDocumentCategories(): Promise<DocumentCategory[]> {
        try {
            const response = await axiosInstance.get<unknown>(this.baseEndpoint);
            return camelizeKeys(response.data) as DocumentCategory[];
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }

    /**
     * Gets paginated document categories
     * @param page Page number
     * @param size Items per page
     * @returns Paginated response with document categories
     */
    async getPaginatedDocumentCategories(
        page: number = 1,
        size: number = 5
    ): Promise<PaginatedDocumentCategoriesResponseModel> {
        try {
            const response = await axiosInstance.get<unknown>(
                `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
            );
            return camelizeKeys(response.data) as PaginatedDocumentCategoriesResponseModel;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }

    /**
     * Searches document categories by search term
     * @param searchTerm Search term
     * @param page Page number
     * @param size Items per page
     * @returns Paginated response with document categories matching the search
     */
    async searchDocumentCategories(
        searchTerm: string,
        page: number = 1,
        size: number = 5
    ): Promise<PaginatedDocumentCategoriesResponseModel> {
        try {
            const response = await axiosInstance.get<unknown>(
                `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
            );
            return camelizeKeys(response.data) as PaginatedDocumentCategoriesResponseModel;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }

    /**
     * Gets a document category by its ID
     * @param id Document category ID
     * @returns Document category data
     */
    async getDocumentCategoryById(id: number): Promise<DocumentCategory> {
        try {
            const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/${id}`);
            return camelizeKeys(response.data) as DocumentCategory;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }

    /**
     * Creates a new document category
     * @param documentCategory Document category data to create
     * @returns Created document category
     */
    async createDocumentCategory(documentCategory: DocumentCategory): Promise<DocumentCategory> {
        try {
            const payload = decamelizeKeys(documentCategory);
            const response = await axiosInstance.post<unknown>(this.baseEndpoint, payload);
            return camelizeKeys(response.data) as DocumentCategory;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }

    /**
     * Updates an existing document category
     * @param id ID of the document category to update
     * @param documentCategory New document category data
     * @returns Updated document category
     */
    async updateDocumentCategory(id: number, documentCategory: DocumentCategory): Promise<DocumentCategory> {
        try {
            const payload = decamelizeKeys(documentCategory);
            const response = await axiosInstance.put<unknown>(`${this.baseEndpoint}/${id}`, payload);
            return camelizeKeys(response.data) as DocumentCategory;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }

    /**
     * Deletes a document category
     * @param id ID of the document category to delete
     * @returns Confirmation message
     */
    async deleteDocumentCategory(id: number): Promise<{ message: string }> {
        try {
            const response = await axiosInstance.delete<unknown>(`${this.baseEndpoint}/${id}`);
            return camelizeKeys(response.data) as { message: string };
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }

    /**
     * Deletes multiple document categories by their IDs
     * @param ids Array of document category IDs to delete
     * @returns Confirmation message
     */
    async deleteMultipleDocumentCategories(ids: number[]): Promise<{ message: string }> {
        try {
            const response = await axiosInstance.post<unknown>(
                `${this.baseEndpoint}/delete-multiple`,
                ids
            );
            return camelizeKeys(response.data) as { message: string };
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }

    /**
     * Exports document categories to Excel based on provided IDs
     * @param ids Array of document category IDs to export
     * @returns Excel file as blob data
     */
    async exportDocumentCategoriesToExcel(ids: number[]): Promise<Blob> {
        try {
            const response = await axiosInstance.post(`${this.baseEndpoint}/export-excel`, ids, {
                responseType: "blob",
            });
            return new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentCategoryOperationError");
        }
    }
}

export const documentCategoryService = new DocumentCategoryService();