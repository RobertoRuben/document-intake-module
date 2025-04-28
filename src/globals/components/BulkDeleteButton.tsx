import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";

interface BulkDeleteButtonProps {
  selectedCount: number;
  onDelete: () => void;
  isLoading?: boolean;
}

export const BulkDeleteButton: React.FC<BulkDeleteButtonProps> = ({
  selectedCount,
  onDelete,
  isLoading
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <Button 
      variant="destructive" 
      className="flex items-center justify-center gap-2 w-full md:w-auto"
      onClick={onDelete}
      disabled={isLoading}
    >
      <Trash2 className="h-4 w-4" />
      Eliminación Masiva ({selectedCount})
    </Button>
  );
};