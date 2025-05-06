// src/modules/routes/app.router.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/modules/core/structure/layout/Layout";
import { AuthRoutes } from "@/modules/auth/routes/auth.routes.tsx";
import { ProtectedRoute } from "@/modules/auth/routes/protected-route.component.tsx";
import { RoleRoutes} from "@/modules/roles/routes/role.router.tsx";
import { DepartmentRoutes } from "@/modules/departments/routes/department.router.tsx";

export function AppRouter() {
    return (
        <Routes>
            {AuthRoutes}

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                    {RoleRoutes}
                    {DepartmentRoutes}
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/auth" replace />}
            />
        </Routes>
    );
}