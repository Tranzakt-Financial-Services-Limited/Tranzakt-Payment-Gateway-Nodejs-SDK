const fs = require('fs');
const path = require('path');

function renameFilesInDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            renameFilesInDir(fullPath);
        } else if (entry.name.endsWith('.js')) {
            const newPath = fullPath.replace(/\.js$/, '.mjs');
            fs.renameSync(fullPath, newPath);

            // Update imports in the file
            let content = fs.readFileSync(newPath, 'utf8');
            content = content.replace(/from ["'](.+?)\.js["']/g, 'from "$1.mjs"');
            fs.writeFileSync(newPath, content);
        }
    }
}

renameFilesInDir(path.resolve(__dirname, '../dist/esm'));