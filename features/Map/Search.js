import styles from './search.module.css';

function Search({onChangeDistance, distance}) {
  console.log(distance);
  console.log(onChangeDistance);
  return (
    <div className={styles.searchContainer}>
      <input
        type="search"
        placeholder="Cari Rumah sakit Rujukan"
        className={styles.searchInput}
      />
      <div className={styles.divider}></div>
      <input
        type="number"
        placeholder="Radius(km)"
        className={styles.radiusInput}
        value={distance}
        onChange={onChangeDistance}
      />
      <button type="button" className={styles.searchButton}>
        Search
      </button>
    </div>
  );
}

export default Search;
