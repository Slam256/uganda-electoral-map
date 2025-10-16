import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ'; import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import EsriJSON from 'ol/format/EsriJSON';
import LayerGroup from 'ol/layer/Group';
import { Stroke, Style, Fill } from 'ol/style'
import 'ol/ol.css';
import LayerSwitcher from 'ol-layerswitcher';
import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import CampaignRoutesLayer from './CampaignRoutesLayer';

const MapComponent = forwardRef(({ onFeatureSelect, routes }, ref) => {
  const mapContainerRef = useRef(null);
  const selectedFeatureRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

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
            attributions: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions">CARTO</a>'
          })
        })]
    });

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

    const districtSource = new VectorSource({
      url: 'https://services2.arcgis.com/iq8zYa0SRsvIFFKz/arcgis/rest/services/UGA_District_Boundaries_2024/FeatureServer/0/query?f=json&where=1=1&outFields=*&outSR=3857',
      format: new EsriJSON()
    });

    const districtLayer = new VectorLayer({
      title: 'Districts',
      source: districtSource,
      style: (feature) => {
        // Return different style based on selection
        if (feature.get('selected')) {
          return districtSelectedStyle;
        }
        return districtDefaultStyle;
      },
      renderBuffer: 100,
      properties: { name: 'districts' }
    });

    const subcountySource = new VectorSource({
      url: 'https://services8.arcgis.com/2PccUoRMaHmJJ87k/arcgis/rest/services/uganda_subcounty_population_new/FeatureServer/0/query?f=json&where=1=1&outFields=*&outSR=3857',
      format: new EsriJSON()
    });

    const subcountyLayer = new VectorLayer({
      title: 'Subcounties',
      source: subcountySource,
      visible: false,
      style: function (feature) {
        if (feature.get('selected')) {
          return subcountySelectedStyle;
        }
        return subcountyDefaultStyle;
      },
      properties: { name: 'subcounties' }
    });

    const overlayGroup = new LayerGroup({
      title: 'Administrative Boundaries',
      layers: [districtLayer, subcountyLayer]
    });

    const map = new Map({
      target: mapContainerRef.current,
      layers: [baseLayer, overlayGroup],
      view: new View({
        center: [3438000, 100000],
        zoom: 7
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
        // Check if mobile
        const isMobile = window.innerWidth < 640;
        layerSwitcherElement.style.top = isMobile ? '5rem' : '6rem'; // 64px on mobile, 16px on desktop
        layerSwitcherElement.style.right = 'auto';
        layerSwitcherElement.style.left = '0.5rem'; // 12px
      }
    }, 100);

    districtSource.once('featuresloadend', function () {
      const extent = districtSource.getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000
      });
    });

    // Click handler
    map.on('click', function (event) {
      let clickedFeature = null;
      let clickedLayer = null;

      map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        if (feature.get('type') === 'campaign-stop' ||
          feature.get('type') === 'campaign-route-line') {
          return;
        }
        
        if (!clickedFeature) {  // Get the first one only
          clickedFeature = feature;
          clickedLayer = layer;
        }
      });

      // Clear previous selection
      if (selectedFeatureRef.current) {
        selectedFeatureRef.current.feature.set('selected', false);
        selectedFeatureRef.current.layer.changed();
      }

      if (clickedFeature && clickedLayer) {
        // Set new selection
        clickedFeature.set('selected', true);

        selectedFeatureRef.current = {
          feature: clickedFeature,
          layer: clickedLayer
        };

        const properties = clickedFeature.getProperties();
        const layerName = clickedLayer.get('name');
        let identifier = null;
        if (layerName === 'districts') {
          identifier = properties.NAME;
        } else if (layerName === 'subcounties') {
          identifier = properties.Subcounty          
        }

        onFeatureSelect({
          properties,
          layerType: layerName,
          identifier: identifier,
          identifierType: 'name'
        });

        clickedLayer.changed();
      } else {
        selectedFeatureRef.current = null;
        onFeatureSelect(null);
      }
    });

    mapContainerRef.current = map;
    setMapInstance(map);

    return () => {
      map.setTarget(null);
    };
  }, [onFeatureSelect]);

  const handleCampaignStopClick = (stopInfo) => {
    // Pass campaign stop info to parent
    if (selectedFeatureRef.current) {
      selectedFeatureRef.current.feature.set('selected', false);
      selectedFeatureRef.current.layer.changed();
      selectedFeatureRef.current = null;
    }
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
