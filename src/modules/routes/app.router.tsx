// src/modules/routes/app.router.tsx
import {Navigate, Route, Routes} from "react-router-dom";
import { Layout } from "@/modules/core/structure/layout/Layout";
import { AuthRoutes } from "@/modules/auth/routes/auth.routes.tsx";
import { ProtectedRoute } from "@/modules/auth/routes/protected-route.component.tsx";

export function AppRouter() {
    return (
        <Routes>
            {AuthRoutes}

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                    {/* Aquí irían las rutas anidadas que requieren autenticación */}
                </Route>
            </Route>

            {/* Redirige cualquier ruta desconocida a /auth si no está autenticado, o a / si está autenticado */}
            <Route
                path="*"
                element={<Navigate to="/auth" replace />}
            />
        </Routes>
    );
}