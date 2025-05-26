import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { DocumentaryTopic } from "../model/documentary-topic-model";
import { DocumentaryTopicResponseModel } from "../model/documentary-topic.page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing documentary topics
 */
export class DocumentaryTopicService {
    private readonly baseEndpoint = "/documentary-topics";

    /**
     * Gets all documentary topics
     * @returns List of documentary topics
     */
    async getAllDocumentaryTopics(): Promise<DocumentaryTopic[]> {
        try {
            const response = await axiosInstance.get<unknown>(this.baseEndpoint);
            return camelizeKeys(response.data) as DocumentaryTopic[];
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }

    /**
     * Gets paginated documentary topics
     * @param page Page number
     * @param size Items per page
     * @returns Paginated response with documentary topics
     */
    async getPaginatedDocumentaryTopics(
        page: number = 1,
        size: number = 5
    ): Promise<DocumentaryTopicResponseModel> {
        try {
            const response = await axiosInstance.get<unknown>(
                `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
            );
            return camelizeKeys(response.data) as DocumentaryTopicResponseModel;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }

    /**
     * Searches documentary topics by search term
     * @param searchTerm Search term
     * @param page Page number
     * @param size Items per page
     * @returns Paginated response with documentary topics matching the search
     */
    async searchDocumentaryTopics(
        searchTerm: string,
        page: number = 1,
        size: number = 5
    ): Promise<DocumentaryTopicResponseModel> {
        try {
            const response = await axiosInstance.get<unknown>(
                `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
            );
            return camelizeKeys(response.data) as DocumentaryTopicResponseModel;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }

    /**
     * Gets a documentary topic by its ID
     * @param id Documentary topic ID
     * @returns Documentary topic data
     */
    async getDocumentaryTopicById(id: number): Promise<DocumentaryTopic> {
        try {
            const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/${id}`);
            return camelizeKeys(response.data) as DocumentaryTopic;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }

    /**
     * Creates a new documentary topic
     * @param documentaryTopic Documentary topic data to create
     * @returns Created documentary topic
     */
    async createDocumentaryTopic(documentaryTopic: DocumentaryTopic): Promise<DocumentaryTopic> {
        try {
            const payload = decamelizeKeys(documentaryTopic);
            const response = await axiosInstance.post<unknown>(this.baseEndpoint, payload);
            return camelizeKeys(response.data) as DocumentaryTopic;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }

    /**
     * Updates an existing documentary topic
     * @param id ID of the documentary topic to update
     * @param documentaryTopic New documentary topic data
     * @returns Updated documentary topic
     */
    async updateDocumentaryTopic(id: number, documentaryTopic: DocumentaryTopic): Promise<DocumentaryTopic> {
        try {
            const payload = decamelizeKeys(documentaryTopic);
            const response = await axiosInstance.put<unknown>(`${this.baseEndpoint}/${id}`, payload);
            return camelizeKeys(response.data) as DocumentaryTopic;
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }

    /**
     * Deletes a documentary topic
     * @param id ID of the documentary topic to delete
     * @returns Confirmation message
     */
    async deleteDocumentaryTopic(id: number): Promise<{ message: string }> {
        try {
            const response = await axiosInstance.delete<unknown>(`${this.baseEndpoint}/${id}`);
            return camelizeKeys(response.data) as { message: string };
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }

    /**
     * Deletes multiple documentary topics by their IDs
     * @param ids Array of documentary topic IDs to delete
     * @returns Confirmation message
     */
    async deleteMultipleDocumentaryTopics(ids: number[]): Promise<{ message: string }> {
        try {
            const response = await axiosInstance.post<unknown>(
                `${this.baseEndpoint}/delete-multiple`,
                ids
            );
            return camelizeKeys(response.data) as { message: string };
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }

    /**
     * Exports documentary topics to Excel based on provided IDs
     * @param ids Array of documentary topic IDs to export
     * @returns Excel file as blob data
     */
    async exportDocumentaryTopicsToExcel(ids: number[]): Promise<Blob> {
        try {
            const response = await axiosInstance.post(`${this.baseEndpoint}/export-excel`, ids, {
                responseType: "blob",
            });
            return new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
        } catch (error) {
            throw ApiErrorHandler.handleApiError(error, "DocumentaryTopicOperationError");
        }
    }
}

export const documentaryTopicService = new DocumentaryTopicService();