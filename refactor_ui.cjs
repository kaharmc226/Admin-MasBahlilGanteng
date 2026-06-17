const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace large paddings
  content = content.replace(/padding:\s*['"]3rem\s*2\.5rem['"]/g, "padding: '1.5rem'");
  content = content.replace(/padding:\s*['"]2\.5rem['"]/g, "padding: '1.5rem'");
  content = content.replace(/padding:\s*['"]2rem\s*3rem['"]/g, "padding: '1.5rem'");
  content = content.replace(/padding:\s*['"]3\.5rem\s*3rem['"]/g, "padding: '1.5rem 2rem'");
  content = content.replace(/padding:\s*['"]3rem['"]/g, "padding: '1.5rem'");
  content = content.replace(/padding:\s*['"]2rem['"]/g, "padding: '1rem'");
  content = content.replace(/padding:\s*['"]1\.5rem\s*2\.5rem['"]/g, "padding: '1rem 1.5rem'");

  // Replace large margins
  content = content.replace(/marginBottom:\s*['"]3\.5rem['"]/g, "marginBottom: '1.5rem'");
  content = content.replace(/marginBottom:\s*['"]3rem['"]/g, "marginBottom: '1.5rem'");
  content = content.replace(/marginBottom:\s*['"]2\.5rem['"]/g, "marginBottom: '1.5rem'");
  content = content.replace(/marginBottom:\s*['"]2rem['"]/g, "marginBottom: '1rem'");
  content = content.replace(/marginTop:\s*['"]5rem['"]/g, "marginTop: '2rem'");
  content = content.replace(/marginTop:\s*['"]4rem['"]/g, "marginTop: '1.5rem'");
  content = content.replace(/gap:\s*['"]2rem['"]/g, "gap: '1rem'");
  content = content.replace(/gap:\s*['"]1\.5rem['"]/g, "gap: '1rem'");

  // Replace huge border radiuses
  content = content.replace(/borderRadius:\s*['"]35px['"]/g, "borderRadius: '16px'");
  content = content.replace(/borderRadius:\s*['"]32px['"]/g, "borderRadius: '16px'");
  content = content.replace(/borderRadius:\s*['"]40px['"]/g, "borderRadius: '16px'");
  content = content.replace(/borderRadius:\s*['"]45px['"]/g, "borderRadius: '16px'");
  content = content.replace(/borderRadius:\s*['"]30px['"]/g, "borderRadius: '12px'");
  content = content.replace(/borderRadius:\s*['"]28px['"]/g, "borderRadius: '12px'");
  content = content.replace(/borderRadius:\s*['"]24px['"]/g, "borderRadius: '12px'");
  content = content.replace(/borderRadius:\s*['"]20px['"]/g, "borderRadius: '8px'");
  content = content.replace(/borderRadius:\s*['"]50px['"]/g, "borderRadius: '24px'");

  fs.writeFileSync(filePath, content, 'utf8');
}

const pagesDir = path.join(__dirname, 'src', 'pages');
fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.jsx')) {
    processFile(path.join(pagesDir, file));
  }
});

console.log('UI refactoring applied.');
