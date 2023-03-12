import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser } from './api';
import SpotifySearchBar from './SpotifySeachBar';

function App() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('unique_code');

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', code],
    queryFn: () => getUser(code!),
    enabled: !!code
  });

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
    <div className="flex justify-center">
      <div className="max-w-4xl w-full">
        <SpotifySearchBar />
        <div>hey {data?.data.user.first_name}</div>
      </div>
    </div>
  );
}

export default App;
