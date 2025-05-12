import { Hamlet } from "./hamlet.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

export interface PaginatedHamletsResponseModel {
    data: Hamlet[];
    meta: PaginationMetaModel;
}