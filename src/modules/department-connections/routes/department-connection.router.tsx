import { Route } from "react-router-dom";
import DepartmentConnectionPage from "@/modules/department-connections/pages/DepartmentConnectionPage";

export const DepartmentConnectionRoutes = [
    <Route key="department-connections" path="/department-connections" element={<DepartmentConnectionPage />} />
];