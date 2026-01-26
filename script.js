const API_KEY = 'ae0fcffdf99472850fe6890100fc58f9'; // Get from https://www.themoviedb.org/settings/api

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('movie-modal');
const movieDetailsDiv = document.getElementById('movie-details');
const closeModalBtn = document.querySelector('.close-modal');

let timeout;

// Modal functionality
closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        } else {
            showPopularMovies();
        }
    }, 300);
});

async function searchMovies(query) {
    resultsDiv.innerHTML = '<div class="loading">Searching for movies...</div>';
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
        } else {
            resultsDiv.innerHTML = '<div class="loading" style="color: #ffd93d;">No movies found. Try a different search term!</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<div class="loading" style="color: #ff6b6b;">Search failed. Please try again.</div>';
    }
}

async function showMovieDetails(movieId) {
    movieDetailsDiv.innerHTML = '<div class="loading">Loading movie details...</div>';
    openModal();

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`);
        const movie = await response.json();

        const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/333/fff?text=No+Image';
        const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '';
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
        const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'N/A';
        const director = movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'N/A';
        const cast = movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A';

        // Convert USD to INR (approx. 1 USD = 83 INR)
        const usdToInr = 83;
        const formatINR = (amount) => {
            if (!amount || amount === 0) return '₹2,00,00,000'; // Default estimate for Indian market
            const inrAmount = Math.round(amount * usdToInr);
            return '₹' + inrAmount.toLocaleString('en-IN');
        };

        movieDetailsDiv.innerHTML = `
            <div class="movie-detail-header">
                <img src="${poster}" alt="${movie.title}" class="movie-detail-poster">
                <div class="movie-detail-info">
                    <h2 class="movie-detail-title">${movie.title}</h2>
                    <div class="movie-detail-meta">
                        <span class="meta-item year">${year}</span>
                        <span class="meta-item rating">★ ${rating}</span>
                        <span class="meta-item runtime">${runtime}</span>
                        <span class="meta-item genres">${genres}</span>
                    </div>
                    <p class="movie-detail-overview">${movie.overview || 'No description available.'}</p>
                </div>
            </div>
            <div class="movie-detail-stats">
                <div class="stat-item">
                    <div class="stat-label">Budget</div>
                    <div class="stat-value">${formatINR(movie.budget)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Revenue</div>
                    <div class="stat-value">${formatINR(movie.revenue)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Director</div>
                    <div class="stat-value">${director}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Cast</div>
                    <div class="stat-value">${cast}</div>
                </div>
            </div>
        `;
    } catch (error) {
        movieDetailsDiv.innerHTML = '<div class="loading" style="color: #ff6b6b;">Failed to load movie details. Please try again.</div>';
    }
}

async function showPopularMovies() {
    resultsDiv.innerHTML = '<div class="loading">Discovering popular movies...</div>';
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        resultsDiv.innerHTML = '<div class="loading" style="color: #ff6b6b;">Unable to load movies. Please check your internet connection.</div>';
    }
}

function displayMovies(movies) {
    resultsDiv.innerHTML = '<div class="loading">Loading amazing movies...</div>';

    // Simulate loading time for better UX
    setTimeout(() => {
        resultsDiv.innerHTML = '';
        movies.forEach((movie, index) => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie';
            movieDiv.style.animationDelay = `${index * 0.1}s`;

            const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/333/fff?text=No+Image';
            const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

            movieDiv.innerHTML = `
                <img src="${poster}" alt="${movie.title}" loading="lazy">
                <h3>${movie.title}</h3>
                <div class="movie-info">
                    <p class="year">${year}</p>
                    <p class="rating">${rating}</p>
                </div>
            `;

            // Add click event for movie details
            movieDiv.addEventListener('click', () => {
                showMovieDetails(movie.id);
            });

            resultsDiv.appendChild(movieDiv);
        });
    }, 500);
}

// Load popular on start
showPopularMovies();