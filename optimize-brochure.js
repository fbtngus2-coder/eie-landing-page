import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const brochureDir = join(__dirname, 'public', 'brochure');

async function optimizeImages() {
    try {
        const files = await readdir(brochureDir);
        const jpgFiles = files.filter(file => file.endsWith('.jpg'));

        console.log(`📸 총 ${jpgFiles.length}개의 이미지를 최적화합니다...`);

        for (const file of jpgFiles) {
            const inputPath = join(brochureDir, file);
            const outputPath = join(brochureDir, file);

            console.log(`🔄 처리중: ${file}`);

            // 이미지를 최적화 (품질 80%, 최대 폭 1200px)
            await sharp(inputPath)
                .resize(1200, null, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({
                    quality: 80,
                    progressive: true
                })
                .toFile(outputPath + '.tmp');

            // 임시 파일을 원본으로 교체
            const fs = await import('fs/promises');
            await fs.rename(outputPath + '.tmp', outputPath);

            console.log(`✅ 완료: ${file}`);
        }

        console.log('\n🎉 모든 이미지 최적화가 완료되었습니다!');
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

optimizeImages();
