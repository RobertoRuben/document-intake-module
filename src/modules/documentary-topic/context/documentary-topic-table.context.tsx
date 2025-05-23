/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, ReactNode } from "react";
import { useDocumentaryTopicTable } from "../hook/use-documentary-topic-table.hook";
import { DocumentaryTopic } from "../model/documentary-topic-model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { useDocumentaryTopicContext } from "./documentary-topic.context";

interface DocumentaryTopicTableContextType {
  documentaryTopics: DocumentaryTopic[];
  paginationMeta: PaginationMetaModel;
  dataVersion: number;
  currentPage: number;
  searchTerm: string;
  isLoading: boolean;
  onEdit: (id?: number) => void;
  onDelete: (id?: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onPageChange: (page: number) => void;
  [key: string]: unknown;
}

const DocumentaryTopicTableContext = createContext<
  DocumentaryTopicTableContextType | undefined
>(undefined);

export const DocumentaryTopicTableProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const {
    documentaryTopics,
    paginationMeta,
    dataVersion,
    currentPage,
    searchTerm,
    isLoading,
    handleEditTopic: onEdit,
    handleDeleteTopic: onDelete,
    handleSearchChange: onSearchChange,
    handlePageChange: onPageChange,
    handleDeleteMultipleTopics,
  } = useDocumentaryTopicContext();

  const tableHookProps = useDocumentaryTopicTable({
    documentaryTopics,
    dataVersion,
    paginationMeta,
    searchTerm,
    onEdit,
    onDelete,
    onBulkDelete: handleDeleteMultipleTopics,
    onSearchChange,
    onPageChange,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    dataVersion: dataVersionDup,
    searchTerm: searchTermDup,
    onSearchChange: onSearchChangeDup,
    documentaryTopics: topicsFromTable,
    ...restTableHookProps
  } = tableHookProps;

  const value: DocumentaryTopicTableContextType = {
    documentaryTopics,
    paginationMeta,
    dataVersion,
    currentPage,
    searchTerm,
    isLoading,
    onEdit,
    onDelete,
    onSearchChange,
    onPageChange,
    ...restTableHookProps,
  };

  return (
    <DocumentaryTopicTableContext.Provider value={value}>
      {children}
    </DocumentaryTopicTableContext.Provider>
  );
};

export const useDocumentaryTopicTableContext =
  (): DocumentaryTopicTableContextType => {
    const context = useContext(DocumentaryTopicTableContext);
    if (context === undefined) {
      throw new Error(
        "useDocumentaryTopicTableContext debe usarse dentro de un DocumentaryTopicTableProvider"
      );
    }
    return context;
  };