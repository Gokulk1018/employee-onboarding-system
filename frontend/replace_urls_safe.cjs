const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        fs.statSync(dirPath).isDirectory() ? walk(dirPath, callback) : callback(dirPath);
    });
}

walk(path.join(__dirname, 'src'), function(filePath) {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix for absolute API mapping in api.js
    content = content.replace(/const API_URL = ['"`]http:\/\/localhost:5000\/api['"`];/g, 
        "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';");

    // Replace explicit string URLs with dynamic template literal ones, matching quotes appropriately
    // Pattern 1: Any string exactly 'http://localhost:5000/api'
    content = content.replace(/(['"`])http:\/\/localhost:5000\/api\1/g, 
        "(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')");

    // Pattern 2: Any string starting with 'http://localhost:5000/api' and something else
    content = content.replace(/(['"`])http:\/\/localhost:5000\/api([^'"`]*)\1/g, 
        "`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}$2`");

    // Pattern 3: Any root string starting with 'http://localhost:5000' (Not starting with /api)
    // Here we use (?!\/api) to negative lookahead
    content = content.replace(/(['"`])http:\/\/localhost:5000(?!\/api)([^'"`]*)\1/g, 
        "`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}$2`");

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', filePath);
    }
});
