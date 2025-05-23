import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { DocumentCategory } from "./document-category.model";


export interface PaginatedDocumentCategoriesResponseModel {
    data: DocumentCategory[];
    meta: PaginationMetaModel;
}