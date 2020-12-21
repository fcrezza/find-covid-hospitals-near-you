import React from 'react';
import classNames from 'classnames';

import styles from './resultBar.module.css';
import Search from './Search';

function ResultBar({data, mapRef, onChangeDistance, distance}) {
  const [isCollapse, setCollapseState] = React.useState(false);
  const [isOverElement, setIsOverElement] = React.useState(false);

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
      mapRef.current.dragging.disable();
      mapRef.current.doubleClickZoom.disable();
      mapRef.current.scrollWheelZoom.disable();
      return;
    }

    mapRef.current.dragging.enable();
    mapRef.current.doubleClickZoom.enable();
    mapRef.current.scrollWheelZoom.enable();
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
      <Search distance={distance} onChangeDistance={onChangeDistance} />
      <div className={styles.resultItemContainer}>
        {data.map((hospital, idx) => {
          if (hospital.isHospital) {
            return (
              <div className={styles.resultItem} key={idx}>
                <h1 className={styles.resultTitle}>{hospital.name}</h1>
                <p className={styles.resultAttribute}>
                  Provinsi: {hospital.province}
                </p>
                <p className={styles.resultAttribute}>
                  Alamat: {hospital.address}
                </p>
                <p className={styles.resultAttribute}>
                  Telepon: {hospital.telephone}
                </p>
                <p className={styles.resultAttribute}>Fax: {hospital.fax}</p>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default ResultBar;
