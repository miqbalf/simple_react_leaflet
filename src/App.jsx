import React, { useState } from 'react'
import MapComponent from './components/MapComponent'
import Legend from './components/Legend'
import './App.css'

import { orderedLayerConfig } from './config/layers'

function App() {
  // Initialize layer visibility state from ordered config
  // All layers default to visible unless hidden in .env
  const initialLayers = {}
  orderedLayerConfig.forEach(layer => {
    if (!layer.hidden) {
      initialLayers[layer.key] = true
    }
  })
  
  const [layers, setLayers] = useState(initialLayers)

  const toggleLayer = (layerName) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }))
  }

  return (
    <div className="app">
      <MapComponent layers={layers} />
      <Legend layers={layers} onToggleLayer={toggleLayer} />
    </div>
  )
}

export default App

