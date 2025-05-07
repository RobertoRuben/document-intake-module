import { Position } from "./position.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

export interface PaginatedPositionsResponseModel {
    data: Position[];
    meta: PaginationMetaModel;
}