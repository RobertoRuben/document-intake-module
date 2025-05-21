import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { DepartmentConnection } from "@/modules/department-connections/model/department-connection.model";
import { PaginatedDepartmentsResponseModel } from "@/modules/department-connections/model/department-page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing department connections
 */
export class DepartmentConnectionService {
  private readonly baseEndpoint = "/department-connections";

  /**
   * Gets all department connections
   * @returns List of department connections
   */
  async getAllDepartmentConnections(): Promise<DepartmentConnection[]> {
    try {
      const response = await axiosInstance.get<unknown>(this.baseEndpoint);
      return camelizeKeys(response.data) as DepartmentConnection[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Gets department connections for the current user's department
   * @returns List of department connections associated with the current user's department
   */
  async getCurrentDepartmentConnections(): Promise<DepartmentConnection[]> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/current-department`);
      return camelizeKeys(response.data) as DepartmentConnection[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Gets paginated department connections
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with department connections
   */
  async getPaginatedDepartmentConnections(
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedDepartmentsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedDepartmentsResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Searches department connections by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with department connections matching the search
   */
  async searchDepartmentConnections(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedDepartmentsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedDepartmentsResponseModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Gets a department connection by its ID
   * @param id Department connection ID
   * @returns Department connection data
   */
  async getDepartmentConnectionById(id: number): Promise<DepartmentConnection> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as DepartmentConnection;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Gets department connections by source department ID
   * @param sourceDepartmentId Source department ID
   * @returns List of department connections with the specified source department
   */
  async getConnectionsBySourceDepartmentId(sourceDepartmentId: number): Promise<DepartmentConnection[]> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/source/${sourceDepartmentId}`);
      return camelizeKeys(response.data) as DepartmentConnection[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Creates a new department connection
   * @param departmentConnection Department connection data to create
   * @returns Created department connection
   */
  async createDepartmentConnection(departmentConnection: DepartmentConnection): Promise<DepartmentConnection> {
    try {
      const payload = decamelizeKeys(departmentConnection);
      const response = await axiosInstance.post<unknown>(this.baseEndpoint, payload);
      return camelizeKeys(response.data) as DepartmentConnection;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Updates an existing department connection
   * @param id ID of the department connection to update
   * @param departmentConnection New department connection data
   * @returns Updated department connection
   */
  async updateDepartmentConnection(id: number, departmentConnection: DepartmentConnection): Promise<DepartmentConnection> {
    try {
      const payload = decamelizeKeys(departmentConnection);
      const response = await axiosInstance.put<unknown>(`${this.baseEndpoint}/${id}`, payload);
      return camelizeKeys(response.data) as DepartmentConnection;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Deletes a department connection
   * @param id ID of the department connection to delete
   * @returns Confirmation message
   */
  async deleteDepartmentConnection(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Deletes multiple department connections by their IDs
   * @param ids Array of department connection IDs to delete
   * @returns Confirmation message
   */
  async deleteMultipleDepartmentConnections(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        `${this.baseEndpoint}/delete-multiple`,
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }

  /**
   * Exports department connections to Excel based on provided IDs
   * @param ids Array of department connection IDs to export
   * @returns Excel file as blob data
   */
  async exportDepartmentConnectionsToExcel(ids: number[]): Promise<Blob> {
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
      throw ApiErrorHandler.handleApiError(error, "DepartmentConnectionOperationError");
    }
  }
}

export const departmentConnectionService = new DepartmentConnectionService();