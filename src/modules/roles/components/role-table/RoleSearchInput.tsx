import React from "react";
import { Input } from "@/modules/core/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";

interface RoleSearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const RoleSearchInput: React.FC<RoleSearchInputProps> = ({ value, onChange }) => {
    const handleClear = () => {
        onChange("");
    };

    return (
        <div className="relative w-full md:w-[400px] lg:w-[500px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
                placeholder="Buscar roles..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 pr-10"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1.5 top-1.5 h-6 w-6 p-0 rounded-full"
                    onClick={handleClear}
                    type="button"
                >
                    <X className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Borrar búsqueda</span>
                </Button>
            )}
        </div>
    );
};