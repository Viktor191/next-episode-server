import axios, { InternalAxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TMDB_API_URL = process.env.TMDB_API_URL;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

const tmdbApiClient = axios.create({
  baseURL: TMDB_API_URL,
  timeout: 10000,
});

tmdbApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (TMDB_BEARER_TOKEN) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${TMDB_BEARER_TOKEN}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export { tmdbApiClient };
