import {
  getMinecraftVersion,
  downloadClient,
  extractAssets,
  generateExportFiles,
} from './index';

const minecraftVersion = process.argv[2] || 'latest';
const uiPackagePath = process.argv[3] || './packages/ui';

console.log(`Fetching Minecraft version: ${minecraftVersion}`);
const version = await getMinecraftVersion(minecraftVersion);
console.log(`Found version: ${version.id} (${version.type})`);

console.log('Downloading client JAR...');
const jarData = await downloadClient(version);
console.log(`Downloaded ${(jarData.byteLength / 1024 / 1024).toFixed(2)} MB`);

console.log(`Extracting assets to: ${uiPackagePath}/assets`);
await extractAssets(jarData, uiPackagePath);

console.log('Generating export files...');
await generateExportFiles(uiPackagePath);

console.log('Done!');
