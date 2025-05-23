import { DocumentCategoryProvider } from "@/modules/document-categories/context/document-category.context";
import { DocumentCategoryContainer } from "@/modules/document-categories/components/document-category-container/DocumentCategoryContainer";

const DocumentCategoryPage = () => {
    return (
        <DocumentCategoryProvider>
            <DocumentCategoryContainer />
        </DocumentCategoryProvider>
    );
};

export default DocumentCategoryPage;