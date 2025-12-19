import { fetchBinary, fetchJson } from './utils';
import yauzl from 'yauzl';
import path from 'path';
import fs from 'fs';

type LatestVersion = {
  release: string;
  snapshot: string;
};

type Version = {
  id: string;
  type: 'release' | 'snapshot';
  url: string;
};

type VersionManifest = {
  latest: LatestVersion;
  versions: Version[];
};

type VersionMetadata = {
  downloads: {
    client: {
      url: string;
      size: number;
      sha1: string;
    };
  };
  assetIndex: {
    url: string;
  };
};

export async function getMinecraftVersion(
  minecraftVersion: string
): Promise<Version> {
  const versionsUrl: string =
    'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';
  const versionsData: VersionManifest = await fetchJson<VersionManifest>(
    versionsUrl
  );

  if (minecraftVersion === 'latest') {
    minecraftVersion = versionsData.latest.release;
  }

  const version: Version | undefined = versionsData.versions.find(
    (v: Version): boolean => v.id === minecraftVersion
  );
  if (!version) {
    throw new Error(`No version found for ${minecraftVersion}`);
  }

  return version;
}

export async function fetchVersionMetadata(
  version: Version
): Promise<VersionMetadata> {
  if (!version.url) {
    throw new Error(`No url found for ${version.id}`);
  }

  const versionMetadata: VersionMetadata = await fetchJson<VersionMetadata>(
    version.url
  );
  return versionMetadata;
}

export async function downloadClient(
  versionMetadata: VersionMetadata
): Promise<ArrayBuffer> {
  if (!versionMetadata.downloads.client.url) {
    throw new Error(`No client download found`);
  }

  const clientJarResponse: ArrayBuffer = await fetchBinary(
    versionMetadata.downloads.client.url
  );
  return clientJarResponse;
}

type AssetObject = {
  hash: string;
};

type Assets = {
  objects: Record<string, AssetObject>;
};

type SoundAsset = {
  assetPath: string;
  url: string;
};

export async function extractSounds(
  versionMetadata: VersionMetadata
): Promise<SoundAsset[]> {
  if (!versionMetadata.assetIndex.url) {
    throw new Error(`No asset index url found`);
  }

  const assetsData: Assets = await fetchJson<Assets>(
    versionMetadata.assetIndex.url
  );

  const assets: SoundAsset[] = Object.entries(assetsData.objects).flatMap(
    ([assetPath, asset]: [string, AssetObject]): SoundAsset[] => {
      if (!assetPath.startsWith('minecraft/sounds/')) {
        return [];
      }

      return [
        {
          assetPath,
          url: `https://resources.download.minecraft.net/${asset.hash.slice(
            0,
            2
          )}/${asset.hash}`,
        },
      ];
    }
  );

  return assets;
}

export async function extractAssetsFromClient(
  jarData: ArrayBuffer,
  uiPackagePath: string
): Promise<boolean> {
  if (!uiPackagePath) {
    throw new Error('uiPackagePath is required');
  }

  const assetsPath: string = `${uiPackagePath}/assets`;
  const buffer: Buffer = Buffer.from(jarData);

  return new Promise<boolean>(
    (
      resolve: (value: boolean) => void,
      reject: (reason: Error) => void
    ): void => {
      let extractedCount: number = 0;

      yauzl.fromBuffer(
        buffer,
        { lazyEntries: true },
        (err: Error | null, zipfile: yauzl.ZipFile | undefined): void => {
          if (err) {
            return reject(new Error(`Error extracting assets: ${err}`));
          }

          if (!zipfile) {
            return reject(new Error('Failed to open zipfile'));
          }

          zipfile.readEntry();

          zipfile.on('entry', (entry: yauzl.Entry): void => {
            if (/\/$/.test(entry.fileName)) {
              zipfile.readEntry();
            } else {
              const targetPath: string = 'assets/minecraft/textures/';

              if (
                entry.fileName.startsWith(`${targetPath}item/`) ||
                entry.fileName.startsWith(`${targetPath}block/`)
              ) {
                zipfile.openReadStream(
                  entry,
                  (
                    err: Error | null,
                    readStream: NodeJS.ReadableStream | undefined
                  ): void => {
                    if (err) {
                      return reject(
                        new Error(`Error opening read stream: ${err}`)
                      );
                    }

                    if (!readStream) {
                      return reject(new Error('Failed to open read stream'));
                    }

                    const relativePath: string = entry.fileName.slice(
                      targetPath.length
                    );
                    const outputPath: string = path.join(
                      assetsPath,
                      relativePath
                    );

                    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

                    const writeStream: fs.WriteStream =
                      fs.createWriteStream(outputPath);

                    writeStream.on('finish', (): void => {
                      extractedCount++;
                      zipfile.readEntry();
                    });

                    writeStream.on('error', (err: Error): void => {
                      reject(new Error(`Error writing file: ${err}`));
                    });

                    readStream.on('error', (err: Error): void => {
                      reject(new Error(`Error reading stream: ${err}`));
                    });

                    readStream.pipe(writeStream);
                  }
                );
              } else {
                zipfile.readEntry();
              }
            }
          });

          zipfile.on('end', (): void => {
            resolve(extractedCount > 0);
          });

          zipfile.on('error', (err: Error): void => {
            reject(new Error(`Zipfile error: ${err}`));
          });
        }
      );
    }
  );
}

