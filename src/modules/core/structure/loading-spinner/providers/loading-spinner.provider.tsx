import { ReactNode } from 'react';
import useLoadingSpinnerHook from '../hooks/use-loading-spinner.hook.ts';
import { LoadingSpinnerContext } from '../context/loading-spinner.context.tsx';

interface LoadingSpinnerProviderProps {
  children: ReactNode;
}

export function LoadingSpinnerProvider({ children }: LoadingSpinnerProviderProps) {
  const loadingSpinnerValues = useLoadingSpinnerHook();

  return (
    <LoadingSpinnerContext.Provider value={loadingSpinnerValues}>
      {children}
    </LoadingSpinnerContext.Provider>
  );
}