import { ReactNode } from 'react';
import useLoadingSpinner from '../hooks/useLoadingSpinner';
import { LoadingSpinnerContext } from '../context/LoadingSpinnerContext';

interface LoadingSpinnerProviderProps {
  children: ReactNode;
}

export function LoadingSpinnerProvider({ children }: LoadingSpinnerProviderProps) {
  const loadingSpinnerValues = useLoadingSpinner();

  return (
    <LoadingSpinnerContext.Provider value={loadingSpinnerValues}>
      {children}
    </LoadingSpinnerContext.Provider>
  );
}