import { Employee } from "./employee.model";
import { PaginationMetaModel } from '@/globals/models/pagination.model';

export interface PaginatedEmployeesResponseModel {
    data: Employee[];
    meta: PaginationMetaModel;
}
