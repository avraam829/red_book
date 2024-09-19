import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Polygon, Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Stroke, Fill, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import proj4 from 'proj4';
import { datapark } from './data'; 
import belkaIcon from '../images/belka.svg'; 

proj4.defs('EPSG:2000', '+proj=tmerc +lat_0=0 +lon_0=37.6173 +k=1 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs');


const createPolygonFeature = () => {
  const parkCoords = datapark.map(coord => fromLonLat(coord));
  const parkPolygon = new Polygon([parkCoords]);
  const feature = new Feature({
    geometry: parkPolygon,
  });

  feature.setStyle(
    new Style({
      stroke: new Stroke({
        color: 'red',
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.2)',
      }),
    })
  );

  return feature;
};


const createVectorLayer = () => {
  const vectorSource = new VectorSource({
    features: [createPolygonFeature()],
  });

  return new VectorLayer({
    source: vectorSource,
  });
};


const createPointFeature = (lon, lat) => {
  const pointFeature = new Feature({
    geometry: new Point(fromLonLat([lon, lat])),
  });

  pointFeature.setStyle(
    new Style({
      image: new Icon({
        anchor: [0.5, 1], 
        src: belkaIcon, 
        scale: 0.04, 
      }),
    })
  );

  return pointFeature;
};

const createPointLayer = () => {
  const baseLon = 37.412304;
  const baseLat = 55.746659;

  const offsets = [
    [0.0011, 0.0011],
    [0.0011, -0.0011],
    [-0.0011, 0.0011],
    [-0.0011, -0.0011],
    [0.00015, 0.00015],
  ];

  const features = [
    createPointFeature(baseLon, baseLat),
    ...offsets.map(offset => createPointFeature(baseLon + offset[0], baseLat + offset[1])),
  ];

  const vectorSource = new VectorSource({
    features: features,
  });

  return new VectorLayer({
    source: vectorSource,
  });
};

const MapComponent = ({ showKadatrZones, showAnimals }) => {
  const mapRef = useRef(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [pointLayer, setPointLayer] = useState(null);
  const [popupContent, setPopupContent] = useState('');
  const popupRef = useRef(null);
  const [popupVisible, setPopupVisible] = useState(false); // Для управления видимостью popup

  useEffect(() => {
    const center = fromLonLat([37.410791130, 55.743688192]);

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: center,
        zoom: 14,
      }),
    });

    // слой с полигонами
    const layer = createVectorLayer();
    setVectorLayer(layer);
    map.addLayer(layer);

    // слой с точками
    const pointLayer = createPointLayer();
    setPointLayer(pointLayer);
    map.addLayer(pointLayer);

    // Создание popup
    const popup = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10],
    });
    map.addOverlay(popup);

    // Обработчик кликов по карте
    map.on('click', function (evt) {
      let clickedOnPoint = false;
      map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        if (feature.getGeometry().getType() === 'Point') {
          const coordinates = feature.getGeometry().getCoordinates();
          popup.setPosition(coordinates); // Открываем popup
          setPopupContent(`
            <strong>Царство:</strong> Животные<br />
            <strong>Тип: </strong> Хордовые<br />
            <strong>Класс:</strong> Млекопитающие<br />
            <strong>Отряд:</strong> Грызуны<br />
            <strong>Семейство:</strong> Беличьи<br />
            <strong>Род:</strong> Белки<br />
            <strong>Вид:</strong> Обыкновенная белка<br />
            <strong>Питание:</strong> Семена хвойных деревьев, орехи, фрукты и ягоды<br />
            <strong>Живут:</strong> Убежища устраивают в дуплах деревьев, иного селяться в скворечниках<br />
            <strong>Красная книга:</strong> Падающая популяция, не в карсной книге<br />
            <strong>Подробная информация по ссылке</strong>
          `);
          setPopupVisible(true);
          clickedOnPoint = true;
        }
      });

      if (!clickedOnPoint) {
        popup.setPosition(undefined); // Закрываем 
        setPopupVisible(false);
      }
    });

    return () => {
      map.setTarget(null); // Очистка карты
    };
  }, []);

 
  useEffect(() => {
    if (vectorLayer) {
      vectorLayer.setVisible(showKadatrZones);
    }
  }, [showKadatrZones, vectorLayer]);

  
  useEffect(() => {
    if (pointLayer) {
      pointLayer.setVisible(showAnimals);
    }
  }, [showAnimals, pointLayer]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      ></div>
      <div
        ref={popupRef}
        id="popup"
        style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          padding: '15px',
          border: '2px solid #333',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          width: '280px',
          textAlign: 'left',
          display: popupVisible ? 'block' : 'none', 
          position: 'absolute',
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: popupContent }} />
      </div>
    </div>
  );
};

export default MapComponent;
