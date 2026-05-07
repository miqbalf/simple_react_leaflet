// Continent centroids for random initial map view
// Format: [latitude, longitude]
const continentCentroids = {
  asiaPacific: {
    name: 'Asia Pacific',
    center: [20.0, 120.0], // Centroid of Asia-Pacific region
    zoom: 3
  },
  africa: {
    name: 'Africa',
    center: [0.0, 20.0], // Centroid of Africa
    zoom: 3
  },
  europe: {
    name: 'Europe',
    center: [54.0, 15.0], // Centroid of Europe
    zoom: 3
  },
  northAmerica: {
    name: 'North America',
    center: [45.0, -100.0], // Centroid of North America
    zoom: 3
  },
  southAmerica: {
    name: 'South America',
    center: [-15.0, -60.0], // Centroid of South America
    zoom: 3
  }
}

/**
 * Get a random continent centroid for initial map view
 * @returns {Object} Object with center [lat, lng] and zoom level
 */
export function getRandomContinentCentroid() {
  const continents = Object.values(continentCentroids)
  const randomIndex = Math.floor(Math.random() * continents.length)
  return continents[randomIndex]
}

export default continentCentroids

