import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Employee } from "@/modules/employees/models/employee.model";
import { PaginatedEmployeesResponseModel } from "@/modules/employees/models/employe-page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing system employees
 */
export class EmployeeService {
  private readonly baseEndpoint = "/employees";

  /**
   * Gets all employees
   * @returns List of employees
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await axiosInstance.get<unknown>(this.baseEndpoint);
      return camelizeKeys(response.data) as Employee[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }

  /**
   * Gets paginated employees
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with employees
   */
  async getPaginatedEmployees(
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedEmployeesResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/paginated?page=${page}&size=${size}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedEmployeesResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }  /**
   * Searches employees by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with employees matching the search
   */
  async searchEmployees(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedEmployeesResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      
      const camelizedData = camelizeKeys(response.data) as PaginatedEmployeesResponseModel;
      
      return camelizedData;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }

  /**
   * Gets an employee by its ID
   * @param id Employee ID
   * @returns Employee data
   */
  async getEmployeeById(id: number): Promise<Employee> {
    try {
      const response = await axiosInstance.get<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as Employee;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }

  /**
   * Creates a new employee
   * @param employee Employee data to create
   * @returns Created employee
   */
  async createEmployee(employee: Employee): Promise<Employee> {
    try {
      const payload = decamelizeKeys(employee);
      const response = await axiosInstance.post<unknown>(this.baseEndpoint, payload);
      return camelizeKeys(response.data) as Employee;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }

  /**
   * Updates an existing employee
   * @param id ID of the employee to update
   * @param employee New employee data
   * @returns Updated employee
   */
  async updateEmployee(id: number, employee: Employee): Promise<Employee> {
    try {
      const payload = decamelizeKeys(employee);
      const response = await axiosInstance.put<unknown>(`${this.baseEndpoint}/${id}`, payload);
      return camelizeKeys(response.data) as Employee;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }

  /**
   * Deletes an employee
   * @param id ID of the employee to delete
   * @returns Confirmation message
   */
  async deleteEmployee(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(`${this.baseEndpoint}/${id}`);
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }

  /**
   * Deletes multiple employees by their IDs
   * @param ids Array of employee IDs to delete
   * @returns Confirmation message
   */
  async deleteMultipleEmployees(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        `${this.baseEndpoint}/delete-multiple`,
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }

  /**
   * Exports employees to Excel based on provided IDs
   * @param ids Array of employee IDs to export
   * @returns Excel file as blob data
   */
  async exportEmployeesToExcel(ids: number[]): Promise<Blob> {
    try {
      const response = await axiosInstance.post(`${this.baseEndpoint}/export-excel`, ids, {
        responseType: "blob",
      });
      return new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "EmployeeOperationError");
    }
  }
}

export const employeeService = new EmployeeService();