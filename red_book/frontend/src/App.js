import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
  const [showKadatrZones, setShowKadatrZones] = useState(false);
  const [showAnimals, setShowAnimals] = useState(false); 

  const handleFilterChange = (name, checked) => {
    if (name === 'kadatrZones') {
      setShowKadatrZones(checked);
    } else if (name === 'animals') {
      setShowAnimals(checked); 
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
