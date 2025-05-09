import { EmployeeProvider } from "@/modules/employees/context/employee.context";
import { EmployeeContainer } from "@/modules/employees/components/employee-container/EmployeeContainer";

const EmployeePage = () => {
    return (
        <EmployeeProvider>
            <EmployeeContainer />
        </EmployeeProvider>
    );
};

export default EmployeePage;