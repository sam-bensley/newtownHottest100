import { Song } from './types';
import _ from 'lodash';

export default function SongItem({ song }: { song: Song }) {
  return (
    <div className="w-full flex justify-between">
      <div>
        <img src={_.last(song.album.images)?.url} alt="spotify album" />
      </div>
      <div>
        {song.name}, {song.artists.map((artist) => artist.name)}
      </div>
    </div>
  );
}
