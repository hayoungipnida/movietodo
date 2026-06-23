import styles from './Trophy.module.css';

export default function Trophy({ imageSrc, isPopup }) {
  return (
    <div className={isPopup ? styles.popupWrapper : styles.placedWrapper}>
      <img src={imageSrc} alt="Trophy" className={styles.trophyImage} />
    </div>
  );
}