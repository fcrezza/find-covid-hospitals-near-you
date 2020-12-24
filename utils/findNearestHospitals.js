import {getDistance, convertDistance} from 'geolib';

async function findNearestHospitals(userCoordinates, distance) {
  const hospitals = await fetchHospitals();
  return hospitals.filter(hospital => {
    if (hospital.isHospital) {
      if (hospital.geolocation) {
        const distanceFromCurrentLocation = convertDistance(
          getDistance(userCoordinates, hospital.geolocation, 0.01),
          'km'
        );
        if (distanceFromCurrentLocation <= distance) {
          hospital.distance = distanceFromCurrentLocation;
          return true;
        }
      }
    }
  });
}

async function fetchHospitals() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const res = await fetch(
      'https://raw.githubusercontent.com/fcrezza/find-covid-hospitals-near-you/main/utils/saved-hospitals.json'
    );
    const json = await res.json();
    return json;
  }

  const hospitals = (await import('./saved-hospitals.json')).default;
  console.log(hospitals);
  return hospitals;
}

export default findNearestHospitals;
