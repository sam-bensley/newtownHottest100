import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Buffer } from 'buffer';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

var config = {
  method: 'post',
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization:
      'Basic ' +
      Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: {
    grant_type: 'client_credentials'
  }
};

export default function useSpotifyToken(): {
  token: string | undefined;
  isLoading: boolean;
  error: any;
} {
  const cache = sessionStorage.getItem('spotify_token');

  const { data, isLoading, error } = useQuery({
    queryKey: ['spotify_credentials'],
    queryFn: () => {
      return axios(config);
    },
    staleTime: 1000 * 60 * 60,
    enabled: !cache
  });

  if (cache) {
    return { token: cache, isLoading: false, error: undefined };
  }

  if (isLoading) {
    return { token: undefined, isLoading, error: undefined };
  }

  if (error) {
    return { token: undefined, isLoading: false, error };
  }

  sessionStorage.setItem('spotify_token', data!.data.access_token);

  return {
    token: data!.data.access_token,
    isLoading: false,
    error: undefined
  };
}
