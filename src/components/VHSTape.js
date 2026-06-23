import styles from './VHSTape.module.css';
import spineImg from '../img/vhsspine.png';


export default function VHSTape({ title, status, poster, onClick, onDetail }) {
  
  const handleTapeClick = (e) => {
console.log("테이프 클릭됨:", status);
    if (status === 'now') {
      onClick?.(); 
    } 

    else if (status === 'cleared') {
      onDetail?.(); 
    }
  
  };

  return (
    <div
      className={`${styles.tape} ${status === 'now' ? styles.now : ''}`}
      onClick={handleTapeClick} 
      role="button"
      tabIndex={0}
    >
      <div className={styles.posterArea}>
        {poster ? (
          <img src={poster} alt={title} className={styles.posterImg} />
        ) : (
          <span className={styles.posterFallback}>{title}</span>
        )}
      </div>
      
      <img src={spineImg} alt="" className={styles.spineOverlay} />

      {(status === 'now' || status === 'locked') && (
        <div className={styles.caseOverlay} />
      )}

      {status === 'locked' && <div className={styles.lockedBadge}>LOCKED</div>}
      {status === 'cleared' && <div className={styles.clearBadge}>DONE</div>}
      {status === 'now' && <div className={styles.nowBadge}>NOW</div>}
    </div>
  );
}