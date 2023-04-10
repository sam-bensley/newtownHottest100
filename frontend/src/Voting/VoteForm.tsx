import { Skeleton } from '@mui/material';
import Song, { DBSong } from '../AlreadySubmitted/Song';
import { useQuery } from '@tanstack/react-query';
import { getAllSongs } from '../api';
import SongVote from './SongVote';
import { useState } from 'react';
import { SpotifySong } from '../SpotifySeachBar/spotifyTypes';
import ConfirmVotesModal from './ConfirmVotesModal';

const MAX_SONG_VOTES = 5;

export default function VoteForm() {
  const { data, isLoading } = useQuery({
    queryKey: ['allSongs'],
    queryFn: () => {
      return getAllSongs();
    }
  });

  const [selectedSongs, setSelectedSongs] = useState<DBSong[]>([]);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const addSelectedSong = (song: DBSong) => {
    let newSelectedSongs = [...selectedSongs];
    //Add to selected song if not there otherwise remove it
    if (selectedSongs.map((s) => s.id).includes(song.id)) {
      newSelectedSongs = selectedSongs.filter((s) => s.id !== song.id);
    } else {
      newSelectedSongs = [...selectedSongs, song];
    }

    if (newSelectedSongs.length > MAX_SONG_VOTES) {
      alert(
        `You can only submit ${MAX_SONG_VOTES} songs (remove a song first)`
      );
      return;
    }

    setSelectedSongs(newSelectedSongs);
  };

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
  const songsRemaining = MAX_SONG_VOTES - selectedSongs.length;

  return (
    <>
      <ConfirmVotesModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        selectedSongs={selectedSongs}
        setSelectedSongs={setSelectedSongs}
      />
      <div>
        <div className="space-y-2">
          {songs.map((dbSong) => (
            <div key={dbSong.id}>
              <Song
                song={dbSong}
                CustomSongComponent={({ song }: { song: SpotifySong }) => (
                  <SongVote
                    song={song}
                    onSubmit={() => addSelectedSong(dbSong)}
                    submitted={selectedSongs
                      .map((song) => song.spotify_link)
                      .includes(song.external_urls.spotify)}
                  />
                )}
              />
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 w-full h-20 bg-slate-200 flex justify-end px-4">
          <div className="items-center flex space-x-4">
            <div className="">{songsRemaining} songs remaining</div>
            <button
              className={`text-white bg-blue-500 p-2 rounded-full px-4 ${
                songsRemaining > 0 && 'opacity-50'
              }`}
              disabled={songsRemaining > 0}
              onClick={() => setConfirmModalOpen(true)}
            >
              Go to confirm submission
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
