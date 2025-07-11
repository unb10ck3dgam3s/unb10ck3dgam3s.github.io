const fs = require('fs');
const path = require('path');

const gamesJsonPath = path.join(__dirname, 'games', 'games.json');
const scriptFile = path.join(__dirname, 'script.js');

const games = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));
const names = games.map(game => game.name);

let js = fs.readFileSync(scriptFile, 'utf8');

js = js.replace(
  /const suggestions = \[[\s\S]*?\];/,
  'const suggestions = [\n' +
    names.map(n => `  ${JSON.stringify(n)}`).join(',\n') +
  '\n];'
);

fs.writeFileSync(scriptFile, js);
console.log('Updated suggestions array in script.js');
