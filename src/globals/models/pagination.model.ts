export interface PaginationMetaModel{
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
    nextPage: number | null;
    previousPage: number | null;
}

export interface PaginatedResponseModel<T> {
    data: T[];
    meta: PaginationMetaModel;
}