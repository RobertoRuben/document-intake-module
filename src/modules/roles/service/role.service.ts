import axiosInstance from "../../../globals/config/axios-config";
import { camelizeKeys, decamelizeKeys } from "humps";
import { RoleModel} from "@/modules/roles/models/role.model";
import { PaginatedRolesResponseModel} from "@/modules/roles/models/role.page.model";

/**
 * Service for managing system roles
 */
export class RoleService {
    /**
     * Gets all roles
     * @returns List of roles
     */
    async getAllRoles(): Promise<RoleModel[]> {
        const response = await axiosInstance.get<unknown>("/role");
        return camelizeKeys(response.data) as RoleModel[];
    }

    /**
     * Gets paginated roles
     * @param page Page number
     * @param size Items per page
     * @returns Paginated response with roles
     */
    async getPaginatedRoles(page: number = 1, size: number = 10): Promise<PaginatedRolesResponseModel> {
        const response = await axiosInstance.get<unknown>(`/role/paginated?page=${page}&size=${size}`);
        return camelizeKeys(response.data) as PaginatedRolesResponseModel;
    }

    /**
     * Searches roles by search term
     * @param searchTerm Search term
     * @param page Page number
     * @param size Items per page
     * @returns Paginated response with roles matching the search
     */
    async searchRoles(searchTerm: string, page: number = 1, size: number = 10): Promise<PaginatedRolesResponseModel> {
        const response = await axiosInstance.get<unknown>(`/role/search?search_term=${searchTerm}&page=${page}&size=${size}`);
        return camelizeKeys(response.data) as PaginatedRolesResponseModel;
    }

    /**
     * Gets a role by its ID
     * @param id Role ID
     * @returns Role data
     */
    async getRoleById(id: number): Promise<RoleModel> {
        const response = await axiosInstance.get<unknown>(`/role/${id}`);
        return camelizeKeys(response.data) as RoleModel;
    }

    /**
     * Creates a new role
     * @param role Role data to create
     * @returns Created role
     */
    async createRole(role: RoleModel): Promise<RoleModel> {
        const payload = decamelizeKeys(role);
        const response = await axiosInstance.post<unknown>("/role", payload);
        return camelizeKeys(response.data) as RoleModel;
    }

    /**
     * Updates an existing role
     * @param id ID of the role to update
     * @param role New role data
     * @returns Updated role
     */
    async updateRole(id: number, role: RoleModel): Promise<RoleModel> {
        const payload = decamelizeKeys(role);
        const response = await axiosInstance.put<unknown>(`/role/${id}`, payload);
        return camelizeKeys(response.data) as RoleModel;
    }

    /**
     * Deletes a role
     * @param id ID of the role to delete
     * @returns Confirmation message
     */
    async deleteRole(id: number): Promise<{ message: string }> {
        const response = await axiosInstance.delete<unknown>(`/role/${id}`);
        return camelizeKeys(response.data) as { message: string };
    }
}

export const roleService = new RoleService();