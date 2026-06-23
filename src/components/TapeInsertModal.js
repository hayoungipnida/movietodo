import { useEffect, useState } from 'react';
import styles from './TapeInsertModal.module.css';
import vhsImg from '../img/vhs.png'; 
import barcodeImg from '../img/barcode.png'; 
export default function TapeInsertModal({ tape, onClose }) {
  const [phase, setPhase] = useState('start');
  const { title, poster, index } = tape;

  useEffect(() => {
    const openTimer = setTimeout(() => setPhase('open'), 300);
    const slideTimer = setTimeout(() => setPhase('slide'), 1200);
    const finishTimer = setTimeout(() => setPhase('finish'), 1800);
    return () => { clearTimeout(openTimer); clearTimeout(slideTimer); clearTimeout(finishTimer); };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.stage} onClick={e => e.stopPropagation()}>
        <div className={styles.caseBack} />
        <div className={`${styles.vhsWrap} ${phase !== 'start' ? styles.vhsVisible : ''} ${phase === 'slide' || phase === 'finish' ? styles.vhsSlideOut : ''}`}>
          <img src={vhsImg} alt="vhs" className={styles.vhsImg} />
          {poster && <img src={poster} alt={title} className={styles.vhsPoster} />}
          
          <div className={`${styles.vhsPosterContainer} ${phase === 'finish' ? styles.stickerAttached : ''}`}>
            <div className={styles.stickerTitle}>{title}</div>
            <img src={barcodeImg} className={styles.stickerBarcode} alt="barcode" />
            <div className={styles.stickerIndex}>{String(index).padStart(2, '0')}</div>
            <div className={styles.stickerStatus}>CLEARED</div>
          </div>
        </div>
        <div className={`${styles.caseFront} ${phase !== 'start' ? styles.caseOpen : ''}`} />
      </div>
    </div>
  );
}