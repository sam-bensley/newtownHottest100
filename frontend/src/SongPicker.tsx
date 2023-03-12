import { useState } from 'react';
import SpotifySearchBar from './SpotifySeachBar';
import SongItem from './SpotifySeachBar/SongItem';
import { Song } from './SpotifySeachBar/types';

export default function SongPicker() {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  const addSong = (song: Song) => {
    if (
      selectedSongs.find((s) => s.uri === song.uri) ||
      selectedSongs.length >= 2
    ) {
      window.alert('Song already selected or too many songs selected');
      return;
    }
    setSelectedSongs([...selectedSongs, song]);
  };

  return (
    <div className="space-y-4">
      <SpotifySearchBar songCallBack={(song) => addSong(song)} />
      <div className="space-y-4">
        {selectedSongs.map((song) => (
          <div className="flex justify-between space-x-4">
            <SongItem song={song} />
            <button
              className="text-blue-500"
              onClick={() =>
                setSelectedSongs(
                  selectedSongs.filter((s) => s.uri !== song.uri)
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
