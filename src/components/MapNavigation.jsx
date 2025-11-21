import React from 'react'
import { useMap } from 'react-leaflet'
import './MapNavigation.css'

function ZoomControls() {
  const map = useMap()

  const zoomIn = () => {
    map.zoomIn()
  }

  const zoomOut = () => {
    map.zoomOut()
  }

  return (
    <div className="map-zoom-controls">
      <button className="zoom-button zoom-in" onClick={zoomIn} aria-label="Zoom in" type="button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V16M8 12H16" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <button className="zoom-button zoom-out" onClick={zoomOut} aria-label="Zoom out" type="button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12H16" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

function MapNavigation() {
  return (
    <div className="map-nav-container">
      <div className="map-nav-content">
        <ZoomControls />
        <div className="map-help-container">
          <div className="map-help-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 9L4 4M4 4V8M4 4H8M15 9L20 4M20 4V8M20 4H16M9 15L4 20M4 20V16M4 20H8M15 15L20 20M20 20V16M20 20H16" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="map-help-text">Zoom in and out to explore different areas on the map</span>
        </div>
      </div>
    </div>
  )
}

export default MapNavigation

