import { Route } from "react-router-dom";
import DepartmentPage from "@/modules/departments/pages/DepartmentPage";

export const DepartmentRoutes = [
    <Route key="departments" path="/departments" element={<DepartmentPage />} />
];