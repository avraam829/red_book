import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import './App.css'; // создаем стили для общего контейнера

const App = () => {
  const [showKadatrZones, setShowKadatrZones] = useState(false);

  const handleFilterChange = (name, checked) => {
    if (name === 'kadatrZones') {
      setShowKadatrZones(checked);
    }
  };

  return (
    <div className="app-container">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="map">
        <MapComponent showKadatrZones={showKadatrZones} />
      </div>
    </div>
  );
};

export default App;
