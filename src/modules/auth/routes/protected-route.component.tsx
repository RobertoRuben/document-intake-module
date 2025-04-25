import { Navigate, Outlet } from "react-router-dom";
import { useAuthHook } from "@/modules/auth/hooks/use-auth.hook.ts";

export function ProtectedRoute() {
    const { isAuthenticated } = useAuthHook();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}