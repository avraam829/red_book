import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import './App.css'; // создаем стили для общего контейнера

const App = () => {
  const [showKadatrZones, setShowKadatrZones] = useState(false);
  const [showAnimals, setShowAnimals] = useState(false); // Состояние для слоя с точками (animals)

  const handleFilterChange = (name, checked) => {
    if (name === 'kadatrZones') {
      setShowKadatrZones(checked);
    } else if (name === 'animals') {
      setShowAnimals(checked); // Обработка состояния для animals
    }
  };

  return (
    <div className="app-container">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="map">
        <MapComponent showKadatrZones={showKadatrZones} showAnimals={showAnimals} />
      </div>
    </div>
  );
};

export default App;
