import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { Hamlet } from "@/modules/hamlets/model/hamlet.model";
import { HamletModalFooter } from "../hamlet-modal-footer/HamletModalFooter";
import { HamletFormFields } from "./HamletModalFormFields";
import { useHamletForm } from "../../hooks/use-hamlet.hook";
import { HamletFormValues } from "@/modules/hamlets/modals/validators/hamlet.validator.schema";

interface HamletModalFormProps {
    hamlet?: Hamlet;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Hamlet) => Promise<boolean>;
    settlements: { id: number; name: string }[];
}

export const HamletModalForm: React.FC<HamletModalFormProps> = ({
    hamlet,
    isEditing,
    onClose,
    onSubmit,
    settlements,
}) => {

    const { form } = useHamletForm(hamlet);

    const handleSubmit = async (values: HamletFormValues) => {
        const hamletData: Hamlet = {
            id: hamlet?.id || undefined,
            name: values.name,
            settlementId: values.settlementId,
        };

        const success = await onSubmit(hamletData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <HamletFormFields 
                        form={form} 
                        settlements={settlements}
                    />
                </div>
                <HamletModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};