import {User} from "@/modules/users/models/user.model";
import {PaginationMetaModel} from "@/globals/models/pagination.model";

export interface PaginatedUsersResponseModel {
    data: User[];
    meta: PaginationMetaModel;
} 