import _ from 'lodash';
import { SpotifySong } from '../SpotifySeachBar/spotifyTypes';

export default function SongVote({
  song,
  onSubmit,
  submitted = false
}: {
  song: SpotifySong;
  onSubmit: () => void;
  submitted: boolean;
}) {
  return (
    <div className="w-full flex justify-between items-center space-x-4">
      <div className="shrink-0">
        <img src={_.last(song.album.images)?.url} alt="spotify album" />
      </div>
      <div className="text-right">
        {song.name}, {song.artists.map((artist) => artist.name).join(', ')}
      </div>
      <button
        className={`${
          submitted ? ' text-blue-500' : 'bg-blue-500 text-white'
        }  p-2 rounded-full px-4`}
        onClick={onSubmit}
      >
        {submitted ? 'Remove from vote' : 'Add to Vote'}
      </button>
    </div>
  );
}
