import {useMap} from 'react-leaflet';
import styles from './resultItem.module.css';

function ResultItem({hospital, markersRef}) {
  const map = useMap();

  const onClickItem = hospital => {
    const currentZoom = map.getZoom();
    const coordinates = Object.values(hospital.geolocation);
    map.setView(coordinates, currentZoom);
    markersRef.current[hospital.name].openPopup();
  };

  return (
    <button className={styles.resultItem} onClick={() => onClickItem(hospital)}>
      <p className={styles.resultDistance}>{hospital.distance.toFixed()} Km</p>
      <h1 className={styles.resultTitle}>{hospital.name}</h1>
      <p className={styles.resultAttribute}>
        <span className={styles.resultAttributeLabel}>Alamat: </span>
        {hospital.address}
      </p>
      <p className={styles.resultAttribute}>
        <span className={styles.resultAttributeLabel}>Telepon: </span>
        {hospital.telephone}
      </p>
      <p className={styles.resultAttribute}>
        <span className={styles.resultAttributeLabel}>Fax: </span>
        {hospital.fax || '-'}
      </p>
    </button>
  );
}

export default ResultItem;
