const fs = require('fs');
const path = require('path');

const gamesJsonPath = path.join(__dirname, 'games', 'games.json');
const gamesDir = path.join(__dirname, 'games');
const resultsFile = path.join(__dirname, 'results.html');

const games = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));

// Helper to find the HTML file for a game by name (case-insensitive, spaces and dashes normalized)
function findHtmlFile(gameName) {
  const files = fs.readdirSync(gamesDir).filter(f => f.endsWith('.html'));
  const normalized = s => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  const target = normalized(gameName);
  // Try exact match
  let file = files.find(f => normalized(f.replace('.html','')) === target);
  if (file) return `/games/${file}`;
  // Fallback: partial match
  file = files.find(f => normalized(f).includes(target));
  return file ? `/games/${file}` : '#';
}

const gameObjs = games.map(game => ({
  title: game.name,
  img: game.game_image_icon,
  url: findHtmlFile(game.name)
}));

// Read results.html
let html = fs.readFileSync(resultsFile, 'utf8');

// Replace the games array in the script
html = html.replace(
  /const games = \[[\s\S]*?\];/,
  'const games = [\n' +
    gameObjs.map(g => `    { title: ${JSON.stringify(g.title)}, img: ${JSON.stringify(g.img)}, url: ${JSON.stringify(g.url)} }`).join(',\n') +
  '\n];'
);

fs.writeFileSync(resultsFile, html);
console.log('Updated games array in results.html');
