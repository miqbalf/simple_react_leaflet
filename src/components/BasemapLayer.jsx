import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import basemapConfig from '../config/basemap'

function BasemapLayer() {
  const map = useMap()
  
  // Get max zoom level from environment variable (default: 19 for basemap)
  const maxZoom = parseInt(import.meta.env.VITE_ZOOM_LVL_MAX || '19', 10)

  useEffect(() => {
    // Remove any existing basemap layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer || layer instanceof L.TileLayer.WMS) {
        map.removeLayer(layer)
      }
    })

    let basemapLayer

    // Check if serverUrl is a full service URL (MapServer or VectorTileServer)
    const isFullMapServerUrl = basemapConfig.serverUrl.includes('/MapServer') && 
      (basemapConfig.serverUrl.endsWith('/MapServer/') || basemapConfig.serverUrl.endsWith('/MapServer'))
    const isFullVectorTileServerUrl = basemapConfig.serverUrl.includes('/VectorTileServer') && 
      (basemapConfig.serverUrl.endsWith('/VectorTileServer/') || basemapConfig.serverUrl.endsWith('/VectorTileServer'))
    
    // Build API key parameter if provided
    const apiKeyParam = basemapConfig.apiKey ? `?token=${basemapConfig.apiKey}` : ''

    if (basemapConfig.type === 'WMS') {
      // For ArcGIS WMS
      let wmsUrl
      if (isFullMapServerUrl || isFullVectorTileServerUrl) {
        wmsUrl = `${basemapConfig.serverUrl.replace(/\/$/, '')}/${basemapConfig.wms.service}${apiKeyParam}`
      } else {
        wmsUrl = `${basemapConfig.serverUrl}/${basemapConfig.layer}/MapServer/${basemapConfig.wms.service}${apiKeyParam}`
      }
      
      basemapLayer = L.tileLayer.wms(wmsUrl, {
        layers: basemapConfig.wms.layers,
        format: basemapConfig.wms.format,
        transparent: basemapConfig.wms.transparent,
        attribution: '',
        maxZoom: maxZoom,
      })
    } else {
      // Default: Use ArcGIS REST API as tile layer (supports both MapServer and VectorTileServer)
      let tileUrl
      
      if (isFullVectorTileServerUrl) {
        // If it's already a full VectorTileServer URL, use it directly
        tileUrl = `${basemapConfig.serverUrl.replace(/\/$/, '')}/tile/{z}/{y}/{x}${apiKeyParam}`
      } else if (isFullMapServerUrl) {
        // If it's already a full MapServer URL, use it directly
        tileUrl = `${basemapConfig.serverUrl.replace(/\/$/, '')}/tile/{z}/{y}/{x}${apiKeyParam}`
      } else {
        // If it's a base server URL, check if we should use VectorTileServer or MapServer
        // Default to MapServer unless explicitly configured
        const serviceType = basemapConfig.serviceType || 'MapServer'
        tileUrl = `${basemapConfig.serverUrl}/${basemapConfig.layer}/${serviceType}/tile/{z}/{y}/{x}${apiKeyParam}`
      }
      
      basemapLayer = L.tileLayer(tileUrl, {
        attribution: '',
        maxZoom: maxZoom,
      })
    }

    if (basemapLayer) {
      basemapLayer.addTo(map)
    }

    return () => {
      if (basemapLayer) {
        map.removeLayer(basemapLayer)
      }
    }
  }, [map, maxZoom])

  return null
}

export default BasemapLayer

