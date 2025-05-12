import { HamletModalForm } from "./components/hamlet-modal-form/HamletModalForm";
import { Hamlet } from "../model/hamlet.model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { HamletModalHeader } from "./components/hamlet-modal-header/HamletModalHeader";
import { useSettlements } from "@/modules/settlements/hooks/use-settlements.hook";
import { Settlement } from "@/modules/settlements/model/settlement.model";

interface HamletModalProps {
    isOpen: boolean;
    hamlet?: Hamlet;
    onClose: () => void;
    onSubmit: (data: Hamlet) => Promise<boolean>;
    settlements?: Settlement[];
}

export const HamletModal: React.FC<HamletModalProps> = ({
    isOpen,
    hamlet,
    onClose,
    onSubmit,
    settlements: providedSettlements
}) => {
    const { data: fetchedSettlements, isLoading } = useSettlements();
    const [internalHamlet, setInternalHamlet] = useState<Hamlet | undefined>(hamlet);
    const isEditing = !!internalHamlet;
    
    const settlements = providedSettlements || fetchedSettlements || [];

    useEffect(() => {
        if (isOpen) {
            setInternalHamlet(hamlet);
        }
    }, [isOpen, hamlet]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };
    
    const settlementsForDropdown = settlements.map(settlement => ({
        id: settlement.id || 0,
        name: settlement.name
    }));

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden [&>button]:hidden max-h-[90vh]">
                <HamletModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    {!isLoading && (
                        <HamletModalForm 
                            hamlet={internalHamlet}
                            isEditing={isEditing}
                            onClose={onClose}
                            onSubmit={onSubmit}
                            settlements={settlementsForDropdown}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};