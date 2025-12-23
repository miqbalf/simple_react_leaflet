// Layer configuration for MapServer tile layers
// These URLs should point to ArcGIS MapServer endpoints (tile service)

// Define layer metadata
const layerDefinitions = {
  VITE_KBA_PA_SERVER_URL: {
    key: 'kbaPa',
    label: 'KBAs with incomplete protected area coverage',
    color: '#005CAF', // Blue
    envVar: 'VITE_KBA_PA_SERVER_URL'
  },
  VITE_PA_SERVER_URL: {
    key: 'pa',
    label: 'Protected Area (PA)',
    color: '#8CC970', // Green
    envVar: 'VITE_PA_SERVER_URL'
  },
  VITE_KBA_SERVER_URL: {
    key: 'kba',
    label: 'Key Biodiversity Area (KBA)',
    color: '#FFA000', // Orange
    envVar: 'VITE_KBA_SERVER_URL'
  }
}

// Parse ALL_LAYERS from .env (comma-separated or array format)
// Example: ALL_LAYERS=['VITE_KBA_PA_SERVER_URL', 'VITE_PA_SERVER_URL', 'VITE_KBA_SERVER_URL']
// Or: ALL_LAYERS=VITE_KBA_PA_SERVER_URL,VITE_PA_SERVER_URL,VITE_KBA_SERVER_URL
function parseEnvArray(envValue, defaultValue) {
  if (!envValue) return defaultValue
  
  // Handle string format
  if (typeof envValue === 'string') {
    const trimmed = envValue.trim()
    
    // Try to parse as JSON array first (with double quotes)
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch (e) {
      // Not valid JSON, continue
    }
    
    // Try to parse array with or without quotes
    // Match: ['item1', 'item2'] or [item1, item2] or ["item1", "item2"]
    const arrayMatch = trimmed.match(/\[(.*?)\]/)
    if (arrayMatch) {
      const content = arrayMatch[1].trim()
      
      // First try to extract quoted strings (handles both single and double quotes)
      const quotedItems = content.match(/(['"])(?:(?=(\\?))\2.)*?\1/g)
      if (quotedItems && quotedItems.length > 0) {
        return quotedItems.map(item => {
          // Remove quotes from both ends
          return item.replace(/^['"]|['"]$/g, '').trim()
        }).filter(Boolean)
      }
      
      // If no quoted items found, split by comma (for unquoted items like [VITE_KBA_PA_SERVER_URL, VITE_PA_SERVER_URL])
      if (content.includes(',')) {
        return content.split(',').map(item => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
      }
      
      // Single item in array (no comma)
      if (content.trim()) {
        return [content.trim().replace(/^['"]|['"]$/g, '')]
      }
    }
    
    // Try comma-separated string (no brackets)
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(item => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    }
    
    // Single value
    const cleaned = trimmed.replace(/^['"]|['"]$/g, '').trim()
    return cleaned ? [cleaned] : defaultValue
  }
  
  return defaultValue
}

// Get ALL_LAYERS from .env or use default order
// IMPORTANT: In Vite, environment variables must have VITE_ prefix to be accessible in client code
// Use: VITE_ALL_LAYERS=[VITE_KBA_PA_SERVER_URL, VITE_PA_SERVER_URL, VITE_KBA_SERVER_URL]
// Format supports: [item1, item2] or ['item1', 'item2'] or item1,item2
const allLayersEnv = import.meta.env.VITE_ALL_LAYERS || import.meta.env.ALL_LAYERS
const defaultLayerOrder = ['VITE_KBA_PA_SERVER_URL', 'VITE_PA_SERVER_URL', 'VITE_KBA_SERVER_URL']
const layerOrder = parseEnvArray(allLayersEnv, defaultLayerOrder)

// Get HIDE_LAYERS from .env
// IMPORTANT: In Vite, use VITE_HIDE_LAYERS (with VITE_ prefix) for client-side access
// Format: VITE_HIDE_LAYERS=[VITE_PA_SERVER_URL] or VITE_HIDE_LAYERS=['VITE_PA_SERVER_URL'] or VITE_HIDE_LAYERS=VITE_PA_SERVER_URL
// Note: ALL_LAYERS and HIDE_LAYERS without VITE_ prefix won't work in Vite client code
const hideLayersEnv = import.meta.env.VITE_HIDE_LAYERS || import.meta.env.HIDE_LAYERS
const hideLayers = parseEnvArray(hideLayersEnv, [])

// Build ordered layer configuration
// Map first to preserve original order index, then filter
const allLayersWithMetadata = layerOrder
  .map((layerKey, originalIndex) => {
    const definition = layerDefinitions[layerKey]
    if (!definition) {
      console.warn(`Unknown layer key: ${layerKey}`)
      return null
    }
    
    const envVar = definition.envVar
    const serverUrl = import.meta.env[envVar] || ''
    const isHidden = hideLayers.includes(layerKey)
    
    return {
      ...definition,
      serverUrl,
      apiKey: import.meta.env.VITE_ARCGIS_API_KEY || '',
      originalOrder: originalIndex, // Preserve original order from ALL_LAYERS (0 = first, should be on top)
      hidden: isHidden
    }
  })
  .filter(Boolean) // Remove null entries

// Filter out hidden layers - this is what gets exported and used
const orderedLayers = allLayersWithMetadata.filter(layer => !layer.hidden)

// Create layer config object for backward compatibility
const layerConfig = {}
orderedLayers.forEach(layer => {
  layerConfig[layer.key] = {
    serverUrl: layer.serverUrl,
    apiKey: layer.apiKey,
  }
})

// Export ordered layers configuration
export const orderedLayerConfig = orderedLayers

// Export individual layer configs for backward compatibility
export default layerConfig
