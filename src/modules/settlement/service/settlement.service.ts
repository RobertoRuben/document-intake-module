import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Settlement } from "@/modules/settlement/model/settlement.model";
import { PaginatedSettlementsResponseModel } from "@/modules/settlement/model/settlement-page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing settlements
 */
export class SettlementService {
  private readonly baseEndpoint = "/settlements";

  /**
   * Gets all settlements
   * @returns List of settlements
   */
  async getAllSettlements(): Promise<Settlement[]> {
    try {
      const response = await axiosInstance.get<unknown>(this.baseEndpoint);
      return camelizeKeys(response.data) as Settlement[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }

  /**
   * Gets paginated settlements
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with settlements
   */
  async getPaginatedSettlements(
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedSettlementsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedSettlementsResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }

  /**
   * Searches settlements by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with settlements matching the search
   */
  async searchSettlements(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedSettlementsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedSettlementsResponseModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }

  /**
   * Gets a settlement by its ID
   * @param id Settlement ID
   * @returns Settlement data
   */
  async getSettlementById(id: number): Promise<Settlement> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as Settlement;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }

  /**
   * Creates a new settlement
   * @param settlement Settlement data to create
   * @returns Created settlement
   */
  async createSettlement(settlement: Settlement): Promise<Settlement> {
    try {
      const payload = decamelizeKeys(settlement);
      const response = await axiosInstance.post<unknown>(this.baseEndpoint, payload);
      return camelizeKeys(response.data) as Settlement;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }

  /**
   * Updates an existing settlement
   * @param id ID of the settlement to update
   * @param settlement New settlement data
   * @returns Updated settlement
   */
  async updateSettlement(id: number, settlement: Settlement): Promise<Settlement> {
    try {
      const payload = decamelizeKeys(settlement);
      const response = await axiosInstance.put<unknown>(`${this.baseEndpoint}/${id}`, payload);
      return camelizeKeys(response.data) as Settlement;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }

  /**
   * Deletes a settlement
   * @param id ID of the settlement to delete
   * @returns Confirmation message
   */
  async deleteSettlement(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }

  /**
   * Deletes multiple settlements by their IDs
   * @param ids Array of settlement IDs to delete
   * @returns Confirmation message
   */
  async deleteMultipleSettlements(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        `${this.baseEndpoint}/delete-multiple`,
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }

  /**
   * Exports settlements to Excel based on provided IDs
   * @param ids Array of settlement IDs to export
   * @returns Excel file as blob data
   */
  async exportSettlementsToExcel(ids: number[]): Promise<Blob> {
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
      throw ApiErrorHandler.handleApiError(error, "SettlementOperationError");
    }
  }
}

export const settlementService = new SettlementService();