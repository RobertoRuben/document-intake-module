import { Submitter } from "./submitter.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

export interface PaginatedSubmittersResponseModel {
    data: Submitter[];
    meta: PaginationMetaModel;
}