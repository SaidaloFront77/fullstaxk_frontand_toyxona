// ✅ src/context/MusicContext.jsx
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [songs, setSongs] = useState([]);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(new Audio());

  // 🌐 Qo‘shiqlarni serverdan (songs.json) yuklash
  useEffect(() => {
    fetch('/Music/songs.json')
      .then(res => res.json())
      .then(data => setSongs(prev => [...data]))
      .catch(err => console.error('Qo‘shiqlarni yuklashda xato:', err));
  }, []);

  // 💾 localStorage'dan yuklangan qo‘shiqlarni olish
  useEffect(() => {
    const storedCustomSongs = localStorage.getItem('customSongs');
    if (storedCustomSongs) {
      const parsedSongs = JSON.parse(storedCustomSongs);
      setSongs(prev => [...prev, ...parsedSongs]);
    }
  }, []);

  // 🔁 Repeat holati o‘rnatish
  useEffect(() => {
    audioRef.current.loop = repeat;
  }, [repeat]);

  // ⏱️ Pozitsiyani tiklash
  useEffect(() => {
    const lastPosition = localStorage.getItem('lastPosition');
    const lastSong = localStorage.getItem('lastSong');

    if (lastSong && songs.length > 0) {
      const songInList = songs.find(s => s.file === lastSong);
      if (songInList) {
        audioRef.current.src = lastSong;
        audioRef.current.currentTime = parseFloat(lastPosition) || 0;
        setCurrentSong(lastSong);
      }
    }
  }, [songs]);

  // Har 5 soniyada pozitsiyani saqlash
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        localStorage.setItem('lastPosition', audioRef.current.currentTime);
        
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSong]);

  const playSong = (filePath) => {
    const index = songs.findIndex(song => song.file === filePath);
    if (index !== -1) {
      playByIndex(index);
    }
  };

  const playByIndex = (index) => {
    const filePath = songs[index].file;
    audioRef.current.src = filePath;
    audioRef.current.volume = volume;
    audioRef.current.play();
    setCurrentSong(filePath);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopMusic = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentSong(null);
    setCurrentIndex(null);
  };

  const nextSong = () => {
    if (currentIndex === null) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    playByIndex(nextIndex);
  };

  const prevSong = () => {
    if (currentIndex === null) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playByIndex(prevIndex);
  };

  const shuffleSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    playByIndex(randomIndex);
  };

  const changeVolume = (val) => {
    audioRef.current.volume = val;
    setVolume(val);
  };

  // ✅ Local qo‘shiq yuklash + localStorage'ga saqlash
  const addLocalSong = (file, coverFile) => {
    const localURL = URL.createObjectURL(file);
    const coverURL = coverFile ? URL.createObjectURL(coverFile) : null;
  
    const newSong = {
      title: file.name,
      file: localURL,
      cover: coverURL,
      isCustom: true
    };
    setSongs(prev => {
      const updated = [...prev, newSong];
      const customSongs = updated.filter(song => song.isCustom);
      localStorage.setItem('customSongs', JSON.stringify(customSongs));
      return updated;
    });
    playSong(localURL);
  };

  return (
    <MusicContext.Provider value={{
      isModalOpen, setIsModalOpen,
      currentSong, playSong, togglePlay,
      isPlaying, stopMusic, songs,
      nextSong, prevSong, shuffleSong,
      volume, changeVolume, currentIndex,
      addLocalSong, repeat, setRepeat
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);