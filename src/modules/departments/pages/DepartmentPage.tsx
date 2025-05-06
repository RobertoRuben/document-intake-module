import { DepartmentProvider } from "@/modules/departments/context/department.context";
import { DepartmentContainer } from "@/modules/departments/components/department-container/DepartmentContainer";

const DepartmentPage = () => {
    return (
        <DepartmentProvider>
            <DepartmentContainer />
        </DepartmentProvider>
    );
};

export default DepartmentPage;