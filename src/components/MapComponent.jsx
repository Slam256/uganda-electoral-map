import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import Feature from 'ol/Feature';
import EsriJSON from 'ol/format/EsriJSON';
import LayerGroup from 'ol/layer/Group';
import { Stroke, Style, Fill } from 'ol/style';
import LayerSwitcher from 'ol-layerswitcher';
import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import CampaignRoutesLayer from './CampaignRoutesLayer';

const MapComponent = forwardRef(({ onFeatureSelect, routes }, ref) => {
  const mapContainerRef = useRef(null);  
  const mapInstanceRef = useRef(null); 
  const selectedFeatureRef = useRef(null); 
  const selectedTileFeatureRef = useRef({
    id: null,
    layerName: null
  });

  const [mapInstance, setMapInstance] = useState(null);

  useImperativeHandle(ref, () => ({
    getMap: () => mapInstanceRef.current
  }), []);

  useEffect(() => {
    // Get tile endpoint from environment
    const TILE_ENDPOINT = `${import.meta.env.VITE_APP_SUPABASE_URL}/functions/v1/map-tiles`;
    const styles = {
      district: {
        default: new Style({
          stroke: new Stroke({ color: '#3388ff', width: 2 }),
          fill: new Fill({ color: 'rgba(51, 136, 255, 0.1)' })
        }),
        selected: new Style({
          stroke: new Stroke({ color: '#ff6b35', width: 3 }),
          fill: new Fill({ color: 'rgba(255, 107, 53, 0.3)' })
        })
      },
      subcounty: {
        default: new Style({
          stroke: new Stroke({ color: '#10b981', width: 1.5 }),
          fill: new Fill({ color: 'rgba(16, 185, 129, 0.1)' })
        }),
        selected: new Style({
          stroke: new Stroke({ color: '#f59e0b', width: 3 }),
          fill: new Fill({ color: 'rgba(245, 158, 11, 0.3)' })
        })
      }
    };
    const baseLayer = new LayerGroup({
      title: 'Base Maps',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
        })
      ]
    });

    const districtSource = new VectorSource({
      url: 'https://services2.arcgis.com/iq8zYa0SRsvIFFKz/arcgis/rest/services/UGA_District_Boundaries_2024/FeatureServer/0/query?f=json&where=1=1&outFields=*&outSR=3857',
      format: new EsriJSON()
    });

    const districtLayer = new VectorLayer({
      title: 'Districts',
      source: districtSource,
      style: (feature) => {
        // Check if this feature is selected
        return feature.get('selected') 
          ? styles.district.selected 
          : styles.district.default;
      },
      renderBuffer: 100,
      properties: { name: 'districts' }
    });

    const subcountyLayer = new VectorTileLayer({
      title: 'Subcounties',
      maxZoom: 22,
      minZoom: 6,
      visible: false,
      properties: { name: 'subcounties' },
      source: new VectorTileSource({
        format: new MVT({
          featureClass: Feature,
          layers: ['subcounties']
        }),
        url: `${TILE_ENDPOINT}/subcounties/{z}/{x}/{y}`
      }),
      style: (feature) => {
        const properties = feature.getProperties();
        const featureId = properties.id;
        
        const isSelected = 
          selectedTileFeatureRef.current.id === featureId &&
          selectedTileFeatureRef.current.layerName === 'subcounties';
        
        return isSelected 
          ? styles.subcounty.selected 
          : styles.subcounty.default;
      },
      renderBuffer: 100
    });

    const overlayGroup = new LayerGroup({
      title: 'Administrative Boundaries',
      layers: [districtLayer, subcountyLayer]
    });
    const map = new Map({
      target: mapContainerRef.current,
      layers: [baseLayer, overlayGroup],
      view: new View({
        center: [3607372, 145021], // Center on Uganda
        zoom: 8
      })
    });

    mapInstanceRef.current = map;

    const layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: 'children'
    });
    map.addControl(layerSwitcher);

    setTimeout(() => {
      const layerSwitcherElement = document.querySelector('.layer-switcher');
      if (layerSwitcherElement) {
        const isMobile = window.innerWidth < 640;
        layerSwitcherElement.style.top = isMobile ? '5rem' : '6rem';
        layerSwitcherElement.style.right = 'auto';
        layerSwitcherElement.style.left = '0.5rem';
      }
    }, 100);

    districtSource.once('featuresloadend', function () {
      const extent = districtSource.getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000
      });
    });

    map.on('click', function(event) {
      let clickedFeature = null;
      let clickedLayer = null;
      let isVectorTile = false;

      map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
        if (feature.get('type') === 'campaign-stop' ||
            feature.get('type') === 'campaign-route-line') {
          return;
        }
        if (!clickedFeature) {
          clickedFeature = feature;
          clickedLayer = layer;
          isVectorTile = layer instanceof VectorTileLayer;
        }
      });

      clearAllSelections();

      if (clickedFeature && clickedLayer) {
        const properties = clickedFeature.getProperties();
        const layerName = clickedLayer.get('name');

        if (isVectorTile) {
          handleVectorTileClick(clickedFeature, properties, layerName);
        } else {
          handleVectorLayerClick(clickedFeature, clickedLayer, properties, layerName);
        }
      } else {
        onFeatureSelect(null);
      }
    });

    setMapInstance(map);

    return () => {
      map.setTarget(null);
    };
  }, [onFeatureSelect]);

  const clearAllSelections = () => {
    // Clear regular vector layer selections
    if (selectedFeatureRef.current) {
      selectedFeatureRef.current.feature.set('selected', false);
      selectedFeatureRef.current.layer.changed();
      selectedFeatureRef.current = null;
    }

    // Clear vector tile selections
    if (selectedTileFeatureRef.current.id !== null) {
      selectedTileFeatureRef.current = { id: null, layerName: null };
      
      // Force redraw of subcounty layer
      if (mapInstanceRef.current) {
        mapInstanceRef.current.getLayers().forEach(layer => {
          if (layer instanceof LayerGroup) {
            layer.getLayers().forEach(subLayer => {
              if (subLayer instanceof VectorTileLayer && 
                  subLayer.get('name') === 'subcounties') {
                subLayer.changed();
              }
            });
          }
        });
      }
    }
  };

  const handleVectorTileClick = (feature, properties, layerName) => {
    const featureId = properties.id;

    // Update the ref (this is what the style function checks!)
    selectedTileFeatureRef.current = {
      id: featureId,
      layerName: layerName
    };

    // Force the layer to redraw with new styles
    if (mapInstanceRef.current) {
      mapInstanceRef.current.getLayers().forEach(layer => {
        if (layer instanceof LayerGroup) {
          layer.getLayers().forEach(subLayer => {
            if (subLayer instanceof VectorTileLayer && 
                subLayer.get('name') === layerName) {
              subLayer.changed();
            }
          });
        }
      });
    }
    const identifier = properties.name || 
                      properties.subcounty_name || 
                      properties.NAME;

    onFeatureSelect({
      properties,
      layerType: layerName,
      identifier: identifier,
      identifierType: 'name'
    });
  };

  const handleVectorLayerClick = (feature, layer, properties, layerName) => {
    // Mark feature as selected
    feature.set('selected', true);

    // Store reference to selected feature
    selectedFeatureRef.current = {
      feature: feature,
      layer: layer
    };

    // Extract identifier
    let identifier = null;
    if (layerName === 'districts') {
      identifier = properties.NAME;
    }

    // Notify parent
    onFeatureSelect({
      properties,
      layerType: layerName,
      identifier: identifier,
      identifierType: 'name'
    });

    // Redraw layer to show selection
    layer.changed();
  };

  const handleCampaignStopClick = (stopInfo) => {
    // Clear all map selections
    clearAllSelections();

    // Notify parent about campaign stop
    onFeatureSelect({
      layerType: 'campaign-stop',
      ...stopInfo
    });
  };
  return (
    <>
      <div 
        ref={mapContainerRef} 
        id="map" 
        className="w-full h-full rounded-lg shadow-lg"
      />
      {mapInstance && (
        <CampaignRoutesLayer
          map={mapInstance}
          routes={routes}
          onStopClick={handleCampaignStopClick}
        />
      )}
    </>
  );
});

MapComponent.displayName = 'MapComponent';
export default MapComponent;