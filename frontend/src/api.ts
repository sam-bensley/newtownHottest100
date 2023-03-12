/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/'; // Local

export const performGetRequest = async (url: string, params: any = {}) => {
  return axios.get(url, {
    params: { ...params }
  });
};

export const performPostRequest = async (url: string, params: any = {}) => {
  return axios.post(url, {
    ...params
  });
};

export const getUser = (uniqueCode: string) =>
  performGetRequest('user', { unique_code: uniqueCode });

