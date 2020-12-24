import React from 'react';
import classNames from 'classnames';
import {useMap} from 'react-leaflet';

import Search from '../Search';
import styles from './resultBar.module.css';
import ResultItem from './ResultItem';

function ResultBar(props) {
  const [isCollapse, setCollapseState] = React.useState(false);
  const [isOverElement, setIsOverElement] = React.useState(false);
  const map = useMap();
  const {
    nearestHospitals,
    markersRef,
    onChangeDistance,
    distance,
    getCurrentPosition
  } = props;

  const onCollapseButtonClick = () => {
    setCollapseState(prevState => !prevState);
  };

  const onResultBarMouseOver = () => {
    setIsOverElement(true);
  };

  const onResultBarMouseLeave = () => {
    setIsOverElement(false);
  };

  /**
   * this useEffect toggle interactivity of the map
   * disable interation when mouse over resultbar elements
   * enable interaction when mouse leave resultbar elements
   **/
  React.useEffect(() => {
    if (isOverElement) {
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      return;
    }

    map.dragging.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
  }, [isOverElement]);

  return (
    <div
      className={classNames(styles.resultBarContainer, {
        [styles.resultBarCollapse]: isCollapse
      })}
      onMouseOver={onResultBarMouseOver}
      onMouseLeave={onResultBarMouseLeave}
    >
      <button
        className={styles.collapseButton}
        type="button"
        onClick={onCollapseButtonClick}
      >
        {isCollapse ? '◀' : '▶'}
      </button>
      <Search
        distance={distance}
        onChangeDistance={onChangeDistance}
        getCurrentPosition={getCurrentPosition}
      />
      <div className={styles.resultItemContainer}>
        <div className={styles.resultItem}>
          {nearestHospitals?.length ? (
            nearestHospitals.map((hospital, idx) => (
              <ResultItem
                key={idx}
                hospital={hospital}
                markersRef={markersRef}
              />
            ))
          ) : (
            <div className={styles.notFound}>Tidak ditemukan</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultBar;
