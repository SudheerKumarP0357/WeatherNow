#!/bin/sh
echo "window._env_ = {
  VITE_OPENWEATHER_API_KEY: \"$VITE_OPENWEATHER_API_KEY\"
};" > /usr/share/nginx/html/env.js

exec "$@"
