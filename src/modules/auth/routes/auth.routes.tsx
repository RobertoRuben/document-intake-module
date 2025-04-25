import { Route } from "react-router-dom";
import AuthPage from "@/modules/auth/page/AuthPage.tsx";

export const AuthRoutes = [
    <Route key="auth" path="/auth" element={<AuthPage />} />
];