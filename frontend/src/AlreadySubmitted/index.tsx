import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAllSongs } from '../api';
import Song, { DBSong } from './Song';

export default function AlreadySubmitted() {
  const { data, isLoading } = useQuery({
    queryKey: ['allSongs'],
    queryFn: () => {
      return getAllSongs();
    }
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  const songs = (data! as any).data.songs as DBSong[];

  return (
    <div className='space-y-2'>
      {songs.map((song) => (
        <div key={song.id}>
          <Song song={song} />
        </div>
      ))}
    </div>
  );
}
