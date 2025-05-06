import { DepartmentModel } from "./department.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

export interface PaginatedDepartmentsResponseModel {
    data: DepartmentModel[];
    meta: PaginationMetaModel;
}