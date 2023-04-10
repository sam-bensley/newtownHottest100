import { useState } from 'react';
import ConfirmSubmissionModal from './ConfirmSubmissionModal';
import SpotifySearchBar from '../SpotifySeachBar';
import SongItem from '../SpotifySeachBar/SongItem';
import { SpotifySong } from '../SpotifySeachBar/spotifyTypes';
import AlreadySubmitted from '../AlreadySubmitted';

const MAX_SONGS = 2;

export default function SongPicker() {
  const [selectedSongs, setSelectedSongs] = useState<SpotifySong[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const addSong = (song: SpotifySong) => {
    if (
      selectedSongs.find((s) => s.uri === song.uri) ||
      selectedSongs.length >= MAX_SONGS
    ) {
      window.alert('Song already selected or too many songs selected');
      return;
    }
    setSelectedSongs([...selectedSongs, song]);
  };

  return (
    <div className=" bg-slate-100 p-4 rounded-xl">
      <ConfirmSubmissionModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        songs={selectedSongs}
      />
      <div className="space-y-4">
        <div className="text-2xl">Your Submission</div>
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
          <div className="flex justify-end">
            <button
              className="text-white bg-blue-500 p-2 rounded-full px-4"
              onClick={() => {
                if (selectedSongs.length !== MAX_SONGS) {
                  window.alert(`Please select ${MAX_SONGS} songs`);
                  return;
                } else setConfirmModalOpen(true);
              }}
            >
              Submit
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="py-8">
        <hr />
      </div>
      <div className="space-y-8">
        <div className="text-2xl">Songs already submitted by others:</div>
        <AlreadySubmitted />
      </div>
    </div>
  );
}
