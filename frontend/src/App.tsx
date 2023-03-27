import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser } from './api';
import Submission from './Submission';
import { useEffect } from 'react';
import Voting from './Voting';
import AlreadySubmitted from './AlreadySubmitted';

function App() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('unique_code');

  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(code!),
    enabled: !!code
  });

  useEffect(() => {
    if (code) {
      window.sessionStorage.setItem('unique_code', code);
    }
  }, [code]);

  if (!code) {
    return <div>You need to use the link that I sent you</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was an error</div>;
  }

  return (
    <div className="flex justify-center pb-20">
      <div className="max-w-4xl w-full">
        <div className="text-center py-8 text-4xl">
          hey {data?.data.user.first_name}
        </div>
        {data?.data.user.submitted ? <Voting /> : <Submission />}
        <div className="py-8">
          <hr />
        </div>
        <div className="space-y-8">
          <div className="text-2xl">Songs already submitted by others:</div>
          <AlreadySubmitted />
        </div>
      </div>
    </div>
  );
}

export default App;
