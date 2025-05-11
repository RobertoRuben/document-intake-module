// src/modules/roles/models/role.page.model.ts
import { Role } from "@/modules/roles/models/role.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

export interface PaginatedRolesResponseModel {
    data: Role[];
    meta: PaginationMetaModel;
}