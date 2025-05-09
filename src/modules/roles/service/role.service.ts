import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { RoleModel } from "@/modules/roles/models/role.model";
import { PaginatedRolesResponseModel } from "@/modules/roles/models/role.page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing system roles
 */
export class RoleService {
  private readonly baseEndpoint = "/role";

  /**
   * Gets all roles
   * @returns List of roles
   */
  async getAllRoles(): Promise<RoleModel[]> {
    try {
      const response = await axiosInstance.get<unknown>(this.baseEndpoint);
      return camelizeKeys(response.data) as RoleModel[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }

  /**
   * Gets paginated roles
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with roles
   */
  async getPaginatedRoles(
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedRolesResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedRolesResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }

  /**
   * Searches roles by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with roles matching the search
   */
  async searchRoles(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedRolesResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedRolesResponseModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }

  /**
   * Gets a role by its ID
   * @param id Role ID
   * @returns Role data
   */
  async getRoleById(id: number): Promise<RoleModel> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as RoleModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }

  /**
   * Creates a new role
   * @param role Role data to create
   * @returns Created role
   */
  async createRole(role: RoleModel): Promise<RoleModel> {
    try {
      const payload = decamelizeKeys(role);
      const response = await axiosInstance.post<unknown>(this.baseEndpoint, payload);
      return camelizeKeys(response.data) as RoleModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }

  /**
   * Updates an existing role
   * @param id ID of the role to update
   * @param role New role data
   * @returns Updated role
   */
  async updateRole(id: number, role: RoleModel): Promise<RoleModel> {
    try {
      const payload = decamelizeKeys(role);
      const response = await axiosInstance.put<unknown>(`${this.baseEndpoint}/${id}`, payload);
      return camelizeKeys(response.data) as RoleModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }

  /**
   * Deletes a role
   * @param id ID of the role to delete
   * @returns Confirmation message
   */
  async deleteRole(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }

  /**
   * Deletes multiple roles by their IDs
   * @param ids Array of role IDs to delete
   * @returns Confirmation message
   */
  async deleteMultipleRoles(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        `${this.baseEndpoint}/delete-multiple`,
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }

  /**
   * Exports roles to Excel based on provided IDs
   * @param ids Array of role IDs to export
   * @returns Excel file as blob data
   */
  async exportRolesToExcel(ids: number[]): Promise<Blob> {
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
      throw ApiErrorHandler.handleApiError(error, "RoleOperationError");
    }
  }
}

export const roleService = new RoleService();