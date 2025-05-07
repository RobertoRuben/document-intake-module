import axiosInstance from "../../../globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Position } from "@/modules/positions/model/position.model";
import { PaginatedPositionsResponseModel } from "@/modules/positions/model/position.page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing system positions
 */
export class PositionService {
  /**
   * Gets all positions
   * @returns List of positions
   */
  async getAllPositions(): Promise<Position[]> {
    try {
      const response = await axiosInstance.get<unknown>("/position");
      return camelizeKeys(response.data) as Position[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }

  /**
   * Gets paginated positions
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with positions
   */
  async getPaginatedPositions(
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedPositionsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `/position/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedPositionsResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }

  /**
   * Searches positions by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with positions matching the search
   */
  async searchPositions(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedPositionsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `/position/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedPositionsResponseModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }

  /**
   * Gets a position by its ID
   * @param id Position ID
   * @returns Position data
   */
  async getPositionById(id: number): Promise<Position> {
    try {
      const response = await axiosInstance.get<unknown>(`/position/${id}`);
      return camelizeKeys(response.data) as Position;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }

  /**
   * Creates a new position
   * @param position Position data to create
   * @returns Created position
   */
  async createPosition(position: Position): Promise<Position> {
    try {
      const payload = decamelizeKeys(position);
      const response = await axiosInstance.post<unknown>("/position", payload);
      return camelizeKeys(response.data) as Position;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }

  /**
   * Updates an existing position
   * @param id ID of the position to update
   * @param position New position data
   * @returns Updated position
   */
  async updatePosition(id: number, position: Position): Promise<Position> {
    try {
      const payload = decamelizeKeys(position);
      const response = await axiosInstance.put<unknown>(`/position/${id}`, payload);
      return camelizeKeys(response.data) as Position;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }

  /**
   * Deletes a position
   * @param id ID of the position to delete
   * @returns Confirmation message
   */
  async deletePosition(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`/position/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }

  /**
   * Deletes multiple positions by their IDs
   * @param ids Array of position IDs to delete
   * @returns Confirmation message
   */
  async deleteMultiplePositions(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        "/position/delete-multiple",
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }

  /**
   * Exports positions to Excel based on provided IDs
   * @param ids Array of position IDs to export
   * @returns Excel file as blob data
   */
  async exportPositionsToExcel(ids: number[]): Promise<Blob> {
    try {
      const response = await axiosInstance.post("/position/export-excel", ids, {
        responseType: "blob",
      });
      return new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "PositionOperationError");
    }
  }
}

export const positionService = new PositionService();