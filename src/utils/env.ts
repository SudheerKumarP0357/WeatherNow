// src/utils/env.js

declare global {
  interface Window {
    _env_?: {
      VITE_OPENWEATHER_API_KEY?: string;
    };
  }
}

export const getEnv = () => {
  return {
    VITE_OPENWEATHER_API_KEY: window._env_?.VITE_OPENWEATHER_API_KEY,
  };
};
