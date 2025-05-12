import { Settlement } from "./settlement.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

export interface PaginatedSettlementsResponseModel {
    data: Settlement[];
    meta: PaginationMetaModel;
}