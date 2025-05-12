import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Hamlet } from "@/modules/hamlets/model/hamlet.model";
import { PaginatedHamletsResponseModel } from "@/modules/hamlets/model/hamlet-page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing hamlet data
 */
export class HamletService {
  private readonly baseEndpoint = "/hamlets";

  /**
   * Gets all hamlets
   * @returns List of hamlets
   */
  async getAllHamlets(): Promise<Hamlet[]> {
    try {
      const response = await axiosInstance.get<unknown>(this.baseEndpoint);
      return camelizeKeys(response.data) as Hamlet[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Gets paginated hamlets
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with hamlets
   */
  async getPaginatedHamlets(
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedHamletsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedHamletsResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Searches hamlets by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with hamlets matching the search
   */
  async searchHamlets(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedHamletsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedHamletsResponseModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Gets a hamlet by its ID
   * @param id Hamlet ID
   * @returns Hamlet data
   */
  async getHamletById(id: number): Promise<Hamlet> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/${id}`
      );
      return camelizeKeys(response.data) as Hamlet;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Gets hamlets by settlement ID
   * @param settlementId ID of the settlement
   * @returns List of hamlets belonging to the settlement
   */
  async getHamletsBySettlementId(settlementId: number): Promise<Hamlet[]> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/settlement/${settlementId}`
      );
      return camelizeKeys(response.data) as Hamlet[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Creates a new hamlet
   * @param hamlet Hamlet data to create
   * @returns Created hamlet
   */
  async createHamlet(hamlet: Hamlet): Promise<Hamlet> {
    try {
      const payload = decamelizeKeys(hamlet);
      const response = await axiosInstance.post<unknown>(
        this.baseEndpoint,
        payload
      );
      return camelizeKeys(response.data) as Hamlet;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Updates an existing hamlet
   * @param id ID of the hamlet to update
   * @param hamlet New hamlet data
   * @returns Updated hamlet
   */
  async updateHamlet(id: number, hamlet: Hamlet): Promise<Hamlet> {
    try {
      const payload = decamelizeKeys(hamlet);
      const response = await axiosInstance.put<unknown>(
        `${this.baseEndpoint}/${id}`,
        payload
      );
      return camelizeKeys(response.data) as Hamlet;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Deletes a hamlet
   * @param id ID of the hamlet to delete
   * @returns Confirmation message
   */
  async deleteHamlet(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(
        `${this.baseEndpoint}/${id}`
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Deletes multiple hamlets by their IDs
   * @param ids Array of hamlet IDs to delete
   * @returns Confirmation message
   */
  async deleteMultipleHamlets(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        `${this.baseEndpoint}/delete-multiple`,
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }

  /**
   * Exports hamlets to Excel based on provided IDs
   * @param ids Array of hamlet IDs to export
   * @returns Excel file as blob data
   */
  async exportHamletsToExcel(ids: number[]): Promise<Blob> {
    try {
      const response = await axiosInstance.post(
        `${this.baseEndpoint}/export-excel`,
        ids,
        {
          responseType: "blob",
        }
      );
      return new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "HamletOperationError");
    }
  }
}

export const hamletService = new HamletService();