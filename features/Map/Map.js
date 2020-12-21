import React from 'react';
import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ResultBar from './ResultBar';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/assets/marker-icon-2x.png',
  iconUrl: '/assets/marker-icon.png',
  shadowUrl: '/assets/marker-shadow.png'
});

// this is coordinates of indonesia
const defaultCenter = [-0.789275, 113.921327];

function Map({data, currentPosition, bounds, onChangeDistance, distance}) {
  const mapRef = React.useRef();

  const onMapReady = e => {
    mapRef.current = e.target;
  };

  React.useEffect(() => {
    if (bounds) {
      mapRef.current.fitBounds(bounds);
    }
  }, [bounds]);

  const UserCurrentPosition = currentPosition ? (
    <Marker position={Object.values(currentPosition.geolocation)}>
      <Popup>
        <h3>Posisi saya Sekarang</h3>
        <p>{currentPosition.name}</p>
      </Popup>
    </Marker>
  ) : null;

  const NearestHospitals = data.map((hospital, idx) => {
    if (hospital.isHospital) {
      return (
        <Marker key={idx} position={Object.values(hospital.geolocation)}>
          <Popup>
            <h3>{hospital.name}</h3>
            <p>Provinsi: {hospital.province}</p>
            <p>Alamat: {hospital.address}</p>
            <p>Telepon: {hospital.telephone}</p>
            <p>Fax: {hospital.fax}</p>
          </Popup>
        </Marker>
      );
    }

    return null;
  });

  return (
    <MapContainer
      style={{width: '100vw', height: '100vh'}}
      center={defaultCenter}
      zoom={6}
      whenReady={onMapReady}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ResultBar
        data={data}
        mapRef={mapRef}
        distance={distance}
        onChangeDistance={onChangeDistance}
      />
      {UserCurrentPosition}
      {NearestHospitals}
    </MapContainer>
  );
}

export default Map;
