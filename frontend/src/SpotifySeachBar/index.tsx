import { useQuery } from '@tanstack/react-query';
import useSpotifyToken from './useSpotifyToken';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { SpotifySong } from './spotifyTypes';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import SongItem from './SongItem';
import { useDebounce } from 'use-debounce';

export default function SpotifySearchBar({
  songCallBack
}: {
  songCallBack: (song: SpotifySong) => void;
}) {
  const { token } = useSpotifyToken();

  const [value, setValue] = useState<SpotifySong | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 500);
  const [options, setOptions] = useState<readonly SpotifySong[]>([]);

  const { data, isLoading: isSearching } = useQuery({
    queryKey: ['search', debouncedInputValue],
    queryFn: async () => {
      return await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: inputValue,
          type: 'track'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    enabled: !!token && !!inputValue
  });

  useEffect(() => {
    if (data) {
      console.log(data.data.tracks.items.map((item: any) => item.name));
      setOptions(data.data.tracks.items);
    }
  }, [data]);

  return (
    <div className="py-8 space-y-4">
      <div className="">
        <Autocomplete
          id="google-map-demo"
          sx={{ width: '100%' }}
          filterOptions={(x) => x}
          options={options}
          loading={isSearching}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={value}
          getOptionLabel={(option) =>
            `${option.name} - ${option.artists[0].name}`
          }
          noOptionsText="No songs found"
          onChange={(event: any, newValue: SpotifySong | null) => {
            setOptions([]);
            setValue(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Type your song" fullWidth />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.uri}>
                <SongItem song={option} />
              </li>
            );
          }}
        />
      </div>
      <div className="flex justify-end">
        <button
          className="text-white bg-blue-500 p-2 rounded-full"
          onClick={() => {
            if (value) {
              setValue(null);
              songCallBack(value);
            }
          }}
        >
          Add song!
        </button>
      </div>
    </div>
  );
}
