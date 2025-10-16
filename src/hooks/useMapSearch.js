import { useState, useCallback, useMemo } from 'react';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';

export const useMapSearch = (mapRef) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Helper to safely get the map instance
  const getMapInstance = useCallback(() => {
    if (!mapRef.current || !mapRef.current.getMap) return null;
    
    const map = mapRef.current.getMap(); 
    // Check if map is properly initialized with a view
    if (map && typeof map.getView === 'function') {
      return map;
    }
    return null;
  }, [mapRef]);

  // Extract all features from the map layers
  const getAllFeatures = useCallback(() => {
    const map = getMapInstance();
    if (!map) return [];

    const features = [];
    
    try {
      // Iterate through all layers in the map
      map.getLayers().forEach(layer => {
        if (layer instanceof LayerGroup) {
          // If it's a layer group, iterate through its layers
          layer.getLayers().forEach(subLayer => {
            if (subLayer instanceof VectorLayer) {
              const source = subLayer.getSource();
              const layerName = subLayer.get('name');
              
              if (source && layerName) {
                // Check if features are loaded
                const layerFeatures = source.getFeatures();
                if (layerFeatures && layerFeatures.length > 0) {
                  layerFeatures.forEach(feature => {
                    const properties = feature.getProperties();
                    
                    // Extract the name based on layer type
                    let featureName = null;
                    if (layerName === 'districts') {
                      featureName = properties.NAME || properties.DName2019;
                    } else if (layerName === 'subcounties') {
                      featureName = properties.SUBCOUNTY || properties.NAME;
                    }
                    
                    if (featureName) {
                      features.push({
                        name: featureName,
                        layerType: layerName,
                        layer: subLayer,
                        feature: feature,
                        properties: properties
                      });
                    }
                  });
                }
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Error getting features:', error);
    }

    return features;
  }, [getMapInstance]);

  // Perform fuzzy search on features
  const searchFeatures = useCallback((query) => {
    if (!query || query.trim().length < 2) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    const allFeatures = getAllFeatures();
    
    // Score and filter features based on search query
    const scoredResults = allFeatures
      .map(item => {
        const normalizedName = item.name.toLowerCase();
        let score = 0;
        
        // Exact match
        if (normalizedName === normalizedQuery) {
          score = 100;
        }
        // Starts with query
        else if (normalizedName.startsWith(normalizedQuery)) {
          score = 90;
        }
        // Contains query as a word boundary
        else if (normalizedName.includes(' ' + normalizedQuery)) {
          score = 80;
        }
        // Contains query anywhere
        else if (normalizedName.includes(normalizedQuery)) {
          score = 70;
        }
        // Fuzzy match - all characters of query appear in order
        else {
          let queryIndex = 0;
          let nameIndex = 0;
          
          while (queryIndex < normalizedQuery.length && nameIndex < normalizedName.length) {
            if (normalizedName[nameIndex] === normalizedQuery[queryIndex]) {
              queryIndex++;
            }
            nameIndex++;
          }
          
          if (queryIndex === normalizedQuery.length) {
            score = 50 - (nameIndex - queryIndex); // Prefer shorter distances
          }
        }
        
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => {
        // Sort by score first, then by name
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10); // Limit to top 10 results
    
    return scoredResults;
  }, [getAllFeatures]);

  // Search results based on current query
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return searchFeatures(searchQuery);
  }, [searchQuery, searchFeatures]);

  // Zoom to a specific feature
  const zoomToFeature = useCallback((item) => {
    if (!item?.feature) return;
    
    const map = getMapInstance();
    if (!map) return;
    
    const geometry = item.feature.getGeometry();
    
    if (geometry) {
      const extent = geometry.getExtent();
      const view = map.getView();
      
      // Animate zoom to feature
      view.fit(extent, {
        duration: 1000,
        padding: [100, 100, 100, 400] // Extra padding on right for the panel
      });
    }
  }, [getMapInstance]);

  // Select a feature (highlight + show details)
  const selectFeature = useCallback((item, onFeatureSelect) => {
    if (!item?.feature) return;
    
    const map = getMapInstance();
    if (!map) return;

    // Clear any existing selection
    map.getLayers().forEach(layer => {
      if (layer instanceof LayerGroup) {
        layer.getLayers().forEach(subLayer => {
          if (subLayer instanceof VectorLayer) {
            subLayer.getSource().getFeatures().forEach(f => {
              f.set('selected', false);
            });
            subLayer.changed();
          }
        });
      }
    });

    // Set new selection
    item.feature.set('selected', true);
    item.layer.changed();

    // Trigger the feature select callback
    if (onFeatureSelect) {
      onFeatureSelect({
        properties: item.properties,
        layerType: item.layerType,
        identifier: item.name,
        identifierType: 'name'
      });
    }

    // Zoom to the feature
    zoomToFeature(item);
  }, [getMapInstance, zoomToFeature]);

  // Handle search result selection
  const handleResultSelect = useCallback((item, onFeatureSelect) => {
    selectFeature(item, onFeatureSelect);
    setSearchQuery(''); // Clear search after selection
    setIsSearching(false); // Close search panel
  }, [selectFeature]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    setIsSearching,
    handleResultSelect,
    zoomToFeature
  };
};