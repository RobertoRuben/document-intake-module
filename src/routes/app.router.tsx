import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/modules/core/structure/layout/Layout";
import { AuthRoutes } from "@/modules/auth/routes/auth.routes.tsx";
import { ProtectedRoute } from "@/modules/auth/routes/protected-route.component.tsx";
import { RoleRoutes} from "@/modules/roles/routes/role.router.tsx";
import { DepartmentRoutes } from "@/modules/departments/routes/department.router.tsx";
import { PositionRoutes } from "@/modules/positions/routes/position.router.tsx";
import { EmployeeRoutes } from "@/modules/employees/routes/employee.router.tsx";
import { UserRoutes } from "@/modules/users/routes/user.router.tsx";
import { SettlementRoutes } from "@/modules/settlements/routes/settlement.router";
import { HamletRoutes } from "@/modules/hamlets/routes/hamlet.router";
import { DepartmentConnectionRoutes } from "@/modules/department-connections/routes/department-connection.router.tsx";
import { DocumentCategoryRoutes } from "@/modules/document-categories/routes/document-category.router";
import { DocumentaryTopicRoutes } from "@/modules/documentary-topic/routes/documentary-topic.router";

export function AppRouter() {
    return (
        <Routes>
            {AuthRoutes}

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                    {RoleRoutes}
                    {DepartmentRoutes}
                    {PositionRoutes}
                    {EmployeeRoutes}
                    {UserRoutes}
                    {SettlementRoutes}
                    {HamletRoutes}
                    {DepartmentConnectionRoutes}
                    {DocumentCategoryRoutes}
                    {DocumentaryTopicRoutes}
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/auth" replace />}
            />
        </Routes>
    );
}