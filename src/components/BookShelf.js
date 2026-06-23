import { useState, useCallback, useEffect } from 'react';
import styles from './BookShelf.module.css';
import ShelfRow from './ShelfRow';
import TapeInsertModal from './TapeInsertModal';

export default function BookShelf({ data: initialData, onAddGenre, onEditGenre, onDetailTape }) {
  const [genres, setGenres] = useState(() => {
    const saved = localStorage.getItem('movieData');
    return saved ? JSON.parse(saved) : initialData;
  });
  
  const [modal, setModal] = useState(null);


  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setGenres(initialData);
    }
  }, [initialData]);


  useEffect(() => {
    localStorage.setItem('movieData', JSON.stringify(genres));
  }, [genres]);

  const handleComplete = useCallback((genreId, tapeId) => {
    setGenres(prevGenres => {
      const genre = prevGenres.find(g => g.id === genreId);
      const tape = genre?.tapes.find(t => t.id === tapeId);
      const tapeIndex = genre.tapes.findIndex(t => t.id === tapeId);
      
      if (tape && tape.status === 'now') {
        setModal({ tape: { ...tape, index: tapeIndex + 1 }, genreId, tapeId });
      }
      return prevGenres;
    });
  }, []);

  const handleModalClose = useCallback(() => {
    if (!modal) return;
    const { genreId, tapeId } = modal;

    setGenres(prev => prev.map(genre => {
      if (genre.id !== genreId) return genre;
      const tapes = genre.tapes.map((tape, idx, arr) => {
        if (tape.id === tapeId) return { ...tape, status: 'cleared' };
        const prevTape = arr[idx - 1];
        if (tape.status === 'locked' && prevTape?.id === tapeId) {
          return { ...tape, status: 'now' };
        }
        return tape;
      });
      return { ...genre, tapes };
    }));
    setModal(null);
  }, [modal]);

  return (
    <div className={styles.bookshelf}>
      <div className={styles.interior}>
        {genres.map(genre => (
          <ShelfRow
            key={genre.id}
            genre={genre}
            onComplete={(tapeId) => handleComplete(genre.id, tapeId)}
            onEmptyClick={genre.id === 'empty' ? onAddGenre : undefined}
            onEditClick={() => onEditGenre?.(genre)}
            onDetailTape={onDetailTape} 
          />
        ))}
      </div>
      {modal && <TapeInsertModal tape={modal.tape} onClose={handleModalClose} />}
    </div>
  );
}