import { Song } from './spotifyTypes';
import _ from 'lodash';

export default function SongItem({ song }: { song: Song }) {
  return (
    <div className="w-full flex justify-between items-center space-x-4">
      <div className="shrink-0">
        <img src={_.last(song.album.images)?.url} alt="spotify album" />
      </div>
      <div className="text-right">
        {song.name}, {song.artists.map((artist) => artist.name).join(', ')}
      </div>
    </div>
  );
}
