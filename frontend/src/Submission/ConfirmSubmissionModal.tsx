import Modal from '../common/Modal';
import { Song } from '../SpotifySeachBar/spotifyTypes';
import SongItem from '../SpotifySeachBar/SongItem';
import { submitSongs } from '../api';
import { useMutation } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

interface ErrorType {
  status: string;
  duplicates?: { title: string; artist: string }[];
}

function ErrorResponse({ error }: { error: ErrorType }) {
  if (!error) {
    return <>Unknown Error</>;
  }

  if (error.status === 'duplicate song') {
    return (
      <div className="text-red-500">
        Someone else has already submitted the following songs:
        {error.duplicates?.map((song) => (
          <div>
            {song.title} by {song.artist}
          </div>
        ))}
      </div>
    );
  }

  return <>{error.status}</>;
}

export default function ConfirmSubmissionModal({
  open,
  setOpen,
  songs
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  songs: Song[];
}) {
  const queryClient = useQueryClient();

  const submitSongsMutation = useMutation({
    mutationFn: (songs: Song[]) => {
      return submitSongs(
        songs.map((song) => {
          return {
            title: song.name,
            artist: song.artists.map((artist) => artist.name).join(', '),
            spotify_link: song.external_urls.spotify
          };
        })
      );
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries(['allSongs']);
        setOpen(false);
      }, 500);
    }
  });

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="space-y-4 p-4">
        <div>
          Are you sure you want to submit these two songs? (You can only submit
          once!)
        </div>
        {songs.map((song) => (
          <SongItem song={song} />
        ))}
        <div className="flex justify-end space-x-2">
          <div>
            <button
              className="text-white bg-blue-500 p-2 rounded-full"
              onClick={() => submitSongsMutation.mutate(songs)}
            >
              {submitSongsMutation.isLoading ? <CircularProgress /> : 'Submit'}
            </button>
          </div>
          <div>
            <button
              className="text-white bg-blue-500 p-2 rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="text-right">
          {submitSongsMutation.isSuccess && <>Success!</>}
          {submitSongsMutation.isError && (
            <>
              <ErrorResponse
                error={
                  (submitSongsMutation.error as any).response?.data as ErrorType
                }
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
