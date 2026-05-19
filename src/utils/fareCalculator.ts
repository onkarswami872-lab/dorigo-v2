// Haversine Formula to calculate distance between two GPS points in KM
export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

// Mock Fare Calculation Logic
export const calculateFare = (distanceKm: number, vehicleType: string) => {
  let baseFare = 0;
  let perKmRate = 0;

  switch (vehicleType) {
    case 'Economy':
      baseFare = 50;
      perKmRate = 12;
      break;
    case 'SUV':
      baseFare = 100;
      perKmRate = 18;
      break;
    case 'Traveller':
      baseFare = 200;
      perKmRate = 25;
      break;
    case 'Bus':
      baseFare = 500;
      perKmRate = 40;
      break;
    default:
      baseFare = 50;
      perKmRate = 12;
  }

  const distanceFare = distanceKm * perKmRate;
  const subtotal = baseFare + distanceFare;
  const platformFee = 15;
  const gst = subtotal * 0.05; // 5% GST
  const total = subtotal + platformFee + gst;

  return {
    baseFare,
    distanceFare,
    platformFee,
    gst,
    total: Math.round(total),
  };
};
