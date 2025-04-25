import {PaginatedResponseModel} from "@/globals/models/pagination.model";
import {RoleResponseModel} from "@/modules/roles/models/role.response.model";

export type PaginatedRolesResponseModel = PaginatedResponseModel<RoleResponseModel>;
