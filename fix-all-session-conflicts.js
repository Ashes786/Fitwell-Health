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
    let content = fs.readFileSync(filePath, 'utf8');
    let wasFixed = false;
    
    // Pattern to find the line causing the session conflict
    const sessionPattern = /const \{ ([^}]+), session \} = useRoleAuthorization\(/;
    
    // Check if there's already a useSession import
    const hasUseSession = content.includes('useSession');
    
    if (hasUseSession) {
        // Replace conflicting session variable
        const fixedContent = content.replace(sessionPattern, (match, destructuredProps) => {
            return match.replace('session', 'roleSession');
        });
        
        // Update any references to the conflicting session
        const updatedContent = fixedContent.replace(/\broleSession\b/g, 'userSession');
        
        if (updatedContent !== content) {
            content = updatedContent;
            wasFixed = true;
        }
    }
    
    return wasFixed ? content : null;
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

// Also fix any remaining files individually
const remainingFiles = [
    'src/app/dashboard/doctor/prescriptions/page.tsx',
    'src/app/dashboard/doctor/schedule/page.tsx',
    'src/app/dashboard/patient/appointments/page.tsx',
    'src/app/dashboard/patient/health-records/page.tsx',
    'src/app/dashboard/patient/book-appointment/page.tsx',
    'src/app/dashboard/patient/billing/page.tsx',
    'src/app/dashboard/patient/vitals/page.tsx',
    'src/app/dashboard/patient/ai-reports/page.tsx',
    'src/app/dashboard/admin/users/page.tsx',
    'src/app/dashboard/admin/users/[id]/page.tsx',
    'src/app/dashboard/admin/subscription-plans/page.tsx',
    'src/app/dashboard/admin/partners/page.tsx',
    'src/app/dashboard/super-admin/system-status/page.tsx',
    'src/app/dashboard/super-admin/security/page.tsx',
    'src/app/dashboard/super-admin/subscription-requests/page.tsx',
    'src/app/dashboard/super-admin/partners/page.tsx',
    'src/app/dashboard/super-admin/subscription-plans/page.tsx',
    'src/app/dashboard/super-admin/notifications/page.tsx',
    'src/app/dashboard/super-admin/analytics/page.tsx',
    'src/app/dashboard/super-admin/admins/page.tsx',
    'src/app/dashboard/control-room/doctor-assignment/page.tsx'
];

remainingFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const fixedContent = fixSessionConflict(file);
        if (fixedContent) {
            fs.writeFileSync(file, fixedContent, 'utf8');
            console.log(`Fixed: ${file}`);
            totalFixed++;
        }
    }
});

console.log(`\nFinal Summary: Fixed ${totalFixed} files with session conflicts`);
