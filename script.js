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

document.addEventListener('click', function(e) {
    const results = document.getElementById('searchResults');
    if (!results) return;
    if (!results.contains(e.target) && e.target.id !== 'gameSearchInput') {
        results.style.display = 'none';
    }
});