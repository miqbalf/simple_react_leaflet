import React, { useState, useEffect } from 'react'
import { MapContainer, ZoomControl, useMapEvents } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import MapNavigation from './MapNavigation'
import BasemapLayer from './BasemapLayer'
import layerConfig from '../config/layers'
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
function MapServerLayer({ serverUrl, apiKey, visible }) {
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

    // Build tile URL: {MapServer}/tile/{z}/{y}/{x} (same format as basemap)
    const tileUrl = `${baseUrl}/tile/{z}/{y}/{x}`
    
    // Build API key parameter if provided
    const apiKeyParam = apiKey ? `?token=${apiKey}` : ''
    
    // Create tile layer (same approach as BasemapLayer)
    const layer = L.tileLayer(`${tileUrl}${apiKeyParam}`, {
      attribution: '',
      maxZoom: 19,
    })

    layer.addTo(map)

    return () => {
      if (layer) {
        map.removeLayer(layer)
      }
    }
  }, [map, serverUrl, apiKey, visible])

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

  return (
    <MapContainer
      center={initialView.center}
      zoom={initialView.zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
      minZoom={3}
      maxZoom={10}
    >
      <BasemapLayer />
      <ZoomControl position="topright" />
      <MapNavigation />
      <HoverHandler />

      {/* KBA PA Layer (blue - Partially and Fully Uncovered KBA of PA) */}
      {layerConfig.kbaPa.serverUrl && (
        <MapServerLayer
          serverUrl={layerConfig.kbaPa.serverUrl}
          apiKey={layerConfig.kbaPa.apiKey}
          visible={layers.kba}
        />
      )}

      {/* KBA Layer (orange - Key Biodiversity Area) */}
      {layerConfig.kba.serverUrl && (
        <MapServerLayer
          serverUrl={layerConfig.kba.serverUrl}
          apiKey={layerConfig.kba.apiKey}
          visible={layers.pa}
        />
      )}
    </MapContainer>
  )
}

export default MapComponent

