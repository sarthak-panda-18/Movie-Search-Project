# Movie Search Project

A simple web application to search for movies. As you type, it searches and displays movie posters, ratings, and release years.

## Setup

1. Get an API key from [TMDB](https://www.themoviedb.org/settings/api).

2. Replace 'YOUR_API_KEY_HERE' in script.js with your API key.

3. To run locally, use a local server (e.g., python -m http.server or VS Code Live Server extension) and open index.html.

## Features

- Real-time search as you type (debounced).

- Displays poster, title, year, rating.

- If no results, shows popular movies.

- No error messages; always shows content.