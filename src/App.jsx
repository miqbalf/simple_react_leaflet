import React, { useState } from 'react'
import MapComponent from './components/MapComponent'
import Legend from './components/Legend'
import './App.css'

function App() {
  const [layers, setLayers] = useState({
    kba: true, // Partially and Fully Uncovered KBA of PA (blue)
    pa: true,  // Key Biodiversity Area (KBA) (orange)
  })

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

