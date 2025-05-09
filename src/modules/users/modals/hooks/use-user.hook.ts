import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserStatus } from "@/modules/users/models/user.model";
import { 
    UserFormValues, 
    createUserFormSchema,
    updateUserFormSchema
} from "../validators/user.validator.schema";

export const useUserForm = (user?: User) => {
    const formSchema = user ? updateUserFormSchema : createUserFormSchema;
    
    const form = useForm<UserFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            isActive: UserStatus.ACTIVATE,
            roleId: 0,
            employeeId: 0
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                username: user.username,
                password: undefined,
                isActive: user.isActive,
                roleId: user.roleId || 0,
                employeeId: user.employeeId || 0
            });
        }
    }, [user, form]);

    return {
        form,
    };
};