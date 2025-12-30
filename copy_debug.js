const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\EiE20240108\\Desktop\\랜딩페이지\\source';
const dest = 'C:\\Users\\EiE20240108\\Desktop\\랜딩페이지\\assets\\strength\\community_mosaic.jpg';

try {
    console.log(`Scanning directory: ${srcDir}`);
    const files = fs.readdirSync(srcDir);
    console.log('Files found:', files);

    const targetFile = files.find(f => f.includes('모자이크'));

    if (targetFile) {
        const srcPath = path.join(srcDir, targetFile);
        console.log(`Found file: ${srcPath}`);
        fs.copyFileSync(srcPath, dest);
        console.log(`Successfully copied to ${dest}`);
    } else {
        console.error('ERROR: No file containing "모자이크" found in source directory.');
        console.log('Available files:', files);
    }
} catch (err) {
    console.error('An error occurred:', err);
}
