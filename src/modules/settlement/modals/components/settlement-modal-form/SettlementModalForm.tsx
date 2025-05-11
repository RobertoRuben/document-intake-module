import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { Settlement } from "@/modules/settlement/model/settlement.model";
import { SettlementModalFooter } from "../settlement-modal-footer/SettlementModalFooter";
import { SettlementFormFields } from "./SettlementFormFields";
import { useSettlementForm } from "../../hooks/use-settlement.hook";
import { SettlementFormValues } from "../../validators/settlement.validator.schema";

interface SettlementModalFormProps {
    settlement?: Settlement;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Settlement) => Promise<boolean>;
}

export const SettlementModalForm: React.FC<SettlementModalFormProps> = ({
    settlement,
    isEditing,
    onClose,
    onSubmit,
}) => {

    const { form } = useSettlementForm(settlement);

    const handleSubmit = async (values: SettlementFormValues) => {
        const settlementData: Settlement = {
            id: settlement?.id || undefined,
            name: values.name,
        };

        const success = await onSubmit(settlementData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <SettlementFormFields form={form} />
                </div>
                <SettlementModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};