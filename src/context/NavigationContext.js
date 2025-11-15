import { createContext, useContext } from 'react';

/**
 * Navigation Context for managing navigation between administrative levels
 * Maintains navigation history and provides methods to navigate
 */

export const NavigationContext = createContext(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};


