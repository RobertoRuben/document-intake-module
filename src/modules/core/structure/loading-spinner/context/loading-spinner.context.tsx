import { createContext } from 'react';
import useLoadingSpinnerHook from '../hooks/use-loading-spinner.hook.ts';

export type LoadingSpinnerContextType = ReturnType<typeof useLoadingSpinnerHook>;

export const LoadingSpinnerContext = createContext<LoadingSpinnerContextType | undefined>(undefined);