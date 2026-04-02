const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const dir = path.join(__dirname, 'src');

walk(dir, function(filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Replace http://localhost:5000/api with ${import.meta.env.VITE_API_URL} if it's in a template literal, 
        // or import.meta.env.VITE_API_URL if it's a string.
        // It's safer to just replace 'http://localhost:5000/api' with import.meta.env.VITE_API_URL
        // and 'http://localhost:5000' with import.meta.env.VITE_API_URL?.replace('/api', '') (or similar).
        // Let's analyze common patterns: 
        // 1. `http://localhost:5000/api/...` -> `${import.meta.env.VITE_API_URL}/...`
        // 2. 'http://localhost:5000/api' -> import.meta.env.VITE_API_URL
        
        const newApiUrlStr = "import.meta.env.VITE_API_URL || 'http://localhost:5000/api'";

        // Standard string replacement for base url definition (like in api.js)
        if (content.includes("'http://localhost:5000/api'")) {
            content = content.replace(/'http:\/\/localhost:5000\/api'/g, newApiUrlStr);
            modified = true;
        }

        if (content.includes('"http://localhost:5000/api"')) {
            content = content.replace(/"http:\/\/localhost:5000\/api"/g, newApiUrlStr);
            modified = true;
        }
        
        // Template strings `http://localhost:5000/api/${id}`
        if (content.includes("`http://localhost:5000/api")) {
            content = content.replace(/`http:\/\/localhost:5000\/api/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}");
            modified = true;
        }

        // For non-api routes (like raw /uploads/ endpoints or other things)
        if (content.includes("'http://localhost:5000/")) {
            content = content.replace(/'http:\/\/localhost:5000\//g, "`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}/");
            modified = true;
        }
        if (content.includes('"http://localhost:5000/')) {
            content = content.replace(/"http:\/\/localhost:5000\//g, "`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}/");
            modified = true;
        }
        if (content.includes("`http://localhost:5000/")) {
             content = content.replace(/`http:\/\/localhost:5000\//g, "`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}/");
             modified = true;
        }

        // Catch edge cases like 'http://localhost:5000' (no trailing slash)
        if (content.includes("'http://localhost:5000'")) {
             content = content.replace(/'http:\/\/localhost:5000'/g, "(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000')");
             modified = true;
        }
        if (content.includes('"http://localhost:5000"')) {
             content = content.replace(/"http:\/\/localhost:5000"/g, "(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000')");
             modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Modified:', filePath);
        }
    }
});
