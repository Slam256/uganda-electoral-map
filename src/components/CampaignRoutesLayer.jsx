import { useEffect } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import { fromLonLat } from 'ol/proj';

/**
 * Creates and manages campaign route layers on the OpenLayers map
 * 
 * For each candidate:
 * - Draws points (circles) at each campaign stop
 * - Draws lines connecting stops in chronological order
 * - Styles with candidate's unique color
 */

const CampaignRoutesLayer = ({ map, routes, onStopClick }) => {

  useEffect(() => {
    if (!map || !routes) return;

    const canvas = map.getViewport().querySelector('canvas');
    if (canvas) {
      canvas.getContext('2d', { willReadFrequently: true });
    }

    // Array to store all layers we create
    const layers = [];

    // Create a layer for each candidate
    Object.values(routes).forEach((candidate) => {
      // Skip if candidate is hidden
      if (!candidate.visible || candidate.stops.length === 0) return;

      const features = [];

      // // 1. Create line feature connecting all stops chronologically
      // if (candidate.stops.length > 1) {
      //   const coordinates = candidate.stops.map(stop => 
      //     fromLonLat([stop.lng, stop.lat])
      //   );

      //   const lineFeature = new Feature({
      //     geometry: new LineString(coordinates),
      //     type: 'campaign-route-line',
      //     candidateId: candidate.candidateId,
      //     candidateName: candidate.candidateName
      //   });

      //   features.push(lineFeature);
      // }

      // 2. Create point features for each stop
      candidate.stops.forEach((stop, index) => {
        const coordinate = fromLonLat([stop.lng, stop.lat]);

        const pointFeature = new Feature({
          geometry: new Point(coordinate),
          type: 'campaign-stop',
          candidateId: candidate.candidateId,
          candidateName: candidate.candidateName,
          candidateColor: candidate.color,
          partyName: candidate.partyName,
          partyAbbreviation: candidate.partyAbbreviation,
          stopData: stop,
          stopIndex: index + 1,
          totalStops: candidate.stops.length
        });

        features.push(pointFeature);
      });

      // Create vector source with all features for this candidate
      const vectorSource = new VectorSource({
        features: features
      });

      // Create styled layer
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => createStyle(feature, candidate.color),
        zIndex: 1000,
        properties: {
          name: `campaign-route-${candidate.candidateId}`,
          candidateId: candidate.candidateId
        }
      });

      // Add layer to map
      map.addLayer(vectorLayer);
      layers.push(vectorLayer);
    });

    // Cleanup: remove layers when component unmounts or dependencies change
    return () => {
      layers.forEach(layer => {
        map.removeLayer(layer);
      });
    };

  }, [map, routes]);

  // Add click handler for campaign stops
  useEffect(() => {
    if (!map || !onStopClick) return;

    const handleClick = (event) => {
      let clickedStop = null;
      // Check if user clicked on a campaign stop
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature.get('type') === 'campaign-stop' && !clickedStop) {
          clickedStop = {
            type: 'campaign-stop',
            candidateName: feature.get('candidateName'),
            candidateColor: feature.get('candidateColor'),
            partyName: feature.get('partyName'),
            partyAbbreviation: feature.get('partyAbbreviation'),
            stopData: feature.get('stopData'),
            stopIndex: feature.get('stopIndex'),
            totalStops: feature.get('totalStops')
          };
        }

      });

      if (clickedStop) {
        onStopClick(clickedStop);
      }
    };

    map.on('click', handleClick);

    return () => {
      map.un('click', handleClick);
    };
  }, [map, onStopClick]);

  return null; // This component doesn't render anything itself
};

/**
 * Create style for campaign route features
 */
const createStyle = (feature, color) => {
  const featureType = feature.get('type');

  // if (featureType === 'campaign-route-line') {
  //   // Style for the connecting line seems messy at this time will review
  //   return new Style({
  //     stroke: new Stroke({
  //       color: color,
  //       width: 3,
  //       lineDash: [10, 5] // Dashed line
  //     })
  //   });
  // }

  if (featureType === 'campaign-stop') {
    // Style for campaign stop points
    // const stopIndex = feature.get('stopIndex');

    return new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({
          color: color
        }),
        stroke: new Stroke({
          color: '#ffffff',
          width: 2
        })
      }),
      // Show stop number on hover (optional)
      // text: new Text({
      //   text: stopIndex.toString(),
      //   font: 'bold 10px sans-serif',
      //   fill: new Fill({
      //     color: '#ffffff'
      //   }),
      //   offsetY: 0
      // })
    });
  }

  return null;
}

export default CampaignRoutesLayer;