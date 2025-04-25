import { useContext } from 'react';
import { LoadingSpinnerContext } from '../context/loading-spinner.context.tsx';

export function useLoadingSpinnerContextHook() {
  const context = useContext(LoadingSpinnerContext);
  
  if (context === undefined) {
    throw new Error('useLoadingSpinnerContextHook debe ser usado dentro de un LoadingSpinnerProvider');
  }
  
  return context;
}