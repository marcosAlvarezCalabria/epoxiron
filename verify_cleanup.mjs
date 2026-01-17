
import fs from 'fs';
import path from 'path';

const FORBIDDEN_FILES = [
    'Rate.ts',
    'RateController.ts',
    'ratesStorage.ts',
    'RateRepository.ts',
    'RateMapper.ts',
    'CreateRateUseCase.ts',
    'UpdateRateUseCase.ts',
    'DeleteRateUseCase.ts'
];

function scan(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                scan(fullPath);
            }
        } else {
            if (FORBIDDEN_FILES.includes(file)) {
                console.error(`❌ FOUND FORBIDDEN FILE: ${fullPath}`);
                process.exit(1);
            }
        }
    }
}

console.log('🔍 Scanning for obsolete Rate files...');
try {
    scan(process.cwd());
    console.log('✅ No obsolete Rate files found!');
} catch (e) {
    console.error('Error scanning:', e);
}
