type LatestVersion = {
  release: string;
  snapshot: string;
};

type Version = {
  id: string;
  type: 'release' | 'snapshot';
  url: string;
};

type DownloadClientData = {
  downloads: {
    client: {
      sha1: string;
      size: number;
      url: string;
    };
  };
};

export async function getMinecraftVersion(minecraftVersion: string) {
  const versionsUrl =
    'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';
  const versionsResponse = await fetch(versionsUrl);
  const versionsData = (await versionsResponse.json()) as {
    latest: LatestVersion;
    versions: Version[];
  };

  if (minecraftVersion === 'latest') {
    minecraftVersion = versionsData.latest.release;
  }

  const version = versionsData.versions.find((v) => v.id === minecraftVersion);
  if (!version) {
    throw new Error(`No version found for ${minecraftVersion}`);
  }

  return version;
}

export async function downloadClient(minecraftVersion: Version) {
  if (!minecraftVersion.url) {
    throw new Error(`No url found for ${minecraftVersion.id}`);
  }

  const versionResponse = await fetch(minecraftVersion.url);
  const versionData = (await versionResponse.json()) as DownloadClientData;

  if (!versionData.downloads?.client) {
    throw new Error(`No client download found for ${minecraftVersion.id}`);
  }

  const clientJarResponse = await fetch(versionData.downloads.client.url);
  return clientJarResponse.arrayBuffer();
}

export async function extractAssets(jarData: ArrayBuffer, uiPackagePath: string) {
  if (!uiPackagePath) {
    throw new Error('uiPackagePath is required');
  }

  const assetsPath = `${uiPackagePath}/assets`;
  const tempJar = `${assetsPath}/.temp-client.jar`;

  try {
    await Bun.$`mkdir -p ${assetsPath}`.quiet();
    await Bun.write(tempJar, jarData);
    
    // Extraire et aplatir la structure
    await Bun.$`unzip -q -o ${tempJar} "assets/minecraft/textures/item/*" -d ${assetsPath}`.quiet();
    await Bun.$`unzip -q -o ${tempJar} "assets/minecraft/textures/block/*" -d ${assetsPath}`.quiet();
    
    // Déplacer vers une structure plus simple
    await Bun.$`mkdir -p ${assetsPath}/item ${assetsPath}/block`.quiet();
    await Bun.$`mv ${assetsPath}/assets/minecraft/textures/item/* ${assetsPath}/item/`.quiet();
    await Bun.$`mv ${assetsPath}/assets/minecraft/textures/block/* ${assetsPath}/block/`.quiet();
    await Bun.$`rm -rf ${assetsPath}/assets`.quiet();
    
    console.log(`Assets extracted to ${assetsPath}`);
  } finally {
    await Bun.$`rm -f ${tempJar}`.quiet();
  }
}

function toExportName(filename: string): string {
  return filename
    .replace(/\.png$/, '')
    .replace(/-/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_');
}

export async function generateExportFiles(uiPackagePath: string) {
  const itemsDir = `${uiPackagePath}/assets/item`;
  const blocksDir = `${uiPackagePath}/assets/block`;

  const glob = new Bun.Glob('*.png');

  const itemFiles = Array.from(glob.scanSync(itemsDir));
  const itemExports = itemFiles.map((f) => {
    const name = toExportName(f);
    return `export { default as ${name} } from '../assets/item/${f}';`;
  });
  const itemNames = itemFiles.map((f) => `'${toExportName(f)}'`).join('\n  | ');
  const itemsContent = `${itemExports.join('\n')}

export type ItemName =
  | ${itemNames};
`;
  await Bun.write(`${uiPackagePath}/src/items.ts`, itemsContent);
  console.log(`Generated items.ts with ${itemExports.length} exports`);

  const blockFiles = Array.from(glob.scanSync(blocksDir));
  const blockExports = blockFiles.map((f) => {
    const name = toExportName(f);
    return `export { default as ${name} } from '../assets/block/${f}';`;
  });
  const blockNames = blockFiles.map((f) => `'${toExportName(f)}'`).join('\n  | ');
  const blocksContent = `${blockExports.join('\n')}

export type BlockName =
  | ${blockNames};
`;
  await Bun.write(`${uiPackagePath}/src/blocks.ts`, blocksContent);
  console.log(`Generated blocks.ts with ${blockExports.length} exports`);
}
