import React, { useState } from 'react';
import './MusicModal.css';
import { useMusic } from '../context/MusicContext';
import { useTranslation } from 'react-i18next';

const MusicModal = () => {
  const {
    isModalOpen, setIsModalOpen,
    songs, playSong, currentSong, isPlaying, togglePlay,
    nextSong, prevSong, shuffleSong, volume, changeVolume,
    addLocalSong, repeat, setRepeat, currentIndex
  } = useMusic();

  const { t } = useTranslation();
  const [localAudio, setLocalAudio] = useState(null);
  const [localCover, setLocalCover] = useState(null);

  if (!isModalOpen) return null;

  const handleAudioChange = (e) => setLocalAudio(e.target.files[0]);
  const handleCoverChange = (e) => setLocalCover(e.target.files[0]);
  const handleUpload = () => {
    if (localAudio) {
      addLocalSong(localAudio, localCover);
      setLocalAudio(null);
      setLocalCover(null);
    }
  };

  const coverUrl = songs[currentIndex]?.cover || '';

  return (
    <div
      className="music-modal-overlay"
      onClick={() => setIsModalOpen(false)}
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url(${coverUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 10000,
      }}
    >
      <div className="music-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t('songs_title')}</h2>
        <ul>
          {songs.map((song, idx) => (
            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className={song.file === currentSong ? 'active' : ''}
                onClick={() => playSong(song.file)}
              >
                {song.title}
              </button>
              <a
                href={song.file}
                download
                title={t('download')}
                style={{ marginLeft: '10px', fontSize: '14px', textDecoration: 'none', color: 'gold' }}
              >
                ⬇️
              </a>
            </li>
          ))}
        </ul>

        {currentSong && (
          <>
            {songs[currentIndex]?.cover && (
              <img
                src={songs[currentIndex].cover}
                alt="cover"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '10px'
                }}
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <button onClick={prevSong}>{t('prev')}</button>
              <button onClick={togglePlay}>{isPlaying ? t('pause') : t('play')}</button>
              <button onClick={nextSong}>{t('next')}</button>
              <button onClick={shuffleSong}>{t('shuffle')}</button>
            </div>

            <div style={{ marginTop: 10 }}>
              <label>{t('volume')}:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
              />
            </div>

            <button onClick={() => setRepeat(!repeat)} style={{ marginTop: '10px' }}>
              {repeat ? t('repeat_on') : t('repeat_off')}
            </button>
          </>
        )}

        <div style={{ marginTop: 20 }}>
          <label style={{ fontWeight: 'bold' }}>{t('upload_label')}</label>
          <input type="file" accept="audio/*" onChange={handleAudioChange} />
          <label style={{ fontWeight: 'bold' }}>{t('cover_label')}</label>
          <input type="file" accept="image/*" onChange={handleCoverChange} />
          <button onClick={handleUpload} disabled={!localAudio} style={{ marginTop: '10px' }}>
            {t('add_song')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicModal;
