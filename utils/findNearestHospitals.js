import {getDistance, convertDistance} from 'geolib';
// this import for development only
import hospitals from './saved-hospitals.json';

function findNearestHospitals(userCoordinates, distance) {
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

export default findNearestHospitals;
