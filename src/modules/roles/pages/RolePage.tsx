import { RoleProvider } from "@/modules/roles/context/role.context";
import { RoleContainer } from "@/modules/roles/components/role-container/RoleContainer";

const RolesPage = () => {
    return (
        <RoleProvider>
            <RoleContainer />
        </RoleProvider>
    );
};

export default RolesPage;