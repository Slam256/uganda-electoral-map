import { useCallback, useState } from 'react';
import { NavigationContext } from './NavigationContext';


export const NavigationProvider = ({ children, onNavigate }) => {
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null);

  /**
   * Navigate to a specific administrative unit
   */
  const navigateTo = useCallback((adminLevel, identifier, identifierType = 'name', metadata = {}) => {
    const navigationItem = {
      adminLevel,
      identifier,
      identifierType,
      metadata,
      timestamp: Date.now()
    };

    setCurrentSelection(navigationItem);
    setNavigationHistory(prev => [...prev, navigationItem]);
    
    // Trigger the actual navigation (update map selection)
    if (onNavigate) {
      onNavigate({
        layerType: adminLevel,
        identifier,
        identifierType,
        ...metadata
      });
    }
  }, [onNavigate]);

  const navigateBack = useCallback(() => {
    if (navigationHistory.length <= 1) return;
    
    const newHistory = [...navigationHistory];
    newHistory.pop();
    const previousItem = newHistory[newHistory.length - 1];
    
    if (previousItem) {
      setNavigationHistory(newHistory);
      setCurrentSelection(previousItem);
      
      if (onNavigate) {
        onNavigate({
          layerType: previousItem.adminLevel,
          identifier: previousItem.identifier,
          identifierType: previousItem.identifierType,
          ...previousItem.metadata
        });
      }
    }
  }, [navigationHistory, onNavigate]);

  const clearHistory = useCallback(() => {
    setNavigationHistory([]);
    setCurrentSelection(null);
  }, []);

  const getBreadcrumbs = useCallback(() => {
    if (!currentSelection) return [];
    
    const breadcrumbs = [];
    
    // Add parent levels if available in metadata
    if (currentSelection.metadata?.district) {
      breadcrumbs.push({
        level: 'districts',
        name: currentSelection.metadata.district,
        identifier: currentSelection.metadata.districtId || currentSelection.metadata.district
      });
    }
    
    if (currentSelection.metadata?.constituency) {
      breadcrumbs.push({
        level: 'constituencies', 
        name: currentSelection.metadata.constituency,
        identifier: currentSelection.metadata.constituencyId || currentSelection.metadata.constituency
      });
    }
    
    if (currentSelection.metadata?.subcounty) {
      breadcrumbs.push({
        level: 'subcounties',
        name: currentSelection.metadata.subcounty,
        identifier: currentSelection.metadata.subcountyId || currentSelection.metadata.subcounty
      });
    }
    
    // Add current level
    const levelNames = {
      districts: 'District',
      constituencies: 'Constituency',
      subcounties: 'Subcounty',
      parishes: 'Parish'
    };
    
    breadcrumbs.push({
      level: currentSelection.adminLevel,
      name: currentSelection.metadata?.name || currentSelection.identifier,
      identifier: currentSelection.identifier,
      isCurrent: true
    });
    
    return breadcrumbs;
  }, [currentSelection]);

  const value = {
    currentSelection,
    navigationHistory,
    navigateTo,
    navigateBack,
    clearHistory,
    getBreadcrumbs,
    canGoBack: navigationHistory.length > 1
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
