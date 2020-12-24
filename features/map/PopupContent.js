import styles from './popupcontent.module.css';

function PopupContent({distance, name, address}) {
  return (
    <div>
      {distance ? (
        <p className={styles.distance}>{distance.toFixed()} Km</p>
      ) : null}
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.address}>{address}</p>
    </div>
  );
}

export default PopupContent;
