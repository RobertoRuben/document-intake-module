import axiosInstance from "../../../globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { DepartmentModel } from "@/modules/departments/models/department.model";
import { PaginatedDepartmentsResponseModel } from "@/modules/departments/models/department.page.model";
import axios, { AxiosError } from "axios";

export class DepartmentOperationError extends Error {
  code: number;
  details: string;

  constructor(message: string, code: number = 500, details: string = "") {
    super(message);
    this.name = "DepartmentOperationError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Service for managing system departments
 */
export class DepartmentService {
  /**
   * Processes API errors and throws a custom error
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

        throw new DepartmentOperationError(
          errorDetail.message || "Error en la operación",
          code,
          details
        );
      }

      throw new DepartmentOperationError(
        "Error en la comunicación con el servidor",
        axiosError.response?.status || 500
      );
    }

    throw new DepartmentOperationError("Error inesperado en la operación");
  }

  /**
   * Gets all departments
   * @returns List of departments
   */
  async getAllDepartments(): Promise<DepartmentModel[]> {
    try {
      const response = await axiosInstance.get<unknown>("/department");
      return camelizeKeys(response.data) as DepartmentModel[];
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Gets paginated departments
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with departments
   */
  async getPaginatedDepartments(
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedDepartmentsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `/department/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedDepartmentsResponseModel;
      return paginatedResult;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Searches departments by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with departments matching the search
   */
  async searchDepartments(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedDepartmentsResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `/department/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedDepartmentsResponseModel;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Gets a department by its ID
   * @param id Department ID
   * @returns Department data
   */
  async getDepartmentById(id: number): Promise<DepartmentModel> {
    try {
      const response = await axiosInstance.get<unknown>(`/department/${id}`);
      return camelizeKeys(response.data) as DepartmentModel;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Creates a new department
   * @param department Department data to create
   * @returns Created department
   */
  async createDepartment(
    department: DepartmentModel
  ): Promise<DepartmentModel> {
    try {
      const payload = decamelizeKeys(department);
      const response = await axiosInstance.post<unknown>(
        "/department",
        payload
      );
      return camelizeKeys(response.data) as DepartmentModel;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Updates an existing department
   * @param id ID of the department to update
   * @param department New department data
   * @returns Updated department
   */
  async updateDepartment(
    id: number,
    department: DepartmentModel
  ): Promise<DepartmentModel> {
    try {
      const payload = decamelizeKeys(department);
      const response = await axiosInstance.put<unknown>(
        `/department/${id}`,
        payload
      );
      return camelizeKeys(response.data) as DepartmentModel;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Deletes a department
   * @param id ID of the department to delete
   * @returns Confirmation message
   */
  async deleteDepartment(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`/department/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw this.handleApiError(error);
    }
  }
  /**
   * Deletes multiple departments by their IDs
   * @param ids Array of department IDs to delete
   * @returns Confirmation message
   */
  async deleteMultipleDepartments(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        "/department/delete-multiple",
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Exports departments to Excel based on provided IDs
   * @param ids Array of department IDs to export
   * @returns Excel file as blob data
   */
  async exportDepartmentsToExcel(ids: number[]): Promise<Blob> {
    try {
      const response = await axiosInstance.post(
        "/department/export-excel",
        ids,
        {
          responseType: "blob",
        }
      );
      return new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
      throw this.handleApiError(error);
    }
  }
}

export const departmentService = new DepartmentService();
