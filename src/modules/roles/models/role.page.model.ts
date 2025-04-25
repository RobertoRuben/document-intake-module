import {PaginatedResponseModel} from "@/globals/models/pagination.model";
import {RoleModel} from "@/modules/roles/models/role.model";

export type PaginatedRolesResponseModel = PaginatedResponseModel<RoleModel>;
