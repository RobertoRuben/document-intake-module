/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, ReactNode } from "react";
import { useDocumentCategoryTable } from "../hooks/use-document-category-table.hook";
import { DocumentCategory } from "../model/document-category.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { useDocumentCategoryContext } from "./document-category.context";

interface DocumentCategoryTableContextType {
  documentCategories: DocumentCategory[];
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

const DocumentCategoryTableContext = createContext<
  DocumentCategoryTableContextType | undefined
>(undefined);

export const DocumentCategoryTableProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const {
    documentCategories,
    paginationMeta,
    dataVersion,
    currentPage,
    searchTerm,
    isLoading,
    handleEditCategory: onEdit,
    handleDeleteCategory: onDelete,
    handleSearchChange: onSearchChange,
    handlePageChange: onPageChange,
    handleDeleteMultipleCategories,
  } = useDocumentCategoryContext();

  const tableHookProps = useDocumentCategoryTable({
    documentCategories,
    dataVersion,
    paginationMeta,
    searchTerm,
    onEdit,
    onDelete,
    onBulkDelete: handleDeleteMultipleCategories,
    onSearchChange,
    onPageChange,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    dataVersion: dataVersionDup,
    searchTerm: searchTermDup,
    onSearchChange: onSearchChangeDup,
    documentCategories: categoriesFromTable,
    ...restTableHookProps
  } = tableHookProps;

  const value: DocumentCategoryTableContextType = {
    documentCategories,
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
    <DocumentCategoryTableContext.Provider value={value}>
      {children}
    </DocumentCategoryTableContext.Provider>
  );
};

export const useDocumentCategoryTableContext =
  (): DocumentCategoryTableContextType => {
    const context = useContext(DocumentCategoryTableContext);
    if (context === undefined) {
      throw new Error(
        "useDocumentCategoryTableContext debe usarse dentro de un DocumentCategoryTableProvider"
      );
    }
    return context;
  };
