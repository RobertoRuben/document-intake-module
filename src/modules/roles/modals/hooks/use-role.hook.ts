import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleModel } from "@/modules/roles/models/role.model";
import { roleFormSchema, RoleFormValues} from "@/modules/roles/modals/validators/role.validator.schema.ts";

export const useRoleForm = (role?: RoleModel) => {
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (role) {
            form.reset({
                name: role.name,
            });
        }
    }, [role, form]);

    return {
        form,
    };
};