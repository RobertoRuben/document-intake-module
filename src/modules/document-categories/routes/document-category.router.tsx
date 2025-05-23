import { Route } from "react-router-dom";
import DocumentCategoryPage from "@/modules/document-categories/pages/DocumentCategoryPage";

export const DocumentCategoryRoutes = [
    <Route key="document-categories" path="/document-categories" element={<DocumentCategoryPage />} />
];