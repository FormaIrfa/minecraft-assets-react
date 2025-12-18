import { generateExportFiles } from './index';

const uiPackagePath = process.argv[2] || './packages/ui';

console.log('Regenerating export files with Base64 images...');
await generateExportFiles(uiPackagePath);

console.log('Done!');
