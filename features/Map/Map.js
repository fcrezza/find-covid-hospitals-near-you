import React from 'react';
import L from 'leaflet';
import classNames from 'classnames';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import ResultBar from '../Result/ResultBar';
import PopupContent from './PopupContent';
import styles from './map.module.css';

const userIcon = L.icon({
  iconUrl: '/assets/user.png',
  iconRetinaUrl: '/assets/user-retina.png',
  shadowUrl: '/assets/marker-shadow.png'
});

const hospitalIcon = L.icon({
  iconUrl: '/assets/hospital.png',
  iconRetinaUrl: '/assets/hospital-retina.png',
  shadowUrl: '/assets/marker-shadow.png'
});
// this is coordinates of indonesia
const defaultCenter = [-0.789275, 113.921327];

function Map(props) {
  const mapRef = React.useRef();
  const markersRef = React.useRef({});
  const {
    nearestHospitals,
    currentPosition,
    getCurrentPosition,
    onChangeDistance,
    distance,
    isLoading
  } = props;

  const coordinateCollection = nearestHospitals?.map(hospital =>
    Object.values(hospital.geolocation)
  );

  const bounds = currentPosition &&
    coordinateCollection && [
      Object.values(currentPosition.geolocation),
      ...coordinateCollection
    ];

  const onMapReady = e => {
    mapRef.current = e.target;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);
    L.control
      .attribution({
        position: 'bottomleft'
      })
      .addTo(mapRef.current);
  };

  React.useEffect(() => {
    if (bounds) {
      // true as second parameter to disable animation when setView
      mapRef.current.fitBounds(bounds, true);
    }
  }, [bounds]);

  const UserCurrentPosition = currentPosition ? (
    <Marker
      icon={userIcon}
      position={Object.values(currentPosition.geolocation)}
    >
      <Popup>
        <PopupContent name="Lokasi anda" address={currentPosition.name} />
      </Popup>
    </Marker>
  ) : null;

  const NearestHospitals = nearestHospitals?.map((hospital, idx) => (
    <Marker
      icon={hospitalIcon}
      ref={e => (markersRef.current[hospital.name] = e)}
      key={idx}
      position={Object.values(hospital.geolocation)}
    >
      <Popup>
        <PopupContent
          distance={hospital.distance}
          name={hospital.name}
          address={hospital.address}
        />
      </Popup>
    </Marker>
  ));

  return (
    <>
      <div
        className={classNames({
          [styles.overlayLoading]: !!isLoading,
          [styles.overlayLoadingHidden]: !isLoading
        })}
      >
        <div
          className={classNames({
            [styles.loadingContent]: !!isLoading,
            [styles.loadingContentHidden]: !isLoading
          })}
        >
          Mendapatkan lokasi anda dan rumah sakit terdekat...
        </div>
      </div>
      <MapContainer
        attributionControl={false}
        style={{width: '100vw', height: '100vh'}}
        center={defaultCenter}
        zoom={6}
        whenReady={onMapReady}
      >
        {currentPosition && (
          <ResultBar
            nearestHospitals={nearestHospitals}
            getCurrentPosition={getCurrentPosition}
            markersRef={markersRef}
            distance={distance}
            onChangeDistance={onChangeDistance}
            NearestHospitals={NearestHospitals}
          />
        )}
        {UserCurrentPosition}
        {NearestHospitals}
      </MapContainer>
    </>
  );
}

export default Map;
