const fs = require('fs');
const path = require('path');

const gamesJsonPath = path.join(__dirname, 'games.json');
const templatePath = path.join(__dirname, 'ztemplate-game.html');
const outputDir = path.join(__dirname, 'games'); // Output to 'games' folder

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const games = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

for (const game of games) {
  // Use the correct fields from games.json
  const html = template
    .replace(/YOURGAMEHERE/g, game.game_url)
    .replace(/YOURLOGOHERE/g, game.game_image_icon)
    .replace(/Template Game/g, game.name)
    .replace(/YOURTITLEHERE/g, game.name)
    .replace(/YOURGAMEHERE Unblocked Online Games Play Now \|\| Unb10ck3dgam3s/g, `${game.name} Unblocked Online Games Play Now || Unb10ck3dgam3s`);
  const outPath = path.join(outputDir, `${game["game-id"]}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`Generated: ${outPath}`);
}
