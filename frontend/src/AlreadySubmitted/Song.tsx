import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SongItem from '../SpotifySeachBar/SongItem';
import useSpotifyToken from '../SpotifySeachBar/useSpotifyToken';

export interface DBSong {
  id: string;
  title: string;
  artist: string;
  spotify_link: string;
}

export default function Song({ song }: { song: DBSong }) {
  const { token } = useSpotifyToken();

  const spotifyId = song.spotify_link.split('/').pop();

  const { data, isLoading } = useQuery({
    queryKey: ['song', spotifyId],
    queryFn: async () => {
      return await axios.get(`https://api.spotify.com/v1/tracks/${spotifyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    enabled: !!token
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  return (
    <div>
      <SongItem song={data!.data} />
    </div>
  );
}
