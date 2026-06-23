import { useState } from 'react';
import styles from './AddSkillTreeModal.module.css';

const TMDB_API_KEY = 'ef1d98f4b71e1feb390b2a25cc1c12bb';

const SPINE_COLORS = [
  { spine: '#8B1A1A', label: '#f0e0d0', text: '#4a1010' },
  { spine: '#1a2840', label: '#d8e4f0', text: '#1a2840' },
  { spine: '#1a4030', label: '#d0e8dc', text: '#1a4030' },
  { spine: '#3a1a5a', label: '#e0d4f0', text: '#3a1a5a' },
  { spine: '#7a4a00', label: '#f0e4c0', text: '#5a3000' },
  { spine: '#6B3A8B', label: '#ecdff5', text: '#3a1a5a' },
];

export default function AddSkillTreeModal({ onClose, onAdd, onEdit, mode = 'add', initialGenre = null }) {
  const [genreName, setGenreName] = useState(initialGenre?.name || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState(initialGenre?.tapes || []);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(searchQuery)}`
      );
      const json = await res.json();
      setSearchResults(json.results?.slice(0, 5) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (movie) => {
    if (selectedMovies.find(m => m.tmdbId === movie.id)) return;
    setSelectedMovies(prev => {
      const hasNow = prev.some(m => m.status === 'now');
      return [...prev, {
        id: `movie-${movie.id}`,
        tmdbId: movie.id,
        title: movie.title,
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        status: (!hasNow && prev.filter(m => m.status !== 'cleared').length === 0) ? 'now' : 'locked',
        color: SPINE_COLORS[prev.length % SPINE_COLORS.length],
      }];
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleRemove = (id) => {
    const movie = selectedMovies.find(m => m.id === id);
    if (movie?.status === 'cleared') return;
    setSelectedMovies(prev => {
      const filtered = prev.filter(m => m.id !== id);
      let nowAssigned = false;
      return filtered.map(m => {
        if (m.status === 'cleared') return m;
        if (!nowAssigned) { nowAssigned = true; return { ...m, status: 'now' }; }
        return { ...m, status: 'locked' };
      });
    });
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    if (selectedMovies[idx].status === 'cleared') return;
    if (selectedMovies[idx - 1].status === 'cleared') return;
    setSelectedMovies(prev => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      let nowAssigned = false;
      return arr.map(m => {
        if (m.status === 'cleared') return m;
        if (!nowAssigned) { nowAssigned = true; return { ...m, status: 'now' }; }
        return { ...m, status: 'locked' };
      });
    });
  };

  const handleMoveDown = (idx) => {
    setSelectedMovies(prev => {
      if (idx === prev.length - 1) return prev;
      if (prev[idx].status === 'cleared') return prev;
      if (prev[idx + 1].status === 'cleared') return prev;
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      let nowAssigned = false;
      return arr.map(m => {
        if (m.status === 'cleared') return m;
        if (!nowAssigned) { nowAssigned = true; return { ...m, status: 'now' }; }
        return { ...m, status: 'locked' };
      });
    });
  };

  const handleSubmit = () => {
    if (!genreName.trim() || selectedMovies.length === 0) return;
    if (mode === 'edit') {
      onEdit({ ...initialGenre, name: genreName, tapes: selectedMovies });
    } else {
      onAdd({ id: `genre-${Date.now()}`, name: genreName, tapes: selectedMovies });
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />
        <h2 className={styles.title}>{mode === 'edit' ? '스킬트리 수정' : '새 스킬트리 추가'}</h2>

        <input
          className={styles.input}
          placeholder="장르 이름 (예: 이탈리아 공포 정복)"
          value={genreName}
          onChange={e => setGenreName(e.target.value)}
        />

        <div className={styles.searchRow}>
          <input
            className={styles.input}
            placeholder="영화 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className={styles.searchBtn} onClick={handleSearch}>
            {searching ? '...' : '검색'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className={styles.results}>
            {searchResults.map(movie => (
              <div key={movie.id} className={styles.resultItem} onClick={() => handleSelect(movie)}>
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className={styles.resultPoster}
                  />
                )}
                <div className={styles.resultInfo}>
                  <span className={styles.resultTitle}>{movie.title}</span>
                  <span className={styles.resultYear}>{movie.release_date?.slice(0, 4)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMovies.length > 0 && (
          <div className={styles.selectedList}>
            <p className={styles.listLabel}>영화 목록 ({selectedMovies.length})</p>
            {selectedMovies.map((movie, i) => (
              <div key={movie.id} className={`${styles.selectedItem} ${movie.status === 'cleared' ? styles.clearedItem : ''}`}>
                <span className={styles.selectedNum}>{i + 1}</span>
                {movie.poster && (
                  <img src={movie.poster} alt={movie.title} className={styles.selectedPoster} />
                )}
                <span className={styles.selectedTitle}>{movie.title}</span>
                {movie.status === 'cleared' && (
                  <span className={styles.clearedLabel}>DONE</span>
                )}
                <div className={styles.orderBtns}>
                  <button
                    className={styles.orderBtn}
                    onClick={() => handleMoveUp(i)}
                    disabled={i === 0 || movie.status === 'cleared' || selectedMovies[i - 1]?.status === 'cleared'}
                  >▲</button>
                  <button
                    className={styles.orderBtn}
                    onClick={() => handleMoveDown(i)}
                    disabled={i === selectedMovies.length - 1 || movie.status === 'cleared' || selectedMovies[i + 1]?.status === 'cleared'}
                  >▼</button>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(movie.id)}
                  disabled={movie.status === 'cleared'}
                  style={{ opacity: movie.status === 'cleared' ? 0.2 : 1 }}
                >✕</button>
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!genreName.trim() || selectedMovies.length === 0}
        >
          {mode === 'edit' ? '수정 완료' : '책장에 추가하기'}
        </button>
      </div>
    </div>
  );
}