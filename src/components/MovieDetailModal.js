import { useEffect, useState } from 'react';
import styles from './MovieDetailModal.module.css';

const TMDB_API_KEY = 'ef1d98f4b71e1feb390b2a25cc1c12bb';

export default function MovieDetailModal({ tape, onClose }) {
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (!tape?.tmdbId) return;
    fetch(`https://api.themoviedb.org/3/movie/${tape.tmdbId}?api_key=${TMDB_API_KEY}&language=ko-KR`)
      .then(r => r.json())
      .then(setDetail);
  }, [tape]);

  if (!tape) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>


        <button className={styles.closeBtn} onClick={onClose}>✕</button>


        <div className={styles.header}>
          {tape.poster && (
            <img src={tape.poster} alt={tape.title} className={styles.poster} />
          )}
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>{tape.title}</h2>
            {detail?.original_title && (
              <p className={styles.originalTitle}>{detail.original_title}</p>
            )}
            {detail && (
              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  📅 {detail.release_date?.slice(0, 4)}
                </span>
                <span className={styles.metaItem}>
                  ⏱ {detail.runtime}분
                </span>
                <span className={styles.metaItem}>
                  ⭐ {detail.vote_average?.toFixed(1)}
                </span>
              </div>
            )}
            {detail?.genres && (
              <div className={styles.genres}>
                {detail.genres.map(g => (
                  <span key={g.id} className={styles.genre}>{g.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.divider} />

        {/* 줄거리 */}
        {detail?.overview && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>줄거리</h3>
            <p className={styles.overview}>{detail.overview}</p>
          </div>
        )}

        {/* 상태 */}
        <div className={styles.statusRow}>
          <span className={`${styles.statusBadge} ${styles[tape.status]}`}>
            {tape.status === 'cleared' ? '✅ 시청 완료' : tape.status === 'now' ? '▶️ 시청 중' : '🔒 잠김'}
          </span>
        </div>

      </div>
    </div>
  );
}