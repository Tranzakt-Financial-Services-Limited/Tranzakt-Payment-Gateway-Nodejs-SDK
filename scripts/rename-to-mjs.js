const fs = require('fs');
const path = require('path');

function renameFilesInDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const directories = new Set();

    // First collect all directories
    for (const entry of entries) {
        if (entry.isDirectory()) {
            directories.add(entry.name);
            renameFilesInDir(path.join(dir, entry.name));
        }
    }

    // Then process files and update imports
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (!entry.isDirectory() && entry.name.endsWith('.js')) {
            // Update imports in JS files
            let content = fs.readFileSync(fullPath, 'utf8');

            // Handle imports differently based on whether they're directories or files
            content = content.replace(/from\s+["']([./][^"']+)(\.js)?["']/g, (match, importPath, ext) => {
                // Skip non-relative imports
                if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
                    return match;
                }

                // Get the base name of the import path
                const baseName = path.basename(importPath);
                const dirName = path.dirname(importPath);

                // Check if this is importing a directory
                if (directories.has(baseName)) {
                    return `from "${path.join(importPath, 'index.mjs')}"`;
                }

                // Otherwise treat as a file import
                return `from "${importPath}.mjs"`;
            });

            fs.writeFileSync(fullPath, content);

            // Rename the file after updating imports
            const newPath = fullPath.replace(/\.js$/, '.mjs');
            fs.renameSync(fullPath, newPath);
            console.log(`Renamed: ${fullPath} → ${newPath}`);
        }
    }
}

const esmDir = path.resolve(__dirname, '../dist/esm');
renameFilesInDir(esmDir);
console.log('Done: Renamed files and updated imports');