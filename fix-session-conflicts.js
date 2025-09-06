const fs = require('fs');
const path = require('path');

// Find all TypeScript files in the app directory
function findTSXFiles(dir, results = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            findTSXFiles(fullPath, results);
        } else if (item.endsWith('.tsx')) {
            results.push(fullPath);
        }
    }
    
    return results;
}

// Fix session conflicts in a file
function fixSessionConflict(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to find the line causing the session conflict
    const sessionPattern = /const \{ ([^}]+), session \} = useRoleAuthorization\(/;
    
    const fixedContent = content.replace(sessionPattern, (match, destructuredProps) => {
        // Check if 'session' is already in destructuredProps
        if (destructuredProps.includes('session')) {
            // Replace with a unique session name
            return match.replace('session', 'roleSession');
        }
        return match;
    });
    
    // Also need to update references to session within the file
    const updatedContent = fixedContent.replace(/session: ?userSession/g, 'session: ?roleSession');
    const finalContent = updatedContent.replace(/\broleSession\b/g, 'session');
    
    return finalContent === content ? null : finalContent;
}

// Process all files
const tsxFiles = findTSXFiles('src/app');
let totalFixed = 0;

tsxFiles.forEach(file => {
    const fixedContent = fixSessionConflict(file);
    if (fixedContent) {
        fs.writeFileSync(file, fixedContent, 'utf8');
        console.log(`Fixed: ${file}`);
        totalFixed++;
    }
});

console.log(`\nSummary: Fixed ${totalFixed} files with session conflicts`);
