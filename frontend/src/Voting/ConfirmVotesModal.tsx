import Song, { DBSong } from '../AlreadySubmitted/Song';
import Modal from '../common/Modal';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitSongVotes } from '../api';
import { CircularProgress } from '@mui/material';

export default function ConfirmVotingModal({
  open,
  setOpen,
  selectedSongs,
  setSelectedSongs
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedSongs: DBSong[];
  setSelectedSongs: (songs: DBSong[]) => void;
}) {
  const queryClient = useQueryClient();

  const submitVotes = useMutation({
    mutationFn: (songIds: number[]) => {
      return submitSongVotes(songIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      setOpen(false);
    }
  });

  const moveSongUp = (song: DBSong) => {
    const index = selectedSongs.findIndex((s) => s.id === song.id);
    if (index === 0) {
      return;
    }
    const newSelectedSongs = [...selectedSongs];
    newSelectedSongs[index] = newSelectedSongs[index - 1];
    newSelectedSongs[index - 1] = song;
    setSelectedSongs(newSelectedSongs);
  };

  const moveSongDown = (song: DBSong) => {
    const index = selectedSongs.findIndex((s) => s.id === song.id);
    if (index === selectedSongs.length - 1) {
      return;
    }
    const newSelectedSongs = [...selectedSongs];
    newSelectedSongs[index] = newSelectedSongs[index + 1];
    newSelectedSongs[index + 1] = song;
    setSelectedSongs(newSelectedSongs);
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex flex-col justify-between px-8 py-8 space-y-10">
        <div className="text-2xl">Confirm Voting</div>
        <div className="space-y-4 list-decimal">
          {selectedSongs.map((song, index) => (
            <div key={song.id} className="flex items-center space-x-4">
              <div>{index + 1}</div>
              <div className="flex-1">
                <Song song={song} />
              </div>
              <div className="flex flex-col text-blue-500 cursor-pointer">
                <KeyboardArrowUpIcon
                  className="hover:opacity-20"
                  onClick={() => moveSongUp(song)}
                />
                <KeyboardArrowDownIcon
                  className="hover:opacity-20"
                  onClick={() => moveSongDown(song)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          {submitVotes.isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <button
                className="text-blue-500 p-2 rounded-full px-4"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="text-white bg-blue-500 p-2 rounded-full px-4"
                onClick={() =>
                  submitVotes.mutate(selectedSongs.map((s) => Number(s.id)))
                }
              >
                Confirm and Submit Votes
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
