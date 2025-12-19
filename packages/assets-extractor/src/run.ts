import {
  getMinecraftVersion,
  downloadClient,
  generateExportFiles,
  fetchVersionMetadata,
  extractAssets,
  type ExtractAssetsResult,
} from './index';

const minecraftVersion: string = process.argv[2] || 'latest';
const uiPackagePath: string = process.argv[3] || '../../packages/ui';

console.log(`Fetching Minecraft version: ${minecraftVersion}`);
const version = await getMinecraftVersion(minecraftVersion);
console.log(`Found version: ${version.id} (${version.type})`);

console.log('Fetching version metadata...');
const versionMetadata = await fetchVersionMetadata(version);
console.log('Version metadata fetched');

console.log('Downloading client JAR...');
const jarData = await downloadClient(versionMetadata);
console.log(`Downloaded ${(jarData.byteLength / 1024 / 1024).toFixed(2)} MB`);

console.log(`Extracting assets to: ${uiPackagePath}/assets`);
const result: ExtractAssetsResult = await extractAssets({
  jarData,
  versionMetadata,
  uiPackagePath,
});

if (!result.clientExtracted) {
  console.error('Failed to extract assets from client');
  process.exit(1);
}

if (!result.webExtracted) {
  console.error('Failed to extract assets from web');
  process.exit(1);
}

console.log('Generating export files...');
await generateExportFiles(uiPackagePath);

console.log('Done!');
