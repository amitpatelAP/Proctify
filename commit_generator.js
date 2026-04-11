const { execSync } = require('child_process');
const fs = require('fs');

console.log('Generating 80 commits for 2026...');

const startDate = new Date('2026-01-01T10:00:00Z').getTime();
const endDate = new Date('2026-06-30T10:00:00Z').getTime();

for (let i = 1; i <= 80; i++) {
    // Generate random date between Jan 1 and June 30 2026
    const randomTime = startDate + Math.random() * (endDate - startDate);
    const dateStr = new Date(randomTime).toISOString();
    
    fs.appendFileSync('activity.txt', `Activity log ${i} at ${dateStr}\n`);
    
    execSync('git add activity.txt');
    execSync(`git commit -m "Update activity log ${i}"`, {
        env: {
            ...process.env,
            GIT_AUTHOR_DATE: dateStr,
            GIT_COMMITTER_DATE: dateStr
        }
    });
}

console.log('Finished generating commits!');
