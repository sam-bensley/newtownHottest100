import { useState } from 'react';
import SpotifySearchBar from './SpotifySeachBar';
import SongItem from './SpotifySeachBar/SongItem';
import { Song } from './SpotifySeachBar/types';
import { useMutation } from '@tanstack/react-query';
import { submitSongs } from './api';
import CircularProgress from '@mui/material/CircularProgress';

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

  const submitSongsMutation = useMutation({
    mutationFn: (songs: Song[]) => {
      return submitSongs(
        songs.map((song) => {
          return {
            title: song.name,
            artist: song.artists.map((artist) => artist.name).join(', '),
            spotify_link: song.external_urls.spotify
          };
        })
      );
    }
  });

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
      {selectedSongs.length > 0 ? (
        <div>
          <button
            className="text-white bg-blue-500 p-2 rounded-full"
            onClick={() => submitSongsMutation.mutate(selectedSongs)}
          >
            {submitSongsMutation.isLoading ? <CircularProgress /> : 'Submit'}
          </button>
          <div>
            {submitSongsMutation.isError && (
              <>{(submitSongsMutation.error as any).response?.data?.status}</>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
