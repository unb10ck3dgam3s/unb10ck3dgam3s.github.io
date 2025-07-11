const gamesData = Array.from(document.querySelectorAll('.game-list .img-link')).map(link => ({
    name: link.querySelector('.img-hover-text').textContent.trim(),
    url: link.getAttribute('href'),
    img: link.querySelector('img').getAttribute('src'),
    alt: link.querySelector('img').getAttribute('alt')
}));

function showSearchResults() {
    const input = document.getElementById('gameSearchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
    if (!input) {
        results.style.display = 'none';
        return;
    }
    let filtered = gamesData.filter(game => game.name.toLowerCase().includes(input));
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (filtered.length === 0) {
        results.style.display = 'none';
        return;
    }
    filtered.forEach(game => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.innerHTML = `<a href="${game.url}"><img src="${game.img}" alt="${game.alt}" class="search-result-icon">${game.name}</a>`;
        results.appendChild(li);
    });
    results.style.display = 'block';
}

// --- Universal Game Progress Save/Load ---
// Usage: saveProgress({level: 2, score: 100});
//        const progress = loadProgress();
(function() {
  if (window.location.pathname.includes('/games/')) {
    const GAME_ID = window.location.pathname.split('/').pop().replace('.html', '');
    window.saveProgress = function(progress) {
      localStorage.setItem('progress-' + GAME_ID, JSON.stringify(progress));
    };
    window.loadProgress = function() {
      const data = localStorage.getItem('progress-' + GAME_ID);
      return data ? JSON.parse(data) : null;
    };
  }
})();

// --- Fuzzy Search Helpers (Universal) ---
window.fuzzySearch = {
  levenshtein: function(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => []);
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        matrix[i][j] = a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
      }
    }
    return matrix[a.length][b.length];
  },
  scoredFuzzyFilter: function(games, query) {
    const q = query.trim().toLowerCase();
    return games.map(g => {
      const title = g.title.toLowerCase();
      if (title === q) return { g, score: 0 };
      if (title.includes(q)) return { g, score: 1 };
      const dist = window.fuzzySearch.levenshtein(title, q);
      if (dist <= 4) return { g, score: 2 + dist/10 };
      return { g, score: 99 };
    }).filter(x => x.score < 99)
      .sort((a, b) => a.score - b.score || a.g.title.localeCompare(b.g.title));
  }
};
