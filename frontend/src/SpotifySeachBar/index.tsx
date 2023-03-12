import { useQuery } from '@tanstack/react-query';
import useSpotifyToken from './useSpotifyToken';
import axios from 'axios';
import { useState, useRef } from 'react';
import { Song } from './types';
import SongItem from './SongItem';

export default function SpotifySearchBar() {
  const { token } = useSpotifyToken();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading: isSearching } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      return await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: searchTerm,
          type: 'track'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    enabled: !!token && !!searchTerm
  });

  return (
    <div className=''>
      <input type="text" ref={inputRef} />
      <button
        onClick={() => {
          setSearchTerm(inputRef.current?.value || '');
        }}
      >
        Search{' '}
      </button>
      {isSearching && <div>Searching...</div>}
      {data && (
        <div>
          {data.data.tracks.items.map((song: Song) => (
            <SongItem song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
