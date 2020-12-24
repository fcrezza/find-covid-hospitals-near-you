import styles from './alert.module.css';

function Alert({title, text}) {
  return (
    <div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.divider}></div>
      <p className={styles.text}>{text}</p>
      <div className={styles.divider}></div>
    </div>
  );
}

export default Alert;
