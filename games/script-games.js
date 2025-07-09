// Only run this if on a game page (not index)
    if (window.location.pathname.indexOf('index.html') === -1) {
        // Fetch the index.html and extract games for search
        fetch('../index.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('.game-list .img-link');
                window.gamesData = Array.from(links).map(link => ({
                    name: link.querySelector('.img-hover-text').textContent.trim(),
                    url: link.getAttribute('href'),
                    img: link.querySelector('img').getAttribute('src'),
                    alt: link.querySelector('img').getAttribute('alt')
                }));
            });
        window.showSearchResults = function() {
            const input = document.getElementById('gameSearchInput').value.toLowerCase();
            const results = document.getElementById('searchResults');
            results.innerHTML = '';
            if (!input || !window.gamesData) {
                results.style.display = 'none';
                return;
            }
            let filtered = window.gamesData.filter(game => game.name.toLowerCase().includes(input));
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
        };
        document.addEventListener('click', function(e) {
            const results = document.getElementById('searchResults');
            if (!results) return;
            if (!results.contains(e.target) && e.target.id !== 'gameSearchInput') {
                results.style.display = 'none';
            }
        });
    }

            function fullscreenIframe() {
            const iframe = document.getElementById('gameFrame');
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        }

        
      // --- Search Bar Logic (redirects to results page) ---
      document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const val = document.getElementById('gameSearchInput').value.trim();
        if (val) {
            // Always use absolute path for results page
            window.location.href = `/results.html?q=${encodeURIComponent(val)}`;
        }
      });