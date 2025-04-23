import { useState, useCallback } from 'react';

export default function useLoadingSpinner() {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Cargando...');

    const showLoading = useCallback((message?: string) => {
        if (message) {
            setLoadingMessage(message);
        }
        setIsLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    return {
        isLoading,
        loadingMessage,
        showLoading,
        hideLoading,
        setLoadingMessage
    };
}