import { DepartmentConnectionsProvider } from "@/modules/department-connections/context/department-connections.context";
import { DepartmentConnectionContainer } from "@/modules/department-connections/components/department-connection-container/DepartmentConnectionContainer";

const DepartmentConnectionPage = () => {
    return (
        <DepartmentConnectionsProvider>
            <DepartmentConnectionContainer />
        </DepartmentConnectionsProvider>
    );
};

export default DepartmentConnectionPage;