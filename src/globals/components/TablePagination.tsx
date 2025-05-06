import React from "react";
import { Button } from "@/modules/core/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize?: number;
    selectedCount?: number;
    onPageChange: (page: number) => void;
    className?: string;
    showLabels?: boolean;
    prevLabel?: string;
    nextLabel?: string;
    itemName?: string; 
}

export const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    selectedCount = 0,
    onPageChange,
    className = "flex items-center justify-between py-4",
    showLabels = true,
    prevLabel = "Anterior",
    nextLabel = "Siguiente",
    itemName = "fila"
}) => {
    const itemNamePlural = `${itemName}${itemName.endsWith('s') ? '' : 's'}`;
    
    return (
        <div className={className}>
            <div className="text-sm text-muted-foreground">
                {selectedCount > 0 ? (
                    <span>
                        {selectedCount} de {totalItems} {selectedCount === 1 ? itemName : itemNamePlural} seleccionada{selectedCount === 1 ? '' : 's'}.
                    </span>
                ) : (
                    <span>
                        Mostrado {currentPage + 1} de {totalPages} páginas
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
                    {showLabels && <span className="ml-1 hidden md:inline">{prevLabel}</span>}
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
                    {showLabels && <span className="mr-1 hidden md:inline">{nextLabel}</span>}
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};