// src/modules/roles/models/role.page.model.ts
import { RoleModel } from "@/modules/roles/models/role.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

export interface PaginatedRolesResponseModel {
    data: RoleModel[];
    meta: PaginationMetaModel;
}