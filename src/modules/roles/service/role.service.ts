import axiosInstance from "../../../globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { RoleModel } from "@/modules/roles/models/role.model";
import { PaginatedRolesResponseModel } from "@/modules/roles/models/role.page.model";
import axios, { AxiosError } from "axios";

export class RoleOperationError extends Error {
  code: number;
  details: string;

  constructor(message: string, code: number = 500, details: string = "") {
    super(message);
    this.name = "RoleOperationError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Service for managing system roles
 */
export class RoleService {
  /**
   * Procesa errores de la API y extrae los detalles
   */
  private handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      interface ErrorResponse {
        detail?: {
          details?: string;
          message?: string;
          code?: number;
        };
      }
      const responseData = axiosError.response?.data as ErrorResponse;

      if (responseData?.detail) {
        const errorDetail = responseData.detail;
        const details =
          errorDetail.details || errorDetail.message || "Error en la operación";
        const code = errorDetail.code || axiosError.response?.status || 500;

        throw new RoleOperationError(
          errorDetail.message || "Error en la operación",
          code,
          details
        );
      }

      throw new RoleOperationError(
        "Error en la comunicación con el servidor",
        axiosError.response?.status || 500
      );
    }

    throw new RoleOperationError("Error inesperado en la operación");
  }

  /**
   * Gets all roles
   * @returns List of roles
   */
  async getAllRoles(): Promise<RoleModel[]> {
    try {
      const response = await axiosInstance.get<unknown>("/role");
      return camelizeKeys(response.data) as RoleModel[];
    } catch (error) {
      throw this.handleApiError(error);
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
        `/role/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedRolesResponseModel;
      return paginatedResult;
    } catch (error) {
      throw this.handleApiError(error);
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
        `/role/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedRolesResponseModel;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Gets a role by its ID
   * @param id Role ID
   * @returns Role data
   */
  async getRoleById(id: number): Promise<RoleModel> {
    try {
      const response = await axiosInstance.get<unknown>(`/role/${id}`);
      return camelizeKeys(response.data) as RoleModel;
    } catch (error) {
      throw this.handleApiError(error);
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
      const response = await axiosInstance.post<unknown>("/role", payload);
      return camelizeKeys(response.data) as RoleModel;
    } catch (error) {
      throw this.handleApiError(error);
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
      const response = await axiosInstance.put<unknown>(`/role/${id}`, payload);
      return camelizeKeys(response.data) as RoleModel;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Deletes a role
   * @param id ID of the role to delete
   * @returns Confirmation message
   */
  async deleteRole(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`/role/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

/**
 * Deletes multiple roles by their IDs
 * @param ids Array of role IDs to delete
 * @returns Confirmation message
 */
async deleteMultipleRoles(ids: number[]): Promise<{ message: string }> {
  try {
    // Enviar el array de IDs directamente, sin envolverlo en un objeto
    const response = await axiosInstance.post<unknown>(
      "/role/delete-multiple",
      ids
    );
    return camelizeKeys(response.data) as { message: string };
  } catch (error) {
    throw this.handleApiError(error);
  }
}

  /**
   * Exports roles to Excel based on provided IDs
   * @param ids Array of role IDs to export
   * @returns Excel file as blob data
   */
  async exportRolesToExcel(ids: number[]): Promise<Blob> {
    try {
      const response = await axiosInstance.post("/role/export-excel", ids, {
        responseType: "blob",
      });
      return new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
      throw this.handleApiError(error);
    }
  }
}

export const roleService = new RoleService();
