import React from 'react'
import { orderedLayerConfig } from '../config/layers'
import './Legend.css'

function Legend({ layers, onToggleLayer }) {
  // Filter out hidden layers and layers without server URLs
  const visibleLayers = orderedLayerConfig.filter(
    layer => !layer.hidden && layer.serverUrl
  )

  return (
    <div className="legend-container">
      {visibleLayers.map((layerConfig) => (
        <div key={layerConfig.key} className="legend-item-wrapper">
          <div className="legend-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={layers[layerConfig.key] !== false}
                onChange={() => onToggleLayer(layerConfig.key)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <div className="legend-item-content">
                <span className="legend-text">{layerConfig.label}</span>
                <div 
                  className="color-box" 
                  style={{ backgroundColor: layerConfig.color }}
                ></div>
              </div>
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Legend