export async function extractAssetsFromWeb(
  versionMetadata: VersionMetadata,
  uiPackagePath: string
): Promise<boolean> {
  if (!versionMetadata.assetIndex.url) {
    throw new Error(`No asset index url found`);
  }

  const assetsPath: string = `${uiPackagePath}/assets`;
  fs.mkdirSync(assetsPath, { recursive: true });

  const assets: SoundAsset[] = await extractSounds(versionMetadata);
  for (const asset of assets) {
    const relativePath: string = asset.assetPath.replace('minecraft/', '');
    const destinationPath: string = `${assetsPath}/${relativePath}`;

    const parentDir: string = path.dirname(destinationPath);
    fs.mkdirSync(parentDir, { recursive: true });

    const assetData: ArrayBuffer = await fetchBinary(asset.url);
    fs.writeFileSync(destinationPath, Buffer.from(assetData));
  }

  return true;
}

export type ExtractAssetsOptions = {
  jarData: ArrayBuffer;
  versionMetadata: VersionMetadata;
  uiPackagePath: string;
};

export type ExtractAssetsResult = {
  clientExtracted: boolean;
  webExtracted: boolean;
};

export async function extractAssets(
  options: ExtractAssetsOptions
): Promise<ExtractAssetsResult> {
  const { jarData, versionMetadata, uiPackagePath } = options;

  const [clientExtracted, webExtracted]: [boolean, boolean] = await Promise.all(
    [
      extractAssetsFromClient(jarData, uiPackagePath),
      extractAssetsFromWeb(versionMetadata, uiPackagePath),
    ]
  );

  return {
    clientExtracted,
    webExtracted,
  };
}

function toExportName(filename: string, extension: string = '.png'): string {
  return filename
    .replace(new RegExp(`${extension.replace('.', '\\.')}$`), '')
    .replace(/-/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_');
}

function toSoundExportName(relativePath: string): string {
  return relativePath
    .replace(/\.ogg$/, '')
    .replace(/\//g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_');
}

function encodeImageToBase64(filePath: string): string {
  const file: Buffer = fs.readFileSync(filePath);
  const base64: string = file.toString('base64');
  return `data:image/png;base64,${base64}`;
}

function scanPngFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter((f) => f.endsWith('.png'));
}

function scanOggFilesRecursive(dir: string, basePath: string = ''): string[] {
  const results: string[] = [];
  const entries: fs.Dirent[] = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath: string = basePath
      ? `${basePath}/${entry.name}`
      : entry.name;
    if (entry.isDirectory()) {
      results.push(
        ...scanOggFilesRecursive(`${dir}/${entry.name}`, relativePath)
      );
    } else if (entry.name.endsWith('.ogg')) {
      results.push(relativePath);
    }
  }

  return results;
}

export async function generateExportFiles(
  uiPackagePath: string
): Promise<void> {
  const itemsDir: string = `${uiPackagePath}/assets/item`;
  const blocksDir: string = `${uiPackagePath}/assets/block`;
  const soundsDir: string = `${uiPackagePath}/assets/sounds`;

  const itemFiles: string[] = scanPngFiles(itemsDir);
  const itemExports: string[] = [];
  for (const f of itemFiles) {
    const name: string = toExportName(f);
    const base64: string = encodeImageToBase64(`${itemsDir}/${f}`);
    itemExports.push(`export const ${name} = '${base64}';`);
  }
  const itemNames: string = itemFiles
    .map((f: string): string => `'${toExportName(f)}'`)
    .join('\n  | ');
  const itemsContent: string = `${itemExports.join('\n')}

export type ItemName =
  | ${itemNames};
`;
  fs.writeFileSync(`${uiPackagePath}/src/items.ts`, itemsContent);
  console.log(`Generated items.ts with ${itemExports.length} Base64 exports`);

  const blockFiles: string[] = scanPngFiles(blocksDir);
  const blockExports: string[] = [];
  for (const f of blockFiles) {
    const name: string = toExportName(f);
    const base64: string = encodeImageToBase64(`${blocksDir}/${f}`);
    blockExports.push(`export const ${name} = '${base64}';`);
  }
  const blockNames: string = blockFiles
    .map((f: string): string => `'${toExportName(f)}'`)
    .join('\n  | ');
  const blocksContent: string = `${blockExports.join('\n')}

export type BlockName =
  | ${blockNames};
`;
  fs.writeFileSync(`${uiPackagePath}/src/blocks.ts`, blocksContent);
  console.log(`Generated blocks.ts with ${blockExports.length} Base64 exports`);

  const GITHUB_RAW_BASE: string =
    'https://raw.githubusercontent.com/Xefreh/minecraft-assets-react/main/packages/ui/assets/sounds';

  const soundFiles: string[] = scanOggFilesRecursive(soundsDir);
  const soundsDir2: string = `${uiPackagePath}/src/sounds`;
  fs.mkdirSync(soundsDir2, { recursive: true });

  for (const f of soundFiles) {
    const name: string = toSoundExportName(f);
    const url: string = `${GITHUB_RAW_BASE}/${f}`;
    const content: string = `const ${name} = '${url}';\nexport default ${name};\n`;
    fs.writeFileSync(`${soundsDir2}/${name}.ts`, content);
  }

  const soundExports: string[] = soundFiles.map((f: string): string => {
    const name: string = toSoundExportName(f);
    return `export { default as ${name} } from './${name}';`;
  });
  const soundNames: string = soundFiles
    .map((f: string): string => `'${toSoundExportName(f)}'`)
    .join('\n  | ');
  const soundsIndexContent: string = `// Sounds are loaded from GitHub - import individually for tree-shaking
${soundExports.join('\n')}

export type SoundName =
  | ${soundNames};
`;
  fs.writeFileSync(`${soundsDir2}/index.ts`, soundsIndexContent);

  console.log(
    `Generated ${soundFiles.length} individual sound modules in src/sounds/ (GitHub URLs)`
  );
}
