import { DocumentaryTopicProvider } from "@/modules/documentary-topic/context/documentary-topic.context";
import { DocumentaryTopicContainer } from "@/modules/documentary-topic/components/documentary-topic-container/DocumentaryTopicContainer";

const DocumentaryTopicPage = () => {
    return (
        <DocumentaryTopicProvider>
            <DocumentaryTopicContainer />
        </DocumentaryTopicProvider>
    );
};

export default DocumentaryTopicPage;