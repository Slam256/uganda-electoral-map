/**
 * Map Operations Service
 * Handles all map-related operations and interactions
 */

/**
 * Zoom to a specific feature on the map
 * @param {Object} map - OpenLayers map instance
 * @param {Object} selection - Selected feature information
 */
export const zoomToFeature = (map, selection) => {
  if (!map || !selection) return;

  let featureFound = false;

  // Iterate through all layers
  map.getLayers().forEach(layer => {
    if (featureFound) return;

    if (layer.getLayers) {
      // It's a layer group
      layer.getLayers().forEach(subLayer => {
        if (featureFound) return;

        if (subLayer.get('name') === selection.layerType) {
          const source = subLayer.getSource();
          if (source) {
            const features = source.getFeatures();
            const targetFeature = findFeatureByIdentifier(features, selection.identifier);

            if (targetFeature) {
              selectFeature(features, targetFeature, subLayer);
              animateToFeature(map, targetFeature);
              featureFound = true;
            }
          }
        }
      });
    }
  });

  return featureFound;
};

/**
 * Find a feature by its identifier
 * @param {Array} features - Array of OpenLayers features
 * @param {string} identifier - Feature identifier to match
 */
const findFeatureByIdentifier = (features, identifier) => {
  return features.find(f => {
    const props = f.getProperties();
    // Check various property names that might contain the identifier
    return props.NAME === identifier ||
           props.name === identifier ||
           props.SUBCOUNTY === identifier ||
           props.Subcounty === identifier ||
           props.DName2019 === identifier;
  });
};

/**
 * Select a feature and deselect others
 * @param {Array} features - All features in the layer
 * @param {Object} targetFeature - Feature to select
 * @param {Object} layer - OpenLayers layer
 */
const selectFeature = (features, targetFeature, layer) => {
  // Clear previous selections
  features.forEach(f => f.set('selected', false));
  
  // Select the target feature
  targetFeature.set('selected', true);
  
  // Trigger layer update
  layer.changed();
};

/**
 * Animate map view to focus on a feature
 * @param {Object} map - OpenLayers map instance
 * @param {Object} feature - Feature to zoom to
 */
const animateToFeature = (map, feature) => {
  const geometry = feature.getGeometry();
  if (geometry) {
    const extent = geometry.getExtent();
    map.getView().fit(extent, {
      duration: 1000,
      padding: [100, 100, 100, 400] // top, right, bottom, left padding
    });
  }
};

/**
 * Clear all feature selections on the map
 * @param {Object} map - OpenLayers map instance
 */
export const clearAllSelections = (map) => {
  if (!map) return;

  map.getLayers().forEach(layer => {
    if (layer.getLayers) {
      layer.getLayers().forEach(subLayer => {
        const source = subLayer.getSource();
        if (source) {
          const features = source.getFeatures();
          features.forEach(f => f.set('selected', false));
          subLayer.changed();
        }
      });
    }
  });
};

/**
 * Get map instance from ref
 * @param {Object} mapRef - React ref containing map component
 */
export const getMapInstance = (mapRef) => {
  if (mapRef?.current?.getMap) {
    return mapRef.current.getMap();
  }
  return null;
};

/**
 * Handle feature selection with map zoom
 * @param {Object} mapRef - React ref containing map component
 * @param {Object} selection - Selected feature information
 * @param {Function} setSelectedFeature - State setter for selected feature
 */
export const handleFeatureSelection = (mapRef, selection, setSelectedFeature) => {
  // Update the selected feature state
  setSelectedFeature(selection);

  // Get map instance and zoom to feature
  const map = getMapInstance(mapRef);
  if (map && selection) {
    zoomToFeature(map, selection);
  }
};