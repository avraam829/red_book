import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    animals: true,
    plants: true,
    protectedZones: true,
    kadatrZones: true,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters({
      ...filters,
      [name]: checked,
    });

  
    if (onFilterChange) {
      onFilterChange(name, checked);
    }
  };

  return (
    <div className="sidebar">
      <h3>Поиск</h3>
      <input type="text" placeholder="Введите запрос..." className="search-input" />
      
      <h4>Фильтры</h4>
      <div className="filters">
        <label>
          <input
            type="checkbox"
            name="animals"
            checked={filters.animals}
            onChange={handleCheckboxChange}
          />
          Животные
        </label>
        <label>
          <input
            type="checkbox"
            name="plants"
            checked={filters.plants}
            onChange={handleCheckboxChange}
          />
          Растения
        </label>
        <label>
          <input
            type="checkbox"
            name="protectedZones"
            checked={filters.protectedZones}
            onChange={handleCheckboxChange}
          />
          Охранные зоны
        </label>
        <label>
          <input
            type="checkbox"
            name="kadatrZones"
            checked={filters.kadatrZones}
            onChange={handleCheckboxChange}
          />
          Кадастровые участки
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
