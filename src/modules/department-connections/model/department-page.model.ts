import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { DepartmentConnection } from "./department-connection.model";

export interface PaginatedDepartmentsResponseModel {
  data: DepartmentConnection[];
  meta: PaginationMetaModel;
}
