import axiosInstance from "@/globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { User, UserStatus } from "@/modules/users/models/user.model";
import { PaginatedUsersResponseModel } from "@/modules/users/models/user-page.model";
import { ApiErrorHandler } from "@/globals/exceptions/api-error.handler";

/**
 * Service for managing system users
 */
export class UserService {
  private readonly baseEndpoint = "/users";

  /**
   * Gets all users
   * @returns List of users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get<unknown>(this.baseEndpoint);
      return camelizeKeys(response.data) as User[];
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }
  /**
   * Gets paginated users
   * @param page Page number
   * @param size Items per page
   * @param onlyActive If true, returns only active users; if false, returns only inactive users
   * @returns Paginated response with users
   */
  async getPaginatedUsers(
    page: number = 1,
    size: number = 5,
    onlyActive: boolean = true
  ): Promise<PaginatedUsersResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/paginated?page=${page}&size=${size}&only_active=${onlyActive}`
      );
      const paginatedResult = camelizeKeys(
        response.data
      ) as PaginatedUsersResponseModel;
      return paginatedResult;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Searches users by search term
   * @param searchTerm Search term
   * @param page Page number
   * @param size Items per page
   * @returns Paginated response with users matching the search
   */
  async searchUsers(
    searchTerm: string,
    page: number = 1,
    size: number = 5
  ): Promise<PaginatedUsersResponseModel> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/search?search_term=${searchTerm}&page=${page}&size=${size}`
      );
      return camelizeKeys(response.data) as PaginatedUsersResponseModel;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Gets a user by its ID
   * @param id User ID
   * @returns User data
   */
  async getUserById(id: number): Promise<User> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/${id}`
      );
      return camelizeKeys(response.data) as User;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Gets a user by username
   * @param username Username to search
   * @returns User data
   */
  async getUserByUsername(username: string): Promise<User> {
    try {
      const response = await axiosInstance.get<unknown>(
        `${this.baseEndpoint}/username/${username}`
      );
      return camelizeKeys(response.data) as User;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Creates a new user
   * @param user User data to create
   * @returns Created user
   */
  async createUser(user: User): Promise<User> {
    try {
      const payload = decamelizeKeys(user);
      const response = await axiosInstance.post<unknown>(
        this.baseEndpoint,
        payload
      );
      return camelizeKeys(response.data) as User;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Updates an existing user
   * @param id ID of the user to update
   * @param user New user data
   * @returns Updated user
   */
  async updateUser(id: number, user: User): Promise<User> {
    try {
      const payload = decamelizeKeys(user);
      const response = await axiosInstance.put<unknown>(
        `${this.baseEndpoint}/${id}`,
        payload
      );
      return camelizeKeys(response.data) as User;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }  /**
   * Changes the user status (activate/deactivate)
   * @param id ID of the user
   * @param status New status
   * @returns Updated user
   */
  async changeUserStatus(id: number, status: UserStatus | boolean): Promise<User> {
    try {
      const userStatus = typeof status === 'boolean'
        ? status ? UserStatus.ACTIVATE : UserStatus.DEACTIVATE
        : status;
        
      const response = await axiosInstance.patch<unknown>(
        `${this.baseEndpoint}/${id}/status?status=${userStatus}`,
        {} 
      );
      return camelizeKeys(response.data) as User;
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Updates a user's password
   * @param userId ID of the user
   * @param oldPassword Current password
   * @param newPassword New password
   * @returns Success message
   */
  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const payload = decamelizeKeys({
        oldPassword,
        newPassword,
      });
      const response = await axiosInstance.patch<unknown>(
        `${this.baseEndpoint}/${userId}/password`,
        payload
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Deletes a user
   * @param id ID of the user to delete
   * @returns Confirmation message
   */
  async deleteUser(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<unknown>(
        `${this.baseEndpoint}/${id}`
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Deletes multiple users by their IDs
   * @param ids Array of user IDs to delete
   * @returns Confirmation message
   */
  async deleteMultipleUsers(ids: number[]): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<unknown>(
        `${this.baseEndpoint}/delete-multiple`,
        ids
      );
      return camelizeKeys(response.data) as { message: string };
    } catch (error) {
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }

  /**
   * Exports users to Excel based on provided IDs
   * @param ids Array of user IDs to export
   * @returns Excel file as blob data
   */
  async exportUsersToExcel(ids: number[]): Promise<Blob> {
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
      throw ApiErrorHandler.handleApiError(error, "UserOperationError");
    }
  }
}

export const userService = new UserService();
