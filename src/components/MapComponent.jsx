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
  const selectedFeatureRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  // NEW: Track selection for vector tiles
  const [selectedTileFeature, setSelectedTileFeature] = useState({
    id: null,
    layer: null
  });

  useImperativeHandle(ref, () => ({
    getMap: () => {
      return mapInstanceRef.current;
    }
  }), []);

  useEffect(() => {
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

    const TILE_ENDPOINT = `${import.meta.env.VITE_APP_SUPABASE_URL}/functions/v1/map-tiles`;

    // Styles
    const districtDefaultStyle = new Style({
      stroke: new Stroke({
        color: '#3388ff',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(51, 136, 255, 0.1)'
      })
    });

    const districtSelectedStyle = new Style({
      stroke: new Stroke({
        color: '#ff6b35',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(255, 107, 53, 0.3)'
      })
    });

    const subcountyDefaultStyle = new Style({
      stroke: new Stroke({
        color: '#10b981',
        width: 1.5
      }),
      fill: new Fill({
        color: 'rgba(16, 185, 129, 0.1)'
      })
    });

    const subcountySelectedStyle = new Style({
      stroke: new Stroke({
        color: '#f59e0b',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(245, 158, 11, 0.3)'
      })
    });

    // DISTRICTS - Still from ArcGIS (VectorLayer)
    const districtSource = new VectorSource({
      url: 'https://services2.arcgis.com/iq8zYa0SRsvIFFKz/arcgis/rest/services/UGA_District_Boundaries_2024/FeatureServer/0/query?f=json&where=1=1&outFields=*&outSR=3857',
      format: new EsriJSON()
    });

    const districtLayer = new VectorLayer({
      title: 'Districts',
      source: districtSource,
      style: (feature) => {
        if (feature.get('selected')) {
          return districtSelectedStyle;
        }
        return districtDefaultStyle;
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
          layerName: 'subcounties'
        }),
        // Use your edge function URL
        url: `${TILE_ENDPOINT}/subcounties/{z}/{x}/{y}`
      }),

      style: (feature) => {
        const featureId = feature.getId() || feature.get('id');

        if (selectedTileFeature.id === featureId &&
          selectedTileFeature.layer === 'subcounties') {
          return subcountySelectedStyle;
        }
        return subcountyDefaultStyle;
      }
    });
    
     
    const overlayGroup = new LayerGroup({
      title: 'Administrative Boundaries',
      layers: [districtLayer, subcountyLayer]
    });

    const map = new Map({
      target: mapContainerRef.current,
      layers: [baseLayer, overlayGroup ],
      view: new View({
        center: [3607372, 145021],
        zoom: 8
      })
    });

    mapInstanceRef.current = map;

    const layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: 'children'
    });

    map.addControl(layerSwitcher);

    // Position layer switcher
    setTimeout(() => {
      const layerSwitcherElement = document.querySelector('.layer-switcher');
      if (layerSwitcherElement) {
        const isMobile = window.innerWidth < 640;
        layerSwitcherElement.style.top = isMobile ? '5rem' : '6rem';
        layerSwitcherElement.style.right = 'auto';
        layerSwitcherElement.style.left = '0.5rem';
      }
    }, 100);

    // Fit to districts when loaded
    districtSource.once('featuresloadend', function () {
      const extent = districtSource.getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000
      });
    });

    // UPDATED Click Handler - Handles both vector layers and vector tiles
    map.on('click', function (event) {
      let clickedFeature = null;
      let clickedLayer = null;
      let isVectorTile = false;

      // Check what was clicked
      map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        // Skip campaign features
        if (feature.get('type') === 'campaign-stop' ||
          feature.get('type') === 'campaign-route-line') {
          return;
        }

        if (!clickedFeature) {
          clickedFeature = feature;
          clickedLayer = layer;
          // Check if it's a vector tile layer
          isVectorTile = layer instanceof VectorTileLayer;
        }
      });

      // Handle deselection
      // Clear regular vector layer selection
      if (selectedFeatureRef.current && !isVectorTile) {
        selectedFeatureRef.current.feature.set('selected', false);
        selectedFeatureRef.current.layer.changed();
        selectedFeatureRef.current = null;
      }

      // Clear vector tile selection
      if (selectedTileFeature.id !== null && isVectorTile) {
        setSelectedTileFeature({ id: null, layer: null });
        // Refresh all vector tile layers
        map.getLayers().getArray().forEach(layer => {
          if (layer instanceof LayerGroup) {
            layer.getLayers().getArray().forEach(subLayer => {
              if (subLayer instanceof VectorTileLayer) {
                subLayer.changed();
              }
            });
          }
        });
      }

      if (clickedFeature && clickedLayer) {
        const properties = clickedFeature.getProperties();
        const layerName = clickedLayer.get('name');

        if (isVectorTile) {
          // Handle vector tile selection
          const featureId = clickedFeature.getId() || properties.id;

          // Update selection state for vector tiles
          setSelectedTileFeature({
            id: featureId,
            layer: layerName
          });

          // Force redraw of the vector tile layer
          clickedLayer.changed();

          // Extract identifier from properties
          let identifier = properties.name || properties.subcounty_name || properties.NAME;

          onFeatureSelect({
            properties,
            layerType: layerName,
            identifier: identifier,
            identifierType: 'name'
          });

        } else {
          // Handle regular vector layer selection (districts)
          clickedFeature.set('selected', true);

          selectedFeatureRef.current = {
            feature: clickedFeature,
            layer: clickedLayer
          };

          let identifier = null;
          if (layerName === 'districts') {
            identifier = properties.NAME;
          }

          onFeatureSelect({
            properties,
            layerType: layerName,
            identifier: identifier,
            identifierType: 'name'
          });

          clickedLayer.changed();
        }
      } else {
        // Nothing clicked - clear all selections
        selectedFeatureRef.current = null;
        setSelectedTileFeature({ id: null, layer: null });
        onFeatureSelect(null);

        // Refresh all layers
        map.getLayers().getArray().forEach(layer => {
          if (layer instanceof LayerGroup) {
            layer.getLayers().getArray().forEach(subLayer => {
              subLayer.changed();
            });
          }
        });
      }
    });

    setMapInstance(map);

    return () => {
      map.setTarget(null);
    };
  }, []); // Remove onFeatureSelect from dependencies

  // Update when selection state changes
  useEffect(() => {
    if (mapInstance) {
      // Force redraw of vector tile layers when selection changes
      mapInstance.getLayers().getArray().forEach(layer => {
        if (layer instanceof LayerGroup) {
          layer.getLayers().getArray().forEach(subLayer => {
            if (subLayer instanceof VectorTileLayer) {
              subLayer.changed();
            }
          });
        }
      });
    }
  }, [selectedTileFeature, mapInstance]);

  const handleCampaignStopClick = (stopInfo) => {
    // Clear any existing selections
    if (selectedFeatureRef.current) {
      selectedFeatureRef.current.feature.set('selected', false);
      selectedFeatureRef.current.layer.changed();
      selectedFeatureRef.current = null;
    }
    setSelectedTileFeature({ id: null, layer: null });

    onFeatureSelect({
      layerType: 'campaign-stop',
      ...stopInfo
    });
  };

  return (
    <>
      <div ref={mapContainerRef} id="map" className="w-full h-full rounded-lg shadow-lg"></div>
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
