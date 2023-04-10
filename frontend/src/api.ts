/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:8080/'; // Local
axios.defaults.baseURL = process.env.REACT_APP_API_URL; // Production

export const performGetRequest = async (url: string, params: any = {}) => {
  return axios.get(url, {
    params: { ...params }
  });
};

export const performPostRequest = async (url: string, params: any = {}) => {
  return axios.post(url, {
    unique_code: window.sessionStorage.getItem('unique_code'),
    ...params
  });
};

export const getAllSongs = () => performGetRequest('songs');

export const getUser = (uniqueCode: string) =>
  performGetRequest('user', { unique_code: uniqueCode });

export interface SongAPIInterface {
  title: string;
  artist: string;
  spotify_link: string;
}

export const submitSongs = (songs: SongAPIInterface[]) =>
  performPostRequest('submission/submit', { songs });

export const submitSongVotes = (songIds: number[]) =>
  performPostRequest('voting/vote', { song_ids: songIds });
