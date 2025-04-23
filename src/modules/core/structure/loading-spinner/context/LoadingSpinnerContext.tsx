import { createContext } from 'react';
import useLoadingSpinner from '../hooks/useLoadingSpinner';

export type LoadingSpinnerContextType = ReturnType<typeof useLoadingSpinner>;

export const LoadingSpinnerContext = createContext<LoadingSpinnerContextType | undefined>(undefined);