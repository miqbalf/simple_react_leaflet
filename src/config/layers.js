// Layer configuration for MapServer tile layers
// These URLs should point to ArcGIS MapServer endpoints (tile service)

const layerConfig = {
  // Partially and Fully Uncovered KBA of PA (blue layer)
  // Example: https://server.com/arcgis/rest/services/Service/MapServer
  kbaPa: {
    serverUrl: import.meta.env.VITE_KBA_PA_SERVER_URL || '',
    apiKey: import.meta.env.VITE_ARCGIS_API_KEY || '',
  },
  
  // Key Biodiversity Area (KBA) (orange layer)
  // Example: https://server.com/arcgis/rest/services/Service/MapServer
  kba: {
    serverUrl: import.meta.env.VITE_KBA_SERVER_URL || '',
    apiKey: import.meta.env.VITE_ARCGIS_API_KEY || '',
  },
}

export default layerConfig

