#!/bin/sh

# Replace API key in the config file
echo "window.VITE_OPENWEATHER_API_KEY = '$VITE_OPENWEATHER_API_KEY';" > /usr/share/nginx/html/config.js

# Execute CMD
exec "$@"