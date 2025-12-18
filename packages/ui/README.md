# @xefreh/minecraft-assets-react

React library to use Minecraft assets (icons, sounds) in your applications.

## Installation

```bash
npm install @xefreh/minecraft-assets-react
# or
yarn add @xefreh/minecraft-assets-react
# or
pnpm add @xefreh/minecraft-assets-react
```

## Requirements

**⚠️ Important**: This package is optimized for **Vite**. While it may work with other bundlers, **Vite is highly recommended** for the best experience, especially for tree-shaking of sound files.

If you're not using Vite, you may need to configure your bundler to handle TypeScript imports from npm packages.

## Usage

### Components

```tsx
import { MinecraftIcon, MinecraftSound } from '@xefreh/minecraft-assets-react';
import { diamond, emerald } from '@xefreh/minecraft-assets-react/items';
import { stone, dirt } from '@xefreh/minecraft-assets-react/blocks';
import records_cat from '@xefreh/minecraft-assets-react/sounds/records_cat';

function MyComponent() {
  return (
    <div>
      {/* Display an icon */}
      <MinecraftIcon src={diamond} alt="Diamond" size={64} />

      {/* Audio player component */}
      <MinecraftSound src={records_cat} />
    </div>
  );
}
```

### Hook: usePlaySound

```tsx
import { usePlaySound } from '@xefreh/minecraft-assets-react';
import damage_hit1 from '@xefreh/minecraft-assets-react/sounds/damage_hit1';

function MyComponent() {
  const hitSound = usePlaySound(damage_hit1);

  return (
    <button onClick={() => hitSound.play({ volume: 0.8 })}>
      💥 Play Sound
    </button>
  );
}
```

### Complete Example

```tsx
import {
  MinecraftIcon,
  MinecraftSound,
  usePlaySound,
} from '@xefreh/minecraft-assets-react';
import {
  diamond_sword,
  golden_apple,
} from '@xefreh/minecraft-assets-react/items';
import records_cat from '@xefreh/minecraft-assets-react/sounds/records_cat';
import damage_hit1 from '@xefreh/minecraft-assets-react/sounds/damage_hit1';

function GameUI() {
  const hitSound = usePlaySound(damage_hit1);

  return (
    <div>
      <MinecraftIcon src={diamond_sword} size={32} />
      <MinecraftIcon src={golden_apple} size={32} />

      <MinecraftSound src={records_cat} />

      <button onClick={() => hitSound.play()}>Hit!</button>
    </div>
  );
}
```

## Features

- 🎨 **792 Minecraft items** (Base64 encoded, tree-shakable)
- 🧱 **1111 Minecraft blocks** (Base64 encoded, tree-shakable)
- 🔊 **4405 Minecraft sounds** (loaded from GitHub, tree-shakable)
- 📦 **Optimized bundle size** - Only imported assets are included
- 🎯 **TypeScript support** - Full type definitions included
- ⚡ **Tree-shaking** - Unused assets are automatically excluded

## Tree-Shaking

This package is optimized for tree-shaking:

- **Images**: Encoded as Base64 strings, only imported images are included in your bundle
- **Sounds**: Only sounds you explicitly import are loaded from GitHub

Example:

```tsx
// Only these 2 sounds will be loaded, not all 4405!
import records_cat from '@xefreh/minecraft-assets-react/sounds/records_cat';
import damage_hit1 from '@xefreh/minecraft-assets-react/sounds/damage_hit1';
```

## Peer Dependencies

- React ^18.0.0 || ^19.0.0
- React DOM ^18.0.0 || ^19.0.0

## License

MIT

## Repository

https://github.com/Xefreh/minecraft-assets-react
