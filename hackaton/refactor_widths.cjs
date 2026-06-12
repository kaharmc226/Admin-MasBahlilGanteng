const fs = require('fs');
const path = require('path');
const d = path.join(__dirname, 'src', 'pages');
fs.readdirSync(d).forEach(f => {
  if(f.endsWith('.jsx')) {
    let c = fs.readFileSync(path.join(d,f), 'utf8');
    c = c.replace(/maxWidth:\s*['"]500px['"]/g, "maxWidth: '400px'");
    c = c.replace(/maxWidth:\s*['"]900px['"]/g, "maxWidth: '700px'");
    fs.writeFileSync(path.join(d,f), c, 'utf8');
  }
});
console.log('Width refactoring applied.');
