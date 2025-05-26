import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Submitter } from "@/modules/submitters/model/submitter.model";
import { PaginatedSubmittersResponseModel } from "@/modules/submitters/model/submitter-page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing system submitters
 */
export class SubmitterService {
  private readonly baseEndpoint = "/submitters";

  /**
   * Gets all submitters
   * @returns List of submitters
   */
  async getAllSubmitters(): Promise<Submitter[]> {
    try {
      const response = await axiosInstance.get<unknown>(this.baseEndpoint);
      return camelizeKeys(response.data) as Submitter[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }

  /**
   * Gets paginated submitters
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with submitters
   */
  async getPaginatedSubmitters(
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedSubmittersResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedSubmittersResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }

  /**
   * Searches submitters by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with submitters matching the search
   */
  async searchSubmitters(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedSubmittersResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      
      const camelizedData = camelizeKeys(response.data) as PaginatedSubmittersResponseModel;
      
      return camelizedData;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }

  /**
   * Gets a submitter by its ID
   * @param id Submitter ID
   * @returns Submitter data
   */
  async getSubmitterById(id: number): Promise<Submitter> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as Submitter;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }

  /**
   * Creates a new submitter
   * @param submitter Submitter data to create
   * @returns Created submitter
   */
  async createSubmitter(submitter: Submitter): Promise<Submitter> {
    try {
      const payload = decamelizeKeys(submitter);
      const response = await axiosInstance.post<unknown>(this.baseEndpoint, payload);
      return camelizeKeys(response.data) as Submitter;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }

  /**
   * Updates an existing submitter
   * @param id ID of the submitter to update
   * @param submitter New submitter data
   * @returns Updated submitter
   */
  async updateSubmitter(id: number, submitter: Submitter): Promise<Submitter> {
    try {
      const payload = decamelizeKeys(submitter);
      const response = await axiosInstance.put<unknown>(`${this.baseEndpoint}/${id}`, payload);
      return camelizeKeys(response.data) as Submitter;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }

  /**
   * Deletes a submitter
   * @param id ID of the submitter to delete
   * @returns Confirmation message
   */
  async deleteSubmitter(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }

  /**
   * Deletes multiple submitters by their IDs
   * @param ids Array of submitter IDs to delete
   * @returns Confirmation message
   */
  async deleteMultipleSubmitters(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        `${this.baseEndpoint}/delete-multiple`,
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }

  /**
   * Exports submitters to Excel based on provided IDs
   * @param ids Array of submitter IDs to export
   * @returns Excel file as blob data
   */
  async exportSubmittersToExcel(ids: number[]): Promise<Blob> {
    try {
      const response = await axiosInstance.post(`${this.baseEndpoint}/export-excel`, ids, {
        responseType: "blob",
      });
      return new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SubmitterOperationError");
    }
  }
}

export const submitterService = new SubmitterService();