#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the bump type from command line (patch, minor, major)
const bumpType = process.argv[2] || 'patch';

if (!['patch', 'minor', 'major'].includes(bumpType)) {
    console.error('Usage: node bump-version.js [patch|minor|major]');
    process.exit(1);
}

// Read app.json
const appJsonPath = path.join(__dirname, '..', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Get current version
const currentVersion = appJson.expo.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculate new version
let newVersion;
switch (bumpType) {
    case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
    case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
    case 'patch':
    default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
}

// Update app.json
appJson.expo.version = newVersion;
appJson.expo.android.versionCode = appJson.expo.android.versionCode + 1;
appJson.expo.ios.buildNumber = String(parseInt(appJson.expo.ios.buildNumber) + 1);

// Write back to app.json
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

console.log('✅ Version bumped!');
console.log(`   ${currentVersion} → ${newVersion}`);
console.log(`   Android versionCode: ${appJson.expo.android.versionCode}`);
console.log(`   iOS buildNumber: ${appJson.expo.ios.buildNumber}`);
console.log('');
console.log('Next steps:');
console.log('1. Review the changes');
console.log('2. Commit: git add app.json && git commit -m "Bump version to ' + newVersion + '"');
console.log('3. Tag: git tag v' + newVersion);
console.log('4. Build: make build-prod');

