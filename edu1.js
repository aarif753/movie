// Initialize with shuffled movies and categories
shuffleArray(shuffledMovies);
const allCategories = [...new Set(allMovies.map(movie => movie.category))];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function appendMessage(sender, html) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}-message`;
  msg.innerHTML = html;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "message ai-message typing-indicator";
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typing;
}

function removeTypingIndicator() {
  const lastMsg = chatBox.lastChild;
  if (lastMsg && lastMsg.className.includes("typing-indicator")) {
    chatBox.removeChild(lastMsg);
  }
}

// Enhanced movie card with category tag
function formatMovie(movie) {
  return `
    <div class="movie-card">
      <img src="${movie.thumbnail}" alt="${movie.title}" />
      <div class="movie-category">${movie.category}</div>
      <div class="movie-title">${movie.title}</div>
      <div class="movie-theme">${movie.theme} | IMDb: ${movie.imdb}</div>
      <div class="movie-desc">${movie.desc}</div>
      <div class="movie-tags">${movie.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}</div>
      <a href="${movie.download}" class="download-btn" target="_blank">📥 Download</a>
      <button class="more-btn" onclick="showSimilar('${movie.id}')">🔍 Similar</button>
    </div>
  `;
}

// Show movies by category
function showMoviesByCategory(category) {
  const filteredMovies = allMovies.filter(movie => movie.category === category);
  let html = `<strong>🎬 ${category}:</strong><br><small>${categoryDescriptions[category]}</small>`;
  
  if (filteredMovies.length === 0) {
    html += "<p>No movies found in this category.</p>";
  } else {
    filteredMovies.forEach(movie => {
      html += formatMovie(movie);
    });
  }
  
  html += `
    <br>
    <button class="more-btn" onclick="showCategoryMenu()">← Back to Categories</button>
    <button class="more-btn" onclick="showNextMovies('${category}')">▶️ More ${category} Movies</button>
  `;
  
  appendMessage("ai", html);
}

// Show category selection menu
function showCategoryMenu() {
  let html = `<strong>📚 Choose a Category:</strong><br><small>Browse educational movies by theme</small><br><br>`;
  
  allCategories.forEach(category => {
    html += `
      <button class="category-btn" onclick="showMoviesByCategory('${category}')">
        ${category}
      </button>
    `;
  });
  
  html += `<br><br><button class="more-btn" onclick="showNextMovies()">🎲 Show Random Movies</button>`;
  appendMessage("ai", html);
}

// Show next set of movies (can be filtered by category)
function showNextMovies(category = null) {
  const moviesToShow = [];
  const sourceMovies = category ? allMovies.filter(m => m.category === category) : shuffledMovies;
  
  for (let i = 0; i < 3; i++) {
    if (currentIndex >= sourceMovies.length) {
      currentIndex = 0;
      if (!category) shuffleArray(shuffledMovies);
    }
    moviesToShow.push(sourceMovies[currentIndex]);
    currentIndex++;
  }
  
  let html = `<strong>🎬 ${category ? category + ' Movies' : 'Recommended Educational Movies'}:</strong>`;
  moviesToShow.forEach(movie => {
    html += formatMovie(movie);
  });
  
  if (category) {
    html += `
      <button class="more-btn" onclick="showMoviesByCategory('${category}')">← Back to ${category}</button>
      <button class="more-btn" onclick="showNextMovies('${category}')">▶️ More ${category} Movies</button>
    `;
  } else {
    html += `
      <button class="more-btn" onclick="showCategoryMenu()">📚 Browse Categories</button>
      <button class="more-btn" onclick="showNextMovies()">🎲 Show More Random Movies</button>
    `;
  }
  
  appendMessage("ai", html);
}

// Show similar movies (by tags and theme)
function showSimilar(movieId) {
  const movie = allMovies.find(m => m.id === movieId);
  if (!movie) return;
  
  // Find similar movies by tags and theme (excluding current one)
  const similar = [...allMovies]
    .filter(m => m.id !== movieId)
    .sort((a, b) => {
      const aScore = a.tags.filter(tag => movie.tags.includes(tag)).length;
      const bScore = b.tags.filter(tag => movie.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, 3);
  
  let html = `<strong>🎬 Similar to ${movie.title}:</strong><br><small>Based on similar themes and tags</small>`;
  similar.forEach(m => {
    html += formatMovie(m);
  });
  
  html += `<button class="more-btn" onclick="showMoviesByCategory('${movie.category}')">📚 More ${movie.category} Movies</button>`;
  
  appendMessage("ai", html);
}

// Enhanced search suggestions
function suggestNotFound(searchTerm) {
  let html = `<strong>🔍 No exact match for "${searchTerm}". Try these:</strong><br>`;
  
  // 1. Show similar titles
  html += `<div class="suggestion-section"><small>Similar titles:</small><br>`;
  const similarTitles = allMovies
    .filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 3);
  
  if (similarTitles.length > 0) {
    similarTitles.forEach(movie => {
      html += `<span class="suggestion-btn" onclick="searchMovie('${movie.id}')">${movie.title}</span>`;
    });
  } else {
    html += `<span class="suggestion-btn" onclick="searchMovie('3 idiots')">3 Idiots</span>`;
    html += `<span class="suggestion-btn" onclick="searchMovie('taare zameen par')">Taare Zameen Par</span>`;
  }
  html += `</div>`;
  
  // 2. Show category suggestions
  html += `<div class="suggestion-section"><small>Browse categories:</small><br>`;
  allCategories.slice(0, 3).forEach(category => {
    html += `<span class="suggestion-btn" onclick="showMoviesByCategory('${category}')">${category}</span>`;
  });
  html += `</div>`;
  
  // 3. Show popular tags
  html += `<div class="suggestion-section"><small>Popular tags:</small><br>`;
  const popularTags = ["engineering", "iit", "upsc", "science", "mathematics"];
  popularTags.forEach(tag => {
    html += `<span class="suggestion-btn" onclick="searchMovie('${tag}')">#${tag}</span>`;
  });
  html += `</div>`;
  
  html += `<br><button class="more-btn" onclick="showCategoryMenu()">📚 Browse All Categories</button>`;
  
  return html;
}

// Enhanced search handler
function handleSearch() {
  const raw = input.value.trim().toLowerCase();
  if (!raw) return;

  appendMessage("user", raw);
  input.value = "";

  const typing = showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    
    const keyword = alternateNames[raw] || raw;
    
    // 1. Check for exact match
    const matchedMovie = allMovies.find(m => 
      m.id === keyword || 
      m.title.toLowerCase().includes(keyword) ||
      m.tags.includes(keyword)
    );

    // 2. Check for category match
    const matchedCategory = allCategories.find(c => 
      c.toLowerCase().includes(keyword)
    );

    if (matchedMovie) {
      appendMessage("ai", formatMovie(matchedMovie));
    } else if (matchedCategory) {
      showMoviesByCategory(matchedCategory);
    } else if (raw.includes("category") || raw.includes("type") || raw.includes("kind")) {
      showCategoryMenu();
    } else if (raw.includes("more") || raw.includes("next") || raw.includes("movie")) {
      showNextMovies();
    } else {
      appendMessage("ai", suggestNotFound(raw));
    }
  }, 800);
}

function searchMovie(name) {
  input.value = name;
  handleSearch();
}

// Make functions available globally
window.showNextMovies = showNextMovies;
window.showSimilar = showSimilar;
window.searchMovie = searchMovie;
window.showMoviesByCategory = showMoviesByCategory;
window.showCategoryMenu = showCategoryMenu;

button.addEventListener("click", handleSearch);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") handleSearch();
});

