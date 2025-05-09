import { Department } from "./department.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

export interface PaginatedDepartmentsResponseModel {
    data: Department[];
    meta: PaginationMetaModel;
}