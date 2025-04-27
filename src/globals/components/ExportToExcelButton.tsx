import React from "react";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";

interface ExportToExcelButtonProps {
  selectedCount: number;
  onExport: () => void;
}

export const ExportToExcelButton: React.FC<ExportToExcelButtonProps> = ({
  selectedCount,
  onExport
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <Button 
      variant="outline" 
      className="flex items-center justify-center gap-2 w-full md:w-auto bg-[#E8F5E9] hover:bg-[#C8E6C9] border-[#81C784] text-[#2E7D32]"
      onClick={onExport}
    >
      <FileSpreadsheet className="h-4 w-4" />
      Exportar a Excel ({selectedCount})
    </Button>
  );
};