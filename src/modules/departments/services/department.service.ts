import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Department } from "@/modules/departments/models/department.model";
import { PaginatedDepartmentsResponseModel } from "@/modules/departments/models/department.page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing system departments
 */
export class DepartmentService {
  private readonly baseEndpoint = "/department";

  /**
   * Gets all departments
   * @returns List of departments
   */
  async getAllDepartments(): Promise<Department[]> {
    try {
      const response = await axiosInstance.get<unknown>(this.baseEndpoint);
      return camelizeKeys(response.data) as Department[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
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
        `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedDepartmentsResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
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
        `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedDepartmentsResponseModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
    }
  }

  /**
   * Gets a department by its ID
   * @param id Department ID
   * @returns Department data
   */
  async getDepartmentById(id: number): Promise<Department> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as Department;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
    }
  }

  /**
   * Creates a new department
   * @param department Department data to create
   * @returns Created department
   */
  async createDepartment(
    department: Department
  ): Promise<Department> {
    try {
      const payload = decamelizeKeys(department);
      const response = await axiosInstance.post<unknown>(
        this.baseEndpoint,
        payload
      );
      return camelizeKeys(response.data) as Department;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
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
    department: Department
  ): Promise<Department> {
    try {
      const payload = decamelizeKeys(department);
      const response = await axiosInstance.put<unknown>(
        `${this.baseEndpoint}/${id}`,
        payload
      );
      return camelizeKeys(response.data) as Department;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
    }
  }

  /**
   * Deletes a department
   * @param id ID of the department to delete
   * @returns Confirmation message
   */
  async deleteDepartment(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
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
        `${this.baseEndpoint}/delete-multiple`,
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
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
      throw ApiErrorHandler.handleApiError(error, "DepartmentOperationError");
    }
  }
}

export const departmentService = new DepartmentService();