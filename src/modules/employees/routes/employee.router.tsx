import { Route } from "react-router-dom";
import EmployeePage from "@/modules/employees/pages/EmployeePage";

export const EmployeeRoutes = [
    <Route key="employees" path="/employees" element={<EmployeePage />} />
];