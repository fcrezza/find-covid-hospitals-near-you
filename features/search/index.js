import {BiCurrentLocation} from 'react-icons/bi';

import styles from './search.module.css';

function Search({onChangeDistance, distance, getCurrentPosition}) {
  return (
    <div className={styles.searchContainer}>
      <label htmlFor="radius" className={styles.information}>
        Km
      </label>
      <input
        id="radius"
        type="number"
        min="0"
        placeholder="Radius (Km)"
        className={styles.radiusInput}
        value={distance}
        onChange={onChangeDistance}
      />
      <div className={styles.divider}></div>
      <button
        type="button"
        className={styles.searchButton}
        onClick={getCurrentPosition}
      >
        <BiCurrentLocation className={styles.buttonIcon} />
      </button>
    </div>
  );
}

export default Search;
