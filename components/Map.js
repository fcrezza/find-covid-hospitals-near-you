import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/assets/marker-icon-2x.png',
  iconUrl: '/assets/marker-icon.png',
  shadowUrl: '/assets/marker-shadow.png'
});

const position = [-6.2, 106.816666];

function Map({data}) {
  return (
    <MapContainer
      style={{width: '100vw', height: '100vh'}}
      center={position}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data.map((hospital, idx) => {
        if (hospital.isHospital) {
          return (
            <Marker key={idx} position={Object.values(hospital.geolocation)}>
              <Popup>
                <h3>{hospital.name}</h3>
              </Popup>
            </Marker>
          );
        }

        return null;
      })}
    </MapContainer>
  );
}

export default Map;
