import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import basemapConfig from '../config/basemap'

function BasemapLayer() {
  const map = useMap()

  useEffect(() => {
    // Remove any existing basemap layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer || layer instanceof L.TileLayer.WMS) {
        map.removeLayer(layer)
      }
    })

    let basemapLayer

    // Check if serverUrl is already a full MapServer URL (ends with /MapServer/)
    const isFullMapServerUrl = basemapConfig.serverUrl.endsWith('/MapServer/') || basemapConfig.serverUrl.endsWith('/MapServer')
    
    // Build API key parameter if provided
    const apiKeyParam = basemapConfig.apiKey ? `?token=${basemapConfig.apiKey}` : ''

    if (basemapConfig.type === 'WMS') {
      // For ArcGIS WMS
      let wmsUrl
      if (isFullMapServerUrl) {
        wmsUrl = `${basemapConfig.serverUrl.replace(/\/$/, '')}/${basemapConfig.wms.service}${apiKeyParam}`
      } else {
        wmsUrl = `${basemapConfig.serverUrl}/${basemapConfig.layer}/MapServer/${basemapConfig.wms.service}${apiKeyParam}`
      }
      
      basemapLayer = L.tileLayer.wms(wmsUrl, {
        layers: basemapConfig.wms.layers,
        format: basemapConfig.wms.format,
        transparent: basemapConfig.wms.transparent,
        attribution: '',
        maxZoom: 19,
      })
    } else {
      // Default: Use ArcGIS REST API as tile layer (most common and reliable for ArcGIS)
      let tileUrl
      if (isFullMapServerUrl) {
        // If it's already a full MapServer URL, use it directly
        tileUrl = `${basemapConfig.serverUrl.replace(/\/$/, '')}/tile/{z}/{y}/{x}${apiKeyParam}`
      } else {
        // If it's a base server URL, append layer and MapServer path
        tileUrl = `${basemapConfig.serverUrl}/${basemapConfig.layer}/MapServer/tile/{z}/{y}/{x}${apiKeyParam}`
      }
      
      basemapLayer = L.tileLayer(tileUrl, {
        attribution: '',
        maxZoom: 19,
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
  }, [map])

  return null
}

export default BasemapLayer

