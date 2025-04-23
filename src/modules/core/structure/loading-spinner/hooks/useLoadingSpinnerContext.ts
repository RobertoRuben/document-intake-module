import { useContext } from 'react';
import { LoadingSpinnerContext } from '../context/LoadingSpinnerContext';

export function useLoadingSpinnerContext() {
  const context = useContext(LoadingSpinnerContext);
  
  if (context === undefined) {
    throw new Error('useLoadingSpinnerContext debe ser usado dentro de un LoadingSpinnerProvider');
  }
  
  return context;
}