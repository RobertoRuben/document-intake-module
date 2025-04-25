import { Route } from "react-router-dom";
import RolePage from "@/modules/roles/pages/RolePage";

export const RoleRoutes = [
    <Route key="roles" path="/roles" element={<RolePage />} />
];