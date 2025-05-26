import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { DocumentaryTopic } from "./documentary-topic-model";


export interface DocumentaryTopicResponseModel {
    data: DocumentaryTopic[];
    meta: PaginationMetaModel;
}