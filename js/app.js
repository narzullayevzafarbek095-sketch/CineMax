// ==========================================================================
// CineMax — Online Kino Platformasi Asosiy JavaScript Dasturi
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    movies: [...MOVIES_DATA],
    featuredMovies: MOVIES_DATA.filter(m => m.featured),
    currentHeroIndex: 0,
    activeGenre: 'all',
    searchQuery: '',
    selectedType: 'all', // 'all', 'movie', 'series'
    sortBy: 'popular',   // 'popular', 'rating', 'year', 'title'
    activeTab: 'home',   // 'home', 'catalog', 'genres', 'series', 'favorites', 'about'
    favorites: JSON.parse(localStorage.getItem('cinemax_favorites') || '[]'),
    userReviews: JSON.parse(localStorage.getItem('cinemax_user_reviews') || '{}'),
    selectedMovie: null,
    heroTimer: null,
    newReviewRating: 5
  };

  // DOM Elements Cache
  const header = document.getElementById('mainHeader');
  const searchInput = document.getElementById('globalSearchInput');
  const favBadge = document.getElementById('navFavBadge');
  const mobileFavBadge = document.getElementById('mobileFavBadge');
  const heroSection = document.getElementById('heroSection');
  const genresBar = document.getElementById('genresScrollBar');
  
  // Containers
  const homeSections = document.getElementById('homeSections');
  const catalogSection = document.getElementById('catalogSection');
  const genresSection = document.getElementById('genresSection');
  const seriesSection = document.getElementById('seriesSection');
  const favoritesSection = document.getElementById('favoritesSection');
  const aboutSection = document.getElementById('aboutSection');

  // Modals
  const movieModal = document.getElementById('movieDetailModal');
  const randomModal = document.getElementById('randomPickerModal');
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    updateFavoritesBadge();
    renderHeroBanner();
    startHeroAutoRotation();
    renderGenrePills();
    renderHomeView();
    renderCatalog();
    renderGenresExplorer();
    renderSeriesView();
    renderFavoritesView();
    setupEventListeners();
  }

  // ==========================================================================
  // Navigation & View Routing
  // ==========================================================================
  function switchView(viewName) {
    state.activeTab = viewName;

    // Update Nav links active state
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(el => {
      if (el.dataset.view === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Hide all main section containers
    [homeSections, catalogSection, genresSection, seriesSection, favoritesSection, aboutSection].forEach(sec => {
      if (sec) sec.style.display = 'none';
    });

    // Show selected section
    if (viewName === 'home') {
      if (homeSections) homeSections.style.display = 'block';
      if (heroSection) heroSection.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'catalog') {
      if (catalogSection) catalogSection.style.display = 'block';
      if (heroSection) heroSection.style.display = 'none';
      renderCatalog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'genres') {
      if (genresSection) genresSection.style.display = 'block';
      if (heroSection) heroSection.style.display = 'none';
      renderGenresExplorer();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'series') {
      if (seriesSection) seriesSection.style.display = 'block';
      if (heroSection) heroSection.style.display = 'none';
      renderSeriesView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'favorites') {
      if (favoritesSection) favoritesSection.style.display = 'block';
      if (heroSection) heroSection.style.display = 'none';
      renderFavoritesView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'about') {
      if (aboutSection) aboutSection.style.display = 'block';
      if (heroSection) heroSection.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ==========================================================================
  // Hero Banner Feature
  // ==========================================================================
  function renderHeroBanner() {
    const heroMovie = state.featuredMovies[state.currentHeroIndex] || state.movies[0];
    if (!heroMovie) return;

    const backdropImg = document.getElementById('heroBackdropImg');
    const heroTitle = document.getElementById('heroMovieTitle');
    const heroRating = document.getElementById('heroMovieRating');
    const heroAge = document.getElementById('heroMovieAge');
    const heroQuality = document.getElementById('heroMovieQuality');
    const heroDuration = document.getElementById('heroMovieDuration');
    const heroGenres = document.getElementById('heroMovieGenres');
    const heroDesc = document.getElementById('heroMovieDesc');
    const heroDetailsBtn = document.getElementById('heroDetailsBtn');
    const heroFavBtn = document.getElementById('heroFavBtn');
    const heroDotsContainer = document.getElementById('heroDots');

    if (backdropImg) {
      backdropImg.style.opacity = '0.3';
      setTimeout(() => {
        backdropImg.src = heroMovie.backdrop;
        backdropImg.alt = heroMovie.title;
        backdropImg.style.opacity = '1';
      }, 200);
    }

    if (heroTitle) heroTitle.textContent = heroMovie.title;
    if (heroRating) heroRating.innerHTML = `<i class="fas fa-star"></i> ${heroMovie.rating}`;
    if (heroAge) heroAge.textContent = heroMovie.ageRating;
    if (heroQuality) heroQuality.textContent = heroMovie.quality;
    if (heroDuration) heroDuration.textContent = heroMovie.duration;
    if (heroGenres) heroGenres.textContent = heroMovie.genre.join(', ');
    if (heroDesc) heroDesc.textContent = heroMovie.description;

    const isFav = state.favorites.includes(heroMovie.id);
    if (heroFavBtn) {
      heroFavBtn.innerHTML = isFav 
        ? '<i class="fas fa-check"></i> Sevimlilarda' 
        : '<i class="fas fa-plus"></i> Sevimlilarga qo\'shish';
      heroFavBtn.onclick = () => toggleFavorite(heroMovie.id);
    }

    if (heroDetailsBtn) {
      heroDetailsBtn.onclick = () => openMovieModal(heroMovie.id);
    }

    // Dots
    if (heroDotsContainer) {
      heroDotsContainer.innerHTML = state.featuredMovies.map((_, i) => `
        <span class="hero-dot ${i === state.currentHeroIndex ? 'active' : ''}" data-index="${i}"></span>
      `).join('');

      heroDotsContainer.querySelectorAll('.hero-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          state.currentHeroIndex = parseInt(e.target.dataset.index, 10);
          renderHeroBanner();
          restartHeroTimer();
        });
      });
    }
  }

  function startHeroAutoRotation() {
    state.heroTimer = setInterval(() => {
      state.currentHeroIndex = (state.currentHeroIndex + 1) % state.featuredMovies.length;
      renderHeroBanner();
    }, 8000);
  }

  function restartHeroTimer() {
    clearInterval(state.heroTimer);
    startHeroAutoRotation();
  }

  // ==========================================================================
  // Genre Filter Pills Bar
  // ==========================================================================
  function renderGenrePills() {
    if (!genresBar) return;
    genresBar.innerHTML = GENRES_LIST.map(g => `
      <button class="genre-pill ${state.activeGenre === g.id ? 'active' : ''}" data-genre="${g.id}">
        <i class="${g.icon}"></i>
        <span>${g.name}</span>
      </button>
    `).join('');

    genresBar.querySelectorAll('.genre-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.dataset.genre;
        setGenreFilter(selected);
      });
    });
  }

  function setGenreFilter(genreId) {
    state.activeGenre = genreId;
    renderGenrePills();

    // If on home, switch to catalog or filter catalog
    if (state.activeTab !== 'catalog') {
      switchView('catalog');
    } else {
      renderCatalog();
    }
  }

  // ==========================================================================
  // Movie Card Component HTML generator
  // ==========================================================================
  function createMovieCardHTML(movie) {
    const isFav = state.favorites.includes(movie.id);
    const mainGenre = Array.isArray(movie.genre) ? movie.genre[0] : movie.primaryGenre;

    return `
      <div class="movie-card" data-id="${movie.id}">
        <div class="card-poster-box">
          <img class="card-poster" src="${movie.poster}" alt="${movie.title}" loading="lazy">
          <span class="card-quality-badge">${movie.quality}</span>
          <span class="card-rating-badge"><i class="fas fa-star"></i> ${movie.rating}</span>
          <button class="card-fav-btn ${isFav ? 'favorited' : ''}" data-fav-id="${movie.id}" title="${isFav ? 'Sevimlilardan o\'chirish' : 'Sevimlilarga qo\'shish'}">
            <i class="${isFav ? 'fas fa-heart' : 'far fa-heart'}"></i>
          </button>
          <div class="card-hover-overlay" onclick="window.CineMax.openModal(${movie.id})">
            <button class="quick-play-btn" title="Tomosha qilish">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
        <div class="card-info">
          <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
          <div class="card-meta-line">
            <span class="card-genre-tag">${mainGenre}</span>
            <span>${movie.year}</span>
          </div>
          <button class="btn-card-details" onclick="window.CineMax.openModal(${movie.id})">
            <i class="fas fa-info-circle"></i> Batafsil
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // Home View Rendering
  // ==========================================================================
  function renderHomeView() {
    // 1. Trending slider
    const trendingTrack = document.getElementById('trendingTrack');
    if (trendingTrack) {
      const trendingMovies = state.movies.slice(0, 8);
      trendingTrack.innerHTML = trendingMovies.map(createMovieCardHTML).join('');
    }

    // 2. High rated slider
    const topRatedTrack = document.getElementById('topRatedTrack');
    if (topRatedTrack) {
      const topRated = [...state.movies].sort((a, b) => b.rating - a.rating).slice(0, 8);
      topRatedTrack.innerHTML = topRated.map(createMovieCardHTML).join('');
    }

    // 3. Serials slider
    const seriesTrack = document.getElementById('seriesHomeTrack');
    if (seriesTrack) {
      const seriesList = state.movies.filter(m => m.type === 'series');
      seriesTrack.innerHTML = seriesList.map(createMovieCardHTML).join('');
    }

    // 4. Recommendation Grid
    const homeRecomGrid = document.getElementById('homeRecomGrid');
    if (homeRecomGrid) {
      const recom = state.movies.slice(8, 20);
      homeRecomGrid.innerHTML = recom.map(createMovieCardHTML).join('');
    }

    setupCardFavoriteButtons();
    setupSliderButtons();
  }

  // ==========================================================================
  // Catalog View & Filtering
  // ==========================================================================
  function getFilteredMovies() {
    return state.movies.filter(movie => {
      // 1. Genre filter
      const matchesGenre = state.activeGenre === 'all' 
        || (Array.isArray(movie.genre) && movie.genre.includes(state.activeGenre))
        || movie.primaryGenre === state.activeGenre;

      // 2. Type filter (all, movie, series)
      const matchesType = state.selectedType === 'all' || movie.type === state.selectedType;

      // 3. Search query filter (title, original title, genre, year, director, actor)
      const q = state.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        movie.title.toLowerCase().includes(q) ||
        (movie.originalTitle && movie.originalTitle.toLowerCase().includes(q)) ||
        (Array.isArray(movie.genre) && movie.genre.some(g => g.toLowerCase().includes(q))) ||
        movie.year.toString().includes(q) ||
        (movie.director && movie.director.toLowerCase().includes(q)) ||
        (Array.isArray(movie.cast) && movie.cast.some(c => c.toLowerCase().includes(q)))
      );

      return matchesGenre && matchesType && matchesSearch;
    }).sort((a, b) => {
      if (state.sortBy === 'rating') return b.rating - a.rating;
      if (state.sortBy === 'year') return b.year - a.year;
      if (state.sortBy === 'title') return a.title.localeCompare(b.title);
      // default 'popular'
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating;
    });
  }

  function renderCatalog() {
    const grid = document.getElementById('catalogMoviesGrid');
    const resultCount = document.getElementById('catalogResultCount');
    if (!grid) return;

    const filtered = getFilteredMovies();
    if (resultCount) {
      resultCount.textContent = `${filtered.length} ta film topildi`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search empty-state-icon"></i>
          <h3 class="empty-state-title">Kino topilmadi</h3>
          <p class="empty-state-desc">
            "${state.searchQuery || state.activeGenre}" bo'yicha hech qanday kino topilmadi. Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang.
          </p>
          <button class="btn-primary" id="resetCatalogFiltersBtn">
            <i class="fas fa-redo"></i> Filtrlarni tozalash
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('resetCatalogFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.searchQuery = '';
          state.activeGenre = 'all';
          state.selectedType = 'all';
          if (searchInput) searchInput.value = '';
          const genreSelect = document.getElementById('catalogGenreSelect');
          if (genreSelect) genreSelect.value = 'all';
          const typeSelect = document.getElementById('catalogTypeSelect');
          if (typeSelect) typeSelect.value = 'all';
          renderGenrePills();
          renderCatalog();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(createMovieCardHTML).join('');
    setupCardFavoriteButtons();
  }

  // ==========================================================================
  // Genres Explorer View
  // ==========================================================================
  function renderGenresExplorer() {
    const container = document.getElementById('genresGridCards');
    if (!container) return;

    const genreData = [
      { id: 'Jangari', name: 'Jangari', icon: 'fas fa-fire', color: '#ef4444', img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
      { id: 'Komediya', name: 'Komediya', icon: 'fas fa-laugh-squint', color: '#f59e0b', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80' },
      { id: 'Fantastika', name: 'Fantastika', icon: 'fas fa-rocket', color: '#8b5cf6', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80' },
      { id: 'Sarguzasht', name: 'Sarguzasht', icon: 'fas fa-compass', color: '#10b981', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
      { id: 'Drama', name: 'Drama', icon: 'fas fa-theater-masks', color: '#6366f1', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80' },
      { id: 'Dahshat', name: 'Dahshat', icon: 'fas fa-ghost', color: '#ec4899', img: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80' },
      { id: 'Multfilm', name: 'Multfilm', icon: 'fas fa-dragon', color: '#06b6d4', img: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80' },
      { id: 'Detektiv', name: 'Detektiv', icon: 'fas fa-user-secret', color: '#64748b', img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80' },
      { id: 'Romantik', name: 'Romantik', icon: 'fas fa-heart', color: '#f43f5e', img: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80' }
    ];

    container.innerHTML = genreData.map(g => {
      const count = state.movies.filter(m => (m.genre && m.genre.includes(g.id)) || m.primaryGenre === g.id).length;
      return `
        <div class="genre-card-box" data-genre-id="${g.id}" style="--accent: ${g.color}; position: relative; height: 180px; border-radius: 16px; overflow: hidden; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
          <img src="${g.img}" alt="${g.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;">
          <div style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(10,10,14,0.95) 0%, rgba(10,10,14,0.4) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
              <i class="${g.icon}" style="color: ${g.color}; font-size: 1.3rem;"></i>
              <h3 style="font-size: 1.3rem; font-weight: 700; color: #fff;">${g.name}</h3>
            </div>
            <span style="font-size: 0.85rem; color: #9ca3af;">${count} ta film va serial</span>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.genre-card-box').forEach(card => {
      card.addEventListener('click', () => {
        const genId = card.dataset.genreId;
        setGenreFilter(genId);
      });
    });
  }

  // ==========================================================================
  // Series View
  // ==========================================================================
  function renderSeriesView() {
    const grid = document.getElementById('seriesMoviesGrid');
    if (!grid) return;
    const seriesOnly = state.movies.filter(m => m.type === 'series');
    grid.innerHTML = seriesOnly.map(createMovieCardHTML).join('');
    setupCardFavoriteButtons();
  }

  // ==========================================================================
  // Favorites View
  // ==========================================================================
  function renderFavoritesView() {
    const grid = document.getElementById('favoritesMoviesGrid');
    const emptyState = document.getElementById('favoritesEmptyState');
    if (!grid) return;

    const favMovies = state.movies.filter(m => state.favorites.includes(m.id));

    if (favMovies.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      grid.style.display = 'grid';
      grid.innerHTML = favMovies.map(createMovieCardHTML).join('');
      setupCardFavoriteButtons();
    }
  }

  // ==========================================================================
  // Favorite Toggle Logic
  // ==========================================================================
  function toggleFavorite(movieId) {
    const movie = state.movies.find(m => m.id === movieId);
    if (!movie) return;

    const index = state.favorites.indexOf(movieId);
    let added = false;
    if (index > -1) {
      state.favorites.splice(index, 1);
      showToast(`"${movie.title}" sevimlilardan olib tashlandi`, 'fa-trash');
    } else {
      state.favorites.push(movieId);
      added = true;
      showToast(`"${movie.title}" sevimlilarga qo'shildi!`, 'fa-heart');
    }

    localStorage.setItem('cinemax_favorites', JSON.stringify(state.favorites));
    updateFavoritesBadge();

    // Update favorite button in hero banner if relevant
    const heroFavBtn = document.getElementById('heroFavBtn');
    const heroMovie = state.featuredMovies[state.currentHeroIndex];
    if (heroFavBtn && heroMovie && heroMovie.id === movieId) {
      heroFavBtn.innerHTML = added
        ? '<i class="fas fa-check"></i> Sevimlilarda'
        : '<i class="fas fa-plus"></i> Sevimlilarga qo\'shish';
    }

    // Update modal favorite button if modal is open
    const modalFavBtn = document.getElementById('modalFavToggleBtn');
    if (modalFavBtn && state.selectedMovie && state.selectedMovie.id === movieId) {
      modalFavBtn.innerHTML = added 
        ? '<i class="fas fa-heart" style="color:var(--primary);"></i> Sevimlilarda'
        : '<i class="far fa-heart"></i> Sevimlilarga qo\'shish';
    }

    // Refresh any active card buttons
    document.querySelectorAll(`.card-fav-btn[data-fav-id="${movieId}"]`).forEach(btn => {
      if (added) {
        btn.classList.add('favorited');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
      } else {
        btn.classList.remove('favorited');
        btn.innerHTML = '<i class="far fa-heart"></i>';
      }
    });

    if (state.activeTab === 'favorites') {
      renderFavoritesView();
    }
  }

  function updateFavoritesBadge() {
    const count = state.favorites.length;
    if (favBadge) favBadge.textContent = count;
    if (mobileFavBadge) mobileFavBadge.textContent = count;
  }

  function setupCardFavoriteButtons() {
    document.querySelectorAll('.card-fav-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.favId, 10);
        toggleFavorite(id);
      };
    });
  }

  // ==========================================================================
  // Slider Arrows navigation
  // ==========================================================================
  function setupSliderButtons() {
    document.querySelectorAll('.slider-container-row').forEach(row => {
      const track = row.querySelector('.slider-track');
      const prevBtn = row.querySelector('.slider-nav-prev');
      const nextBtn = row.querySelector('.slider-nav-next');

      if (track && prevBtn && nextBtn) {
        prevBtn.onclick = () => {
          track.scrollBy({ left: -460, behavior: 'smooth' });
        };
        nextBtn.onclick = () => {
          track.scrollBy({ left: 460, behavior: 'smooth' });
        };
      }
    });
  }

  // ==========================================================================
  // Detailed Movie Modal Logic
  // ==========================================================================
  function openMovieModal(movieId, autoPlay = false) {
    const movie = state.movies.find(m => m.id === movieId);
    if (!movie) return;
    state.selectedMovie = movie;

    // Fill Modal elements
    const coverImg = document.getElementById('modalCoverImg');
    const posterThumb = document.getElementById('modalPosterThumb');
    const movieTitle = document.getElementById('modalMovieTitle');
    const origTitle = document.getElementById('modalOrigTitle');
    const tagsRow = document.getElementById('modalTagsRow');
    const playBtn = document.getElementById('modalWatchNowBtn');
    const favBtn = document.getElementById('modalFavToggleBtn');
    const shareBtn = document.getElementById('modalShareBtn');

    // Fill Info
    if (coverImg) coverImg.src = movie.backdrop || movie.poster;
    if (posterThumb) posterThumb.src = movie.poster;
    if (movieTitle) movieTitle.textContent = movie.title;
    if (origTitle) origTitle.textContent = movie.originalTitle || '';

    // Tags
    if (tagsRow) {
      tagsRow.innerHTML = `
        <span class="rating-pill"><i class="fas fa-star"></i> ${movie.rating} IMDb</span>
        <span class="quality-pill">${movie.quality}</span>
        <span class="age-pill">${movie.ageRating}</span>
        <span style="color:#a0a0b2; font-size:0.9rem;"><i class="far fa-clock"></i> ${movie.duration}</span>
        <span style="color:#a0a0b2; font-size:0.9rem;"><i class="far fa-calendar-alt"></i> ${movie.year}</span>
      `;
    }

    // Favorite state in modal
    const isFav = state.favorites.includes(movie.id);
    if (favBtn) {
      favBtn.innerHTML = isFav 
        ? '<i class="fas fa-heart" style="color:var(--primary);"></i> Sevimlilarda'
        : '<i class="far fa-heart"></i> Sevimlilarga qo\'shish';
      favBtn.onclick = () => toggleFavorite(movie.id);
    }

    if (shareBtn) {
      shareBtn.onclick = () => {
        navigator.clipboard?.writeText(window.location.href);
        showToast('Film havolasi nusxalandi!', 'fa-share-alt');
      };
    }

    // Tab 1: Overview
    const synopsis = document.getElementById('modalSynopsis');
    const directorVal = document.getElementById('modalDirectorVal');
    const castContainer = document.getElementById('modalCastContainer');
    const audioVal = document.getElementById('modalAudioVal');

    if (synopsis) synopsis.textContent = movie.description;
    if (directorVal) directorVal.textContent = movie.director || "Noma'lum";
    if (audioVal) audioVal.textContent = movie.audio || "O'zbekcha";

    if (castContainer && movie.cast) {
      castContainer.innerHTML = movie.cast.map(c => `
        <span class="cast-chip"><i class="fas fa-user-circle"></i> ${c}</span>
      `).join('');
    }

    // Tab 2: Video Player Setup
    setupCustomPlayer(movie.trailerUrl);

    // Tab 3: Cast Full list
    const actorsListFull = document.getElementById('actorsListFull');
    if (actorsListFull && movie.cast) {
      actorsListFull.innerHTML = movie.cast.map(c => `
        <div style="background:var(--bg-card); padding:12px 16px; border-radius:10px; display:flex; align-items:center; gap:12px; border:1px solid var(--border-light);">
          <div style="width:40px; height:40px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
            <i class="fas fa-user"></i>
          </div>
          <div>
            <div style="font-weight:700; color:#fff;">${c}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Bosh qahramon</div>
          </div>
        </div>
      `).join('');
    }

    // Tab 4: Reviews
    renderReviews(movie.id);

    // Default to first tab (or player if autoPlay)
    switchModalTab(autoPlay ? 'playerTab' : 'overviewTab');

    // Action button "Filmni tomosha qilish" switches to player tab
    if (playBtn) {
      playBtn.onclick = () => {
        switchModalTab('playerTab');
        const video = document.getElementById('customPlayerVideo');
        if (video) video.play();
      };
    }

    // Show modal
    if (movieModal) {
      movieModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMovieModal() {
    if (movieModal) {
      movieModal.classList.remove('active');
      document.body.style.overflow = '';
      const video = document.getElementById('customPlayerVideo');
      if (video) video.pause();
    }
  }

  function switchModalTab(tabId) {
    document.querySelectorAll('.modal-nav-tabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
  }

  // ==========================================================================
  // Custom Video Player Controls
  // ==========================================================================
  function setupCustomPlayer(videoUrl) {
    const video = document.getElementById('customPlayerVideo');
    const playPauseBtn = document.getElementById('playerPlayPauseBtn');
    const bigPlayOverlay = document.getElementById('playerBigPlayOverlay');
    const playerWrapper = document.getElementById('customPlayerWrapper');
    const progressBar = document.getElementById('playerProgressBar');
    const progressFilled = document.getElementById('playerProgressFilled');
    const timeDisplay = document.getElementById('playerTimeDisplay');
    const volumeSlider = document.getElementById('playerVolumeSlider');
    const muteBtn = document.getElementById('playerMuteBtn');
    const fullScreenBtn = document.getElementById('playerFullScreenBtn');
    const rewindBtn = document.getElementById('playerRewindBtn');
    const forwardBtn = document.getElementById('playerForwardBtn');
    const speedSelect = document.getElementById('playerSpeedSelect');

    if (!video) return;
    video.src = videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    video.load();

    function togglePlay() {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }

    if (playPauseBtn) playPauseBtn.onclick = togglePlay;
    if (bigPlayOverlay) bigPlayOverlay.onclick = togglePlay;

    video.onplay = () => {
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      if (playerWrapper) playerWrapper.classList.remove('paused');
    };

    video.onpause = () => {
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      if (playerWrapper) playerWrapper.classList.add('paused');
    };

    video.ontimeupdate = () => {
      const current = video.currentTime;
      const duration = video.duration || 1;
      const percent = (current / duration) * 100;
      if (progressFilled) progressFilled.style.width = `${percent}%`;

      const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
      }
    };

    if (progressBar) {
      progressBar.onclick = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
      };
    }

    if (rewindBtn) {
      rewindBtn.onclick = () => { video.currentTime = Math.max(0, video.currentTime - 10); };
    }
    if (forwardBtn) {
      forwardBtn.onclick = () => { video.currentTime = Math.min(video.duration, video.currentTime + 10); };
    }

    if (volumeSlider) {
      volumeSlider.oninput = (e) => {
        video.volume = parseFloat(e.target.value);
        if (muteBtn) {
          muteBtn.innerHTML = video.volume === 0 ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        }
      };
    }

    if (muteBtn) {
      muteBtn.onclick = () => {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
      };
    }

    if (speedSelect) {
      speedSelect.onchange = (e) => {
        video.playbackRate = parseFloat(e.target.value);
      };
    }

    if (fullScreenBtn) {
      fullScreenBtn.onclick = () => {
        if (!document.fullscreenElement) {
          playerWrapper.requestFullscreen().catch(err => console.log(err));
        } else {
          document.exitFullscreen();
        }
      };
    }
  }

  // ==========================================================================
  // Reviews & Rating System
  // ==========================================================================
  function renderReviews(movieId) {
    const list = document.getElementById('modalReviewsList');
    if (!list) return;

    const movie = state.movies.find(m => m.id === movieId);
    const builtInReviews = (movie && movie.reviews) ? movie.reviews : [];
    const customReviews = state.userReviews[movieId] || [];
    const allReviews = [...customReviews, ...builtInReviews];

    if (allReviews.length === 0) {
      list.innerHTML = `<p style="color:var(--text-muted); font-size:0.95rem;">Hozircha sharhlar yo'q. Birinchi bo'lib fikr bildiring!</p>`;
      return;
    }

    list.innerHTML = allReviews.map(r => {
      const stars = Array.from({ length: 5 }, (_, i) => 
        `<i class="${i < r.rating ? 'fas' : 'far'} fa-star"></i>`
      ).join('');

      return `
        <div class="review-item">
          <div class="review-author-line">
            <span class="reviewer-name"><i class="fas fa-user-circle"></i> ${r.user}</span>
            <span class="review-date">${r.date}</span>
          </div>
          <div class="review-stars">${stars}</div>
          <p class="review-body-text">${r.text}</p>
        </div>
      `;
    }).join('');

    // Setup star rating picker in form
    const starPicker = document.getElementById('reviewStarsPicker');
    if (starPicker) {
      starPicker.querySelectorAll('i').forEach(star => {
        star.onclick = () => {
          const val = parseInt(star.dataset.val, 10);
          state.newReviewRating = val;
          starPicker.querySelectorAll('i').forEach((s, idx) => {
            s.classList.toggle('active', idx < val);
          });
        };
      });
    }

    // Submit review button
    const submitBtn = document.getElementById('submitReviewBtn');
    const reviewInput = document.getElementById('newReviewText');
    const reviewerNameInput = document.getElementById('newReviewerName');

    if (submitBtn) {
      submitBtn.onclick = () => {
        const text = reviewInput ? reviewInput.value.trim() : '';
        const name = (reviewerNameInput && reviewerNameInput.value.trim()) ? reviewerNameInput.value.trim() : 'Foydalanuvchi';

        if (!text) {
          showToast('Iltimos, fikringizni yozing!', 'fa-exclamation-triangle');
          return;
        }

        if (!state.userReviews[movieId]) {
          state.userReviews[movieId] = [];
        }

        const newReview = {
          user: name,
          rating: state.newReviewRating,
          date: new Date().toISOString().split('T')[0],
          text: text
        };

        state.userReviews[movieId].unshift(newReview);
        localStorage.setItem('cinemax_user_reviews', JSON.stringify(state.userReviews));

        if (reviewInput) reviewInput.value = '';
        renderReviews(movieId);
        showToast('Fikringiz muvaffaqiyatli saqlandi!', 'fa-check-circle');
      };
    }
  }

  // ==========================================================================
  // Random Movie Picker ("Bugun nima ko'ramiz?")
  // ==========================================================================
  function openRandomPicker() {
    if (!randomModal) return;
    randomModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const rouletteBox = document.getElementById('rouletteContainer');
    const rouletteImg = document.getElementById('roulettePosterImg');
    const resultBox = document.getElementById('rouletteResultBox');
    const spinBtn = document.getElementById('startSpinBtn');
    const viewMovieBtn = document.getElementById('rouletteViewMovieBtn');

    if (resultBox) resultBox.style.display = 'none';
    if (rouletteBox) rouletteBox.classList.add('spinning');
    if (spinBtn) spinBtn.disabled = true;

    // Rapid shuffle effect
    let count = 0;
    const interval = setInterval(() => {
      const rand = state.movies[Math.floor(Math.random() * state.movies.length)];
      if (rouletteImg) rouletteImg.src = rand.poster;
      count++;
      if (count > 20) {
        clearInterval(interval);
        // Pick final high-rated movie
        const topCandidates = state.movies.filter(m => m.rating >= 7.5);
        const finalPick = topCandidates[Math.floor(Math.random() * topCandidates.length)] || state.movies[0];

        if (rouletteImg) rouletteImg.src = finalPick.poster;
        if (rouletteBox) rouletteBox.classList.remove('spinning');
        if (spinBtn) spinBtn.disabled = false;

        if (resultBox) {
          resultBox.style.display = 'block';
          document.getElementById('rouletteMovieTitle').textContent = finalPick.title;
          document.getElementById('rouletteMovieMeta').textContent = `${finalPick.year} • ${finalPick.genre.join(', ')} • ★ ${finalPick.rating}`;
        }

        if (viewMovieBtn) {
          viewMovieBtn.onclick = () => {
            closeRandomPicker();
            openMovieModal(finalPick.id);
          };
        }
      }
    }, 80);
  }

  function closeRandomPicker() {
    if (randomModal) {
      randomModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ==========================================================================
  // Toast Notification System
  // ==========================================================================
  function showToast(message, iconClass = 'fa-info-circle') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fas ${iconClass}"></i>
      <span style="font-size:0.95rem; font-weight:500;">${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // ==========================================================================
  // Event Listeners Setup
  // ==========================================================================
  function setupEventListeners() {
    // Header Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Navigation Click Links
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view) switchView(view);
      });
    });

    // Brand Logo click -> Home
    const logo = document.getElementById('brandLogo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('home');
      });
    }

    // Global Search Input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (state.activeTab !== 'catalog') {
          switchView('catalog');
        } else {
          renderCatalog();
        }
      });
    }

    // Catalog Filter Controls
    const genreSelect = document.getElementById('catalogGenreSelect');
    if (genreSelect) {
      genreSelect.addEventListener('change', (e) => {
        state.activeGenre = e.target.value;
        renderGenrePills();
        renderCatalog();
      });
    }

    const typeSelect = document.getElementById('catalogTypeSelect');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        state.selectedType = e.target.value;
        renderCatalog();
      });
    }

    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderCatalog();
      });
    }

    // Random Picker Buttons
    const randomBtn = document.getElementById('navSurpriseBtn');
    if (randomBtn) randomBtn.addEventListener('click', openRandomPicker);

    const reSpinBtn = document.getElementById('startSpinBtn');
    if (reSpinBtn) reSpinBtn.addEventListener('click', openRandomPicker);

    const randomCloseBtn = document.getElementById('randomCloseBtn');
    if (randomCloseBtn) randomCloseBtn.addEventListener('click', closeRandomPicker);

    // Modal Close
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMovieModal);

    if (movieModal) {
      movieModal.addEventListener('click', (e) => {
        if (e.target === movieModal) closeMovieModal();
      });
    }

    if (randomModal) {
      randomModal.addEventListener('click', (e) => {
        if (e.target === randomModal) closeRandomPicker();
      });
    }

    // Modal Tabs
    document.querySelectorAll('.modal-nav-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchModalTab(btn.dataset.tab);
      });
    });

    // Profile Modal toggle
    const profileBtn = document.getElementById('userProfileBtn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        showToast('VIP Premium obuna faol (2027-yilgacha)', 'fa-crown');
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMovieModal();
        closeRandomPicker();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      }
    });

    // Expose Global Helper for inline onclicks
    window.CineMax = {
      openModal: openMovieModal,
      toggleFavorite: toggleFavorite,
      switchView: switchView,
      setGenre: setGenreFilter
    };
  }

  // Run CineMax
  init();
});
