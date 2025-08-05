// edu.js - Updated to fetch movie data from JSON
let allMovies = [];
let alternateNames = {};
let categoryDescriptions = {};
let shuffledMovies = [];

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");

let currentIndex = 0;

// Fetch movie data from JSON file
async function loadMovieData() {
  try {
    const response = await fetch('edu.json');
    if (!response.ok) {
      throw new Error('Failed to load movie data');
    }
    const data = await response.json();
    
    // Initialize data
    allMovies = data.movies || [];
    alternateNames = data.alternateNames || {};
    categoryDescriptions = data.categoryDescriptions || {};
    shuffledMovies = [...allMovies];
    
    // Shuffle movies after loading
    shuffleArray(shuffledMovies);
    
    // Show welcome message after data is loaded
    showWelcomeMessage();
  } catch (error) {
    console.error('Error loading movie data:', error);
    appendMessage("ai", "⚠️ Error loading movie data. Please try refreshing the page.");
  }
}

// Shuffle array function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Show welcome message after data is loaded
function showWelcomeMessage() {
  appendMessage("ai", `👋 Welcome to <strong>Educational Movie AI</strong><br>
    <small>Discover films that educate, inspire, and transform</small><br><br>
    
    <strong>Quick Access:</strong><br>
    <span class="suggestion-btn" onclick="searchMovie('3 idiots')">3 Idiots</span>
    <span class="suggestion-btn" onclick="searchMovie('taare zameen par')">Taare Zameen Par</span>
    <span class="suggestion-btn" onclick="searchMovie('super 30')">Super 30</span>
    <span class="suggestion-btn" onclick="searchMovie('dangal')">Dangal</span><br><br>
    
    <button class="category-btn" onclick="showCategoryMenu()">📚 Browse Categories</button>
    <button class="more-btn" onclick="showNextMovies()">🎲 Show Random Movies</button>`);
}

// Helper function to append messages (same as in edu1.js)
function appendMessage(sender, html) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}-message`;
  msg.innerHTML = html;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Load movie data when the page loads
document.addEventListener('DOMContentLoaded', loadMovieData);