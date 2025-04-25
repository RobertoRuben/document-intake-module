import React from "react";
import { Input } from "@/modules/core/components/ui/input";
import { Search } from "lucide-react";

interface RoleSearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const RoleSearchInput: React.FC<RoleSearchInputProps> = ({ value, onChange }) => {
    return (
        <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
                placeholder="Buscar roles..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 pr-4"
            />
        </div>
    );
};