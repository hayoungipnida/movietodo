import { useState, useEffect } from 'react';
import { BookShelf } from './components';
import logo1 from './img/logo1.png';
import logo2 from './img/logo2.png';
import TapeInsertModal from './components/TapeInsertModal';
import AddSkillTreeModal from './components/AddSkillTreeModal';
import MovieDetailModal from './components/MovieDetailModal';

const INITIAL_SHELF_DATA = [
  {
    id: 'occult',
    name: '오컬트 공포 마스터',
    tapes: [
      { id: 'exorcist', tmdbId: 96, status: 'cleared', color: { spine: '#8B1A1A', label: '#f0e0d0', text: '#4a1010' } },
      { id: 'rosemary', tmdbId: 805, status: 'cleared', color: { spine: '#1a2840', label: '#d8e4f0', text: '#1a2840' } },
      { id: 'hereditary', tmdbId: 447332, status: 'now', color: { spine: '#1a4030', label: '#d0e8dc', text: '#1a4030' } },
      { id: 'midsommar', tmdbId: 530385, status: 'locked', color: { spine: '#3a1a5a', label: '#e0d4f0', text: '#3a1a5a' } },
      { id: 'witch', tmdbId: 310131, status: 'locked', color: { spine: '#7a4a00', label: '#f0e4c0', text: '#5a3000' } },
      { id: 'suspiria', tmdbId: 439015, status: 'locked', color: { spine: '#6B3A8B', label: '#ecdff5', text: '#3a1a5a' } },
    ],
  },
  {
    id: 'zombie',
    name: 'B급 좀비 정복',
    tapes: [
      { id: 'night', tmdbId: 10331, status: 'cleared', color: { spine: '#2a2a2a', label: '#e8e8e0', text: '#1a1a1a' } },
      { id: 'dawn', tmdbId: 923, status: 'now', color: { spine: '#6B1A1A', label: '#f5e0e0', text: '#4a1010' } },
      { id: '28days', tmdbId: 170, status: 'locked', color: { spine: '#1a3a1a', label: '#d8f0d8', text: '#1a3a1a' } },
      { id: 'train', tmdbId: 396535, status: 'locked', color: { spine: '#1a1a4a', label: '#d8d8f5', text: '#1a1a4a' } },
    ],
  },
  {
    id: 'empty',
    name: '+ 추가하기',
    tapes: [],
  },
];

const TMDB_API_KEY = 'ef1d98f4b71e1feb390b2a25cc1c12bb';

export default function App() {
  const [shelfData, setShelfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTape, setSelectedTape] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editGenre, setEditGenre] = useState(null);
const [detailTape, setDetailTape] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const fullData = await Promise.all(
          INITIAL_SHELF_DATA.map(async (shelf) => {
            const updatedTapes = await Promise.all(
              shelf.tapes.map(async (tape) => {
                try {
                  const res = await fetch(`https://api.themoviedb.org/3/movie/${tape.tmdbId}?api_key=${TMDB_API_KEY}&language=ko-KR`);
                  const json = await res.json();
                  return {
                    ...tape,
                    title: json.title || tape.title,
                    originalTitle: json.original_title || tape.title,
                    poster: json.poster_path ? `https://image.tmdb.org/t/p/w500${json.poster_path}` : null
                  };
                } catch (e) {
                  return tape;
                }
              })
            );
            return { ...shelf, tapes: updatedTapes };
          })
        );
        setShelfData(fullData);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, []);

  const handleAddSkillTree = (newGenre) => {
    setShelfData(prev => {
      const withoutEmpty = prev.filter(g => g.id !== 'empty');
      return [...withoutEmpty, newGenre, { id: 'empty', name: '+ 추가하기', tapes: [] }];
    });
  };

  const handleEditSkillTree = (updatedGenre) => {
    setShelfData(prev => prev.map(g => g.id === updatedGenre.id ? updatedGenre : g));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      overflow: 'hidden'
    }}>
      <img src={logo1} alt="logo top" style={{ width: '100%', maxWidth: '365px' }} />

      {loading ? (
        <div>테이프 정리 중...</div>
      ) : (
        <>
          <BookShelf 
            data={shelfData} 
            onTapeClick={(tape) => setSelectedTape(tape)} 
            onAddGenre={() => setShowAddModal(true)}
            onEditGenre={(genre) => setEditGenre(genre)}
            onDetailTape={(tape) => setDetailTape(tape)}
          />

          {detailTape && (
            <MovieDetailModal 
              tape={detailTape} 
              onClose={() => setDetailTape(null)} 
            />
          )}
        </>
      )}

      <img src={logo2} alt="logo bottom" style={{ width: '100%', maxWidth: '355px' }} />

      {selectedTape && (
        <TapeInsertModal 
          tape={selectedTape} 
          onClose={() => setSelectedTape(null)} 
        />
      )}

      {showAddModal && (
        <AddSkillTreeModal 
          mode="add" 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddSkillTree} 
        />
      )}

      {editGenre && (
        <AddSkillTreeModal 
          mode="edit" 
          initialGenre={editGenre} 
          onClose={() => setEditGenre(null)} 
          onEdit={handleEditSkillTree} 
        />
      )}
    </div>
  );
}