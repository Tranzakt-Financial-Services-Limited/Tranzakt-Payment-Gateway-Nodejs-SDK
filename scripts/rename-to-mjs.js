const fs = require('fs');
const path = require('path');

function renameFilesInDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // First pass: Update imports in all JS files before renaming
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            renameFilesInDir(fullPath);
        } else if (entry.name.endsWith('.js')) {
            // Update imports in JS files
            let content = fs.readFileSync(fullPath, 'utf8');

            // Handle both explicit .js extensions and extension-less imports
            content = content.replace(/from\s+["']([./][^"']+)(\.js)?["']/g, (match, importPath, ext) => {
                // Skip node_modules imports and absolute imports
                if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
                    return match;
                }
                return `from "${importPath}.mjs"`;
            });

            fs.writeFileSync(fullPath, content);
        }
    }

    // Second pass: Rename the files after updating imports
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (!entry.isDirectory() && entry.name.endsWith('.js')) {
            const newPath = fullPath.replace(/\.js$/, '.mjs');
            fs.renameSync(fullPath, newPath);
            console.log(`Renamed: ${fullPath} → ${newPath}`);
        }
    }
}

renameFilesInDir(path.resolve(__dirname, '../dist/esm'));
console.log('Done: Renamed files and updated imports');