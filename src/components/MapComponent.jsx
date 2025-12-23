import React, { useState, useEffect } from 'react'
import { MapContainer, ZoomControl, useMapEvents } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import MapNavigation from './MapNavigation'
import BasemapLayer from './BasemapLayer'
import { orderedLayerConfig } from '../config/layers'
import { getRandomContinentCentroid } from '../utils/continentCentroids'
import './MapComponent.css'

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Component to add MapServer as tile layer (same as basemap)
// zIndex ensures layers are rendered in the correct order (higher zIndex = on top)
function MapServerLayer({ serverUrl, apiKey, visible, zIndex, maxZoom }) {
  const map = useMap()

  useEffect(() => {
    if (!serverUrl || !visible) {
      // Remove layer if not visible
      map.eachLayer((layer) => {
        if (layer._url && layer._url.includes(serverUrl)) {
          map.removeLayer(layer)
        }
      })
      return
    }

    // Clean up the server URL
    let baseUrl = serverUrl.trim()
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1)
    }

    // Build tile layer options
    let tileOptions = {
      attribution: '',
      maxZoom: maxZoom || 19, // Use configured maxZoom or default to 19
      zIndex: zIndex || 100, // Default zIndex, higher = on top
    }
    
    // Check if this is the protected_area_new_tile_rev service (EPSG:4326)
    // This service may need special handling for projection
    const isProtectedAreaService = baseUrl.includes('protected_area_new_tile_rev')
    
    let tileUrl
    if (isProtectedAreaService) {
      // For EPSG:4326 services, try requesting tiles with Web Mercator output
      // ArcGIS should handle the projection conversion server-side
      const apiKeyParam = apiKey ? `&token=${apiKey}` : ''
      tileUrl = `${baseUrl}/tile/{z}/{y}/{x}?f=image&format=png&transparent=true${apiKeyParam}`
    } else {
      // Standard ArcGIS REST tile format (same as BasemapLayer)
      tileUrl = `${baseUrl}/tile/{z}/{y}/{x}${apiKey ? `?token=${apiKey}` : ''}`
    }
    
    const layer = L.tileLayer(tileUrl, tileOptions)

    layer.addTo(map)

    return () => {
      if (layer) {
        map.removeLayer(layer)
      }
    }
      }, [map, serverUrl, apiKey, visible, zIndex, maxZoom])

  return null
}

// Component to enforce zoom limits - runs when map is ready
function ZoomLimiter({ minZoom, maxZoom }) {
  const map = useMap()

  useEffect(() => {
    // Set limits on the map instance immediately
    map.setMinZoom(minZoom)
    map.setMaxZoom(maxZoom)
    
    // Override zoom methods to enforce limits
    const originalZoomIn = map.zoomIn.bind(map)
    const originalZoomOut = map.zoomOut.bind(map)
    const originalSetZoom = map.setZoom.bind(map)
    
    map.zoomIn = function(zoom, options) {
      const currentZoom = this.getZoom()
      if (currentZoom >= maxZoom) return this
      const targetZoom = zoom ? currentZoom + zoom : currentZoom + 1
      return originalSetZoom(Math.min(maxZoom, targetZoom), options)
    }
    
    map.zoomOut = function(zoom, options) {
      const currentZoom = this.getZoom()
      if (currentZoom <= minZoom) return this
      const targetZoom = zoom ? currentZoom - zoom : currentZoom - 1
      return originalSetZoom(Math.max(minZoom, targetZoom), options)
    }
    
    map.setZoom = function(zoom, options) {
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom))
      return originalSetZoom(clampedZoom, options)
    }
    
    // Handle mouse wheel zoom manually
    const handleWheel = (e) => {
      const currentZoom = map.getZoom()
      // Handle both Leaflet events (with originalEvent) and native events
      const delta = e.originalEvent ? e.originalEvent.deltaY : e.deltaY
      const event = e.originalEvent || e
      
      if (delta < 0 && currentZoom < maxZoom) {
        // Scroll up = zoom in
        map.setZoom(Math.min(maxZoom, currentZoom + 1))
        event.preventDefault()
      } else if (delta > 0 && currentZoom > minZoom) {
        // Scroll down = zoom out
        map.setZoom(Math.max(minZoom, currentZoom - 1))
        event.preventDefault()
      } else {
        event.preventDefault()
      }
    }
    
    // Enable wheel zoom but handle it manually
    map.scrollWheelZoom.enable()
    map.getContainer().addEventListener('wheel', handleWheel, { passive: false })
    
    // Enforce current zoom if it's outside limits
    const currentZoom = map.getZoom()
    if (currentZoom > maxZoom) {
      map.setZoom(maxZoom, { animate: false })
    } else if (currentZoom < minZoom) {
      map.setZoom(minZoom, { animate: false })
    }

    // Intercept zoom events as backup
    const handleZoom = () => {
      const currentZoom = map.getZoom()
      if (currentZoom > maxZoom) {
        map.setZoom(maxZoom, { animate: false })
      } else if (currentZoom < minZoom) {
        map.setZoom(minZoom, { animate: false })
      }
    }

    map.on('zoom', handleZoom)
    map.on('zoomend', handleZoom)

    return () => {
      map.off('zoom', handleZoom)
      map.off('zoomend', handleZoom)
      map.getContainer().removeEventListener('wheel', handleWheel)
    }
  }, [map, minZoom, maxZoom])

  return null
}

function HoverHandler({ onHover }) {
  useMapEvents({
    mouseover: (e) => {
      // Map hover handling if needed
    },
  })
  return null
}

function MapComponent({ layers }) {
  // Get random continent centroid for initial view (generated once per session)
  const [initialView] = useState(() => getRandomContinentCentroid())
  
  // Get zoom levels from environment variables
  const minZoom = parseInt(import.meta.env.VITE_ZOOM_LVL_MIN || '3', 10)
  const maxZoom = parseInt(import.meta.env.VITE_ZOOM_LVL_MAX || '10', 10)

  return (
    <MapContainer
      center={initialView.center}
      zoom={Math.max(minZoom, Math.min(maxZoom, initialView.zoom))}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
      minZoom={minZoom}
      maxZoom={maxZoom}
      scrollWheelZoom={false}
      doubleClickZoom={true}
    >
      <BasemapLayer />
      <ZoomLimiter minZoom={minZoom} maxZoom={maxZoom} />
      <ZoomControl position="topright" />
      <MapNavigation minZoom={minZoom} maxZoom={maxZoom} />
      <HoverHandler />

      {/* Render layers in order from .env (first index = TOP, maintains order regardless of check/uncheck) */}
      {/* Higher zIndex = appears on top, so first index (originalOrder 0) gets highest zIndex */}
      {orderedLayerConfig.map((layerConfig) => {
        // Skip if no server URL configured
        if (!layerConfig.serverUrl) return null
        
        // Calculate zIndex based on original order from ALL_LAYERS
        // First index (originalOrder 0) = TOP layer (highest zIndex)
        // Get max originalOrder to calculate proper zIndex spacing
        const maxOrder = Math.max(...orderedLayerConfig.map(l => l.originalOrder || 0))
        const zIndex = 100 + ((maxOrder - (layerConfig.originalOrder || 0)) * 100)
        
        return (
          <MapServerLayer
            key={layerConfig.key}
            serverUrl={layerConfig.serverUrl}
            apiKey={layerConfig.apiKey}
            visible={layers[layerConfig.key] !== false} // Default to visible unless explicitly false
            zIndex={zIndex}
            maxZoom={maxZoom}
          />
        )
      })}
    </MapContainer>
  )
}

export default MapComponent

