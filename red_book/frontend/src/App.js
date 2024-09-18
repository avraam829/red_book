import React from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import './App.css'; // создаем стили для общего контейнера
const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="map">
        <MapComponent />
      </div>
    </div>
  );
};

export default App;
