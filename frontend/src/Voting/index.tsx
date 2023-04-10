import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api';
import VoteForm from './VoteForm';

const VOTING_ENABLED = true;

export default function Voting() {
  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(window.sessionStorage.getItem('unique_code')!)
  });

  return (
    <div className="space-y-4">
      <div className="text-2xl">Voting</div>
      {VOTING_ENABLED ? (
        data?.data?.user.voted ? (
          <div>Thanks for voting</div>
        ) : (
          <VoteForm />
        )
      ) : (
        <div>
          Thanks for your submission, gotta wait till everyone has submitted
          then I'll turn on voting.
        </div>
      )}
    </div>
  );
}
