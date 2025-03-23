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

            // First update the content before renaming
            let content = fs.readFileSync(fullPath, 'utf8');

            // Fix import paths to include .mjs extension
            content = content.replace(/from\s+["']([^"']+)["']/g, (match, importPath) => {
                // Leave absolute imports or node_module imports unchanged
                if (!importPath.startsWith('.') && !importPath.includes('/')) {
                    return match;
                }

                // If it's a relative path without ./ prefix, add it
                if (importPath.startsWith('types/') ||
                    importPath.startsWith('services/') ||
                    importPath.startsWith('utils/') ||
                    importPath.startsWith('config/')) {
                    importPath = './' + importPath;
                }

                // Add .mjs extension if not already present
                if (!importPath.endsWith('.mjs') && !importPath.endsWith('.js')) {
                    // Check if the import is likely a directory (no file extension)
                    if (!path.extname(importPath)) {
                        // Append /index.mjs if it seems to be a directory
                        return `from "${importPath}/index.mjs"`;
                    }

                    return `from "${importPath}.mjs"`;
                } else if (importPath.endsWith('.js')) {
                    // Convert .js extension to .mjs
                    return `from "${importPath.replace(/\.js$/, '.mjs')}"`;
                }

                return `from "${importPath}"`;
            });

            // Write updated content and rename the file
            fs.writeFileSync(fullPath, content);
            fs.renameSync(fullPath, newPath);
        }
    }
}

const esmDir = path.resolve(__dirname, '../dist/esm');
renameFilesInDir(esmDir);
console.log('Successfully renamed .js to .mjs and updated imports');