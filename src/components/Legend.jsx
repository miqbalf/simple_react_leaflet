import React from 'react'
import './Legend.css'

function Legend({ layers, onToggleLayer }) {
  return (
    <div className="legend-container">
      <div className="legend-item-wrapper">
        <div className="legend-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={layers.kba}
              onChange={() => onToggleLayer('kba')}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            <div className="legend-item-content">
              <span className="legend-text">Partially and Fully Uncovered KBA of PA</span>
              <div className="color-box" style={{ backgroundColor: '#005CAF' }}></div>
            </div>
          </label>
        </div>
      </div>
      <div className="legend-item-wrapper">
        <div className="legend-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={layers.pa}
              onChange={() => onToggleLayer('pa')}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            <div className="legend-item-content">
              <span className="legend-text">Key Biodiversity Area (KBA)</span>
              <div className="color-box" style={{ backgroundColor: '#FFA000' }}></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Legend

