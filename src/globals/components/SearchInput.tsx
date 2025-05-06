import React from "react";
import { Input } from "@/modules/core/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    width?: string;
    onSubmit?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Buscar...",
    className = "relative",
    inputClassName = "pl-9 pr-10",
    disabled = false,
    autoFocus = false,
    width = "w-full md:w-[400px] lg:w-[500px]",
    onSubmit
}) => {
    const handleClear = () => {
        onChange("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && onSubmit) {
            onSubmit();
        }
    };

    return (
        <div className={`${width} ${className}`}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={inputClassName}
                disabled={disabled}
                autoFocus={autoFocus}
                onKeyDown={handleKeyDown}
            />
            {value && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1.5 top-1.5 h-6 w-6 p-0 rounded-full"
                    onClick={handleClear}
                    type="button"
                    disabled={disabled}
                >
                    <X className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Borrar búsqueda</span>
                </Button>
            )}
        </div>
    );
};