import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Buffer } from 'buffer';
import { useState } from 'react';

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
  const [cache, setCache] = useState<string | null>(
    sessionStorage.getItem('spotify_token')
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['spotify_credentials'],
    queryFn: () => {
      return axios(config);
    },
    staleTime: 1000 * 60,
    enabled: !cache
  });

  if (cache) {
    let parsed;
    try {
      parsed = JSON.parse(cache);
    } catch (e) {
      sessionStorage.removeItem('spotify_token');
      setCache(null);
    }

    if (Date.now() >= parsed.expires) {
      sessionStorage.removeItem('spotify_token');
      setCache(null);
    } else {
      return {
        token: parsed.token,
        isLoading: false,
        error: undefined
      };
    }
    return { token: undefined, isLoading, error: undefined };
  }

  if (isLoading) {
    return { token: undefined, isLoading, error: undefined };
  }

  if (error) {
    return { token: undefined, isLoading: false, error };
  }

  sessionStorage.setItem(
    'spotify_token',
    JSON.stringify({
      token: data!.data.access_token,
      expires: Date.now() + data!.data.expires_in * 1000
    })
  );

  return {
    token: data!.data.access_token,
    isLoading: false,
    error: undefined
  };
}
