import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu";
import { Button } from "@/modules/core/components/ui/button";
import { FilterIcon } from "lucide-react";
import { Badge } from "@/modules/core/components/ui/badge";

export type UserStatus = "all" | "active" | "inactive";

interface UserStatusFilterProps {
  value: UserStatus;
  onChange: (value: UserStatus) => void;
  isMobileView?: boolean;
}

export const UserStatusFilter: React.FC<UserStatusFilterProps> = ({
  value,
  onChange,
  isMobileView = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (newValue: UserStatus) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const getFilterLabel = () => {
    switch (value) {
      case "active":
        return "Activos";
      case "inactive":
        return "Inactivos";
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`w-full font-medium ${
              isMobileView ? "justify-center" : "justify-between"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                isMobileView ? "justify-center" : ""
              }`}
            >
              <FilterIcon className="h-4 w-4" />
              <span className="font-semibold">Filtros</span>
              {value !== "all" && (
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0.5 text-xs"
                >
                  {getFilterLabel()}
                </Badge>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem
            className={`cursor-pointer ${
              value === "active" ? "bg-green-50 text-green-800" : ""
            }`}
            onClick={() => handleSelect("active")}
          >
            <span className="font-medium">Activos</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`cursor-pointer ${
              value === "inactive" ? "bg-green-50 text-green-800" : ""
            }`}
            onClick={() => handleSelect("inactive")}
          >
            <span className="font-medium">Inactivos</span>
          </DropdownMenuItem>
          {value === "inactive" && (
            <DropdownMenuItem
              className="cursor-pointer border-t mt-1 pt-1"
              onClick={() => handleSelect("active")}
            >
              <span className="text-gray-500">Quitar filtros</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
