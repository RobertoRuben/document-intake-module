import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settlement } from "../../model/settlement.model";
import { settlementFormSchema, SettlementFormValues } from "@/modules/settlement/modals/validators/settlement.validator.schema";

export const useSettlementForm = (settlement?: Settlement) => {
    const form = useForm<SettlementFormValues>({
        resolver: zodResolver(settlementFormSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (settlement) {
            form.reset({
                name: settlement.name,
            });
        }
    }, [settlement, form]);

    return {
        form,
    };
};