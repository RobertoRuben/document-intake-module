import { Button } from "@/modules/core/components/ui/button";
import { XCircle } from "lucide-react";

interface DepartmentCancelButtonProps {
    onClose: () => void;
}

export const DepartmentCancelButton: React.FC<DepartmentCancelButtonProps> = ({ onClose }) => {
    return (
        <Button
            type="button"
            onClick={onClose}
            className="w-full bg-[#d82f2f] text-white hover:bg-[#991f1f] flex items-center justify-center"
        >
            <XCircle className="w-5 h-5 mr-2" />
            Cancelar
        </Button>
    );
};