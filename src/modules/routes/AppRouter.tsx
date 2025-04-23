import { Route, Routes } from "react-router-dom";
import { Layout } from "@/modules/core/structure/layout/Layout";
import AuthPage from "@/modules/auth/page/AuthPage.tsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      
      <Route path="/" element={<Layout />}>
      </Route>
    </Routes>
  );
}