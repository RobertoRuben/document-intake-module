import { SettlementModalForm } from "./components/settlement-modal-form/SettlementModalForm";
import { Settlement } from "../model/settlement.model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { SettlementModalHeader } from "./components/settlement-modal-header/SettlementModalHeader";

interface SettlementModalProps {
    isOpen: boolean;
    settlement?: Settlement;
    onClose: () => void;
    onSubmit: (data: Settlement) => Promise<boolean>;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
    isOpen,
    settlement,
    onClose,
    onSubmit
}) => {

    const [internalSettlement, setInternalSettlement] = useState<Settlement | undefined>(settlement);
    const isEditing = !!internalSettlement;

    useEffect(() => {
        if (isOpen) {
            setInternalSettlement(settlement);
        }
    }, [isOpen, settlement]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden [&>button]:hidden max-h-[90vh]">
                <SettlementModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    <SettlementModalForm 
                        settlement={internalSettlement}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};