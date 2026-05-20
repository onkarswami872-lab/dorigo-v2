interface RouteInfo {
  distance: number;
  duration: number;
  tollCount: number;
  tollAmount: number;
  hasTolls: boolean;
  routePoints: Array<{ lat: number; lng: number }>;
}

// Mock route data with realistic road coordinates
const MOCK_ROUTES: Record<string, RouteInfo> = {
  'bangalore-mysore': {
    distance: 145, duration: 150, tollCount: 2, tollAmount: 260, hasTolls: true,
    routePoints: [
      { lat: 12.9716, lng: 77.5946 }, { lat: 12.90, lng: 77.52 }, { lat: 12.75, lng: 77.38 },
      { lat: 12.60, lng: 77.20 }, { lat: 12.45, lng: 77.00 }, { lat: 12.3051, lng: 76.6551 }
    ]
  },
  'bangalore-mumbai': {
    distance: 980, duration: 900, tollCount: 8, tollAmount: 1200, hasTolls: true,
    routePoints: [
      { lat: 12.9716, lng: 77.5946 }, { lat: 14.20, lng: 76.50 }, { lat: 15.80, lng: 74.90 },
      { lat: 17.50, lng: 73.90 }, { lat: 19.0760, lng: 72.8777 }
    ]
  },
  'bangalore-chennai': {
    distance: 350, duration: 280, tollCount: 3, tollAmount: 420, hasTolls: true,
    routePoints: [
      { lat: 12.9716, lng: 77.5946 }, { lat: 12.70, lng: 78.50 }, { lat: 12.90, lng: 79.20 },
      { lat: 13.0827, lng: 80.2707 }
    ]
  }
};

export const getRouteWithTolls = async (
  origin: { lat: number; lng: number; name?: string },
  destination: { lat: number; lng: number; name?: string }
): Promise<RouteInfo> => {
  try {
    // ✅ SAFE: Handle undefined names gracefully
    const originName = (origin.name || '').toLowerCase();
    const destName = (destination.name || '').toLowerCase();
    
    let routeKey = '';
    if (originName.includes('bangalore') || originName.includes('bengaluru')) {
      if (destName.includes('mysore')) routeKey = 'bangalore-mysore';
      else if (destName.includes('mumbai')) routeKey = 'bangalore-mumbai';
      else if (destName.includes('chennai')) routeKey = 'bangalore-chennai';
    }
    
    if (routeKey && MOCK_ROUTES[routeKey]) {
      return MOCK_ROUTES[routeKey];
    }
    
    // Fallback: Generate realistic curved path
    const distance = getDistanceFromLatLonInKm(origin.lat, origin.lng, destination.lat, destination.lng);
    const estimatedTolls = Math.max(0, Math.floor(distance / 100));
    const estimatedTollAmount = estimatedTolls * 65;
    
    const points = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const lat = origin.lat + (destination.lat - origin.lat) * (i / steps) + (Math.random() * 0.008 - 0.004);
      const lng = origin.lng + (destination.lng - origin.lng) * (i / steps) + (Math.random() * 0.008 - 0.004);
      points.push({ lat, lng });
    }
    
    return {
      distance,
      duration: Math.round(distance * 1.2),
      tollCount: estimatedTolls,
      tollAmount: estimatedTollAmount,
      hasTolls: estimatedTolls > 0,
      routePoints: points
    };
  } catch (error) {
    console.error('Route API Error:', error);
    const distance = getDistanceFromLatLonInKm(origin.lat, origin.lng, destination.lat, destination.lng);
    return {
      distance,
      duration: Math.round(distance * 1.2),
      tollCount: 0,
      tollAmount: 0,
      hasTolls: false,
      routePoints: []
    };
  }
};

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

export default getRouteWithTolls;
