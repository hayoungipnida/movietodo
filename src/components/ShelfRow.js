import { useState, useEffect } from 'react';
import styles from './ShelfRow.module.css';
import VHSTape from './VHSTape';
import Trophy from './Trophy';
import prize1 from '../img/prize1.png';
import prize2 from '../img/prize2.png';

export default function ShelfRow({ genre, onComplete, onEmptyClick, onEditClick, onDetailTape }) {
  const isAllCleared = genre.tapes.length > 0 && genre.tapes.every(t => t.status === 'cleared');
  const [showPopup, setShowPopup] = useState(false);
  const trophyImage = genre.id === 'occult' ? prize1 : prize2;

  useEffect(() => {
    if (isAllCleared) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAllCleared]);

  if (genre.id === 'empty') {
    return (
      <div className={styles.row}>
        <button className={styles.addButton} onClick={onEmptyClick}>+ 추가하기</button>
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.genreLabel}>
        <span>{genre.name}</span>
        <button className={styles.editBtn} onClick={onEditClick}>수정</button>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.trophyPopup}>
            <div className={styles.congratsText}>{genre.name} 등극!</div>
            <Trophy imageSrc={trophyImage} />
          </div>
        </div>
      )}

      <div className={styles.shelf}>
        <div className={styles.tapeRow}>
          {genre.tapes.map((tape) => (
            <VHSTape
              key={tape.id}
              {...tape}
              onClick={() => onComplete?.(tape.id)}
              onDetail={() => onDetailTape?.(tape)} // 상세 모달 연결
            />
          ))}
          {isAllCleared && !showPopup && (
            <div className={styles.placedSlot}>
              <Trophy imageSrc={trophyImage} />
            </div>
          )}
        </div>
        <div className={styles.shelfBoard} />
      </div>
    </div>
  );
}