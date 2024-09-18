import React, { useState } from 'react';
import './Sidebar.css'; // создадим стили для компонента

const Sidebar = () => {
  // Состояния для чекбоксов
  const [filters, setFilters] = useState({
    animals: false,
    plants: false,
    protectedZones: false,
  });

  // Функция для обработки изменений в чекбоксах
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters({
      ...filters,
      [name]: checked,
    });
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
            name="safezone"
            checked={filters.safezone}
            onChange={handleCheckboxChange}
          />
          Кадастровые участки
          </label>
      </div>
    </div>
  );
};

export default Sidebar;
