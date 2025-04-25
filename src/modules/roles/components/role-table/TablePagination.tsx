import React from "react";
import { Button } from "@/modules/core/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    selectedCount: number;
    onPageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    selectedCount,
    onPageChange,
}) => {
    const pageStart = (currentPage * pageSize) + 1;
    const pageEnd = Math.min((currentPage + 1) * pageSize, totalItems);

    return (
        <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
                {selectedCount > 0 ? (
                    <span>{selectedCount} de {totalItems} fila(s) seleccionada(s).</span>
                ) : (
                    <span>
                        Mostrando {totalItems > 0 ? `${pageStart}-${pageEnd} de ${totalItems}` : '0'} registros
                    </span>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const newPage = currentPage - 1;
                        if (newPage >= 0) {
                            onPageChange(newPage);
                        }
                    }}
                    disabled={currentPage === 0}
                    className="flex items-center"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {/* Texto visible solo en pantallas md y superiores */}
                    <span className="ml-1 hidden md:inline">Anterior</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const newPage = currentPage + 1;
                        if (newPage < totalPages) {
                            onPageChange(newPage);
                        }
                    }}
                    disabled={currentPage >= totalPages - 1}
                    className="flex items-center"
                >
                    {/* Texto visible solo en pantallas md y superiores */}
                    <span className="mr-1 hidden md:inline">Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};