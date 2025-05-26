import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentaryTopic } from "@/modules/documentary-topic/model/documentary-topic-model";
import { 
    DocumentaryTopicFormValues, 
    createDocumentaryTopicFormSchema,
    updateDocumentaryTopicFormSchema
} from "../validators/documentary-topic.validatos.schema";

export const useDocumentaryTopicForm = (documentaryTopic?: DocumentaryTopic) => {
    const formSchema = documentaryTopic ? updateDocumentaryTopicFormSchema : createDocumentaryTopicFormSchema;
    
    const form = useForm<DocumentaryTopicFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    });

    useEffect(() => {
        if (documentaryTopic) {
            form.reset({
                name: documentaryTopic.name
            });
        }
    }, [documentaryTopic, form]);

    return {
        form,
    };
};