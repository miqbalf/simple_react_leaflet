// Basemap configuration
// You can override these values by setting environment variables
// For Vite, use VITE_ prefix

const basemapConfig = {
  // ArcGIS Server URL (can be full MapServer URL or base server URL)
  // Example (full MapServer): 'https://wesrmapportal.unep.org/arcgis/rest/services/Hosted/World_regions_tile/MapServer/'
  // Example (base server): 'https://services.arcgisonline.com/ArcGIS/rest/services'
  serverUrl: import.meta.env.VITE_BASEMAP_SERVER_URL || import.meta.env.VITE_ARCGIS_SERVER_URL || 'https://services.arcgisonline.com/ArcGIS/rest/services',
  
  // ArcGIS API Key (optional, for authenticated services)
  apiKey: import.meta.env.VITE_ARCGIS_API_KEY || '',
  
  // Basemap type: 'REST' (default, uses tile endpoint) or 'WMS'
  // REST is the most common and reliable for ArcGIS servers
  type: import.meta.env.VITE_BASEMAP_TYPE || 'REST',
  
  // Layer name (only used if serverUrl is base server, not full MapServer URL)
  // Examples: 'World_Imagery', 'World_Topo_Map', 'World_Street_Map', 'World_Physical_Map'
  // Or your custom layer name
  layer: import.meta.env.VITE_BASEMAP_LAYER || 'World_Imagery',
  
  // Attribution text
  attribution: import.meta.env.VITE_BASEMAP_ATTRIBUTION || 'Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
  
  // WMS specific settings (only used if type is 'WMS')
  wms: {
    service: import.meta.env.VITE_BASEMAP_SERVICE || 'WMS',
    layers: import.meta.env.VITE_BASEMAP_LAYERS || '0',
    format: 'image/png',
    transparent: true,
  },
}

export default basemapConfig

