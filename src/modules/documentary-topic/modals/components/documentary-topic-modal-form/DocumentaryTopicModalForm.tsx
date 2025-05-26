import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { DocumentaryTopic } from "@/modules/documentary-topic/model/documentary-topic-model";
import { DocumentaryTopicModalFooter } from "../documentary-topic-modal-footer/DocumentaryTopicModalFooter";
import { DocumentaryTopicFormFields } from "./DocumentaryTopicModalFormFields";
import { useDocumentaryTopicForm } from "../../hooks/use-documentary-topic.hook";
import { DocumentaryTopicFormValues } from "@/modules/documentary-topic/modals/validators/documentary-topic.validatos.schema";

interface DocumentaryTopicModalFormProps {
    documentaryTopic?: DocumentaryTopic;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: DocumentaryTopic) => Promise<boolean>;
}

export const DocumentaryTopicModalForm: React.FC<DocumentaryTopicModalFormProps> = ({
    documentaryTopic,
    isEditing,
    onClose,
    onSubmit,
}) => {
    const { form } = useDocumentaryTopicForm(documentaryTopic);

    const handleSubmit = async (values: DocumentaryTopicFormValues) => {
        const topicData: DocumentaryTopic = {
            id: documentaryTopic?.id || undefined,
            name: values.name,
        };

        const success = await onSubmit(topicData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <DocumentaryTopicFormFields form={form} />
                </div>
                <DocumentaryTopicModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};