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
import { datapark } from './data'; // Импорт данных
import belkaIcon from '../images/belka.svg'; // Импорт иконки

proj4.defs('EPSG:2000', '+proj=tmerc +lat_0=0 +lon_0=37.6173 +k=1 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs');

// Функция для создания полигона
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

// Функция для создания слоя с полигоном
const createVectorLayer = () => {
  const vectorSource = new VectorSource({
    features: [createPolygonFeature()],
  });

  return new VectorLayer({
    source: vectorSource,
  });
};

// Функция для создания одной точки с иконкой белки
const createPointFeature = (lon, lat) => {
  const pointFeature = new Feature({
    geometry: new Point(fromLonLat([lon, lat])),
  });

  pointFeature.setStyle(
    new Style({
      image: new Icon({
        anchor: [0.5, 1], // Задаем якорь для корректного отображения иконки
        src: belkaIcon, // Путь к SVG-файлу белки
        scale: 0.04, // Масштаб иконки (можно подкорректировать)
      }),
    })
  );

  return pointFeature;
};

// Функция для создания слоя с точками
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

    // Создаем и добавляем слой с полигонами
    const layer = createVectorLayer();
    setVectorLayer(layer);
    map.addLayer(layer);

    // Создаем и добавляем слой с точками
    const pointLayer = createPointLayer();
    setPointLayer(pointLayer);
    map.addLayer(pointLayer);

    // Создание popup-элемента
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
            <strong>Вид:</strong> Белка рыжая<br />
            <strong>Популяция:</strong> 1 млн<br />
            <strong>Корм:</strong> семечки<br />
            <strong>Красная книга:</strong> в Москве мало<br />
            <strong>Подробная информация по ссылке</strong>
          `);
          setPopupVisible(true);
          clickedOnPoint = true;
        }
      });

      if (!clickedOnPoint) {
        popup.setPosition(undefined); // Закрываем popup при клике не на точку
        setPopupVisible(false);
      }
    });

    return () => {
      map.setTarget(null); // Очистка карты при размонтировании компонента
    };
  }, []);

  // Управление видимостью слоя с полигонами
  useEffect(() => {
    if (vectorLayer) {
      vectorLayer.setVisible(showKadatrZones);
    }
  }, [showKadatrZones, vectorLayer]);

  // Управление видимостью слоя с точками
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
          width: '250px',
          textAlign: 'left',
          display: popupVisible ? 'block' : 'none', // Скрываем или показываем popup
          position: 'absolute',
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: popupContent }} />
      </div>
    </div>
  );
};

export default MapComponent;
