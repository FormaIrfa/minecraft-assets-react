# minecraft-assets-react

React library to use Minecraft assets (icons, sounds) in your applications.

## 📦 NPM Package

This library is available on npm as [`@xefreh/minecraft-assets-react`](https://www.npmjs.com/package/@xefreh/minecraft-assets-react).

**📖 For usage instructions, see the [package README](./packages/ui/README.md)**

## Project Structure

```
minecraft-assets-react/
├── apps/
│   └── web/              # Demo application
├── packages/
│   ├── ui/               # React components (MinecraftIcon, MinecraftSound, usePlaySound)
│   └── assets-extractor/ # Minecraft assets extraction tool
```

## Installation

```bash
bun install
```

## Running the Demo App

### 1. Build the UI package

```bash
cd packages/ui
bun run build
```

### 2. Start the development server

```bash
cd apps/web
bun run dev
```

The app will be available at **http://localhost:3000**

## Extract Minecraft Assets (optional)

If you want to update assets from a new Minecraft version:

```bash
# 1. Extract assets from the latest Minecraft version
bun run extract

# 2. Rebuild the UI package to include the new assets
cd packages/ui
bun run build
```

This will download and extract textures and sounds from the latest Minecraft version, then bundle them into the UI package.

## Library Usage

### Quick Start

```bash
npm install @xefreh/minecraft-assets-react
```

### Components

```tsx
import { MinecraftIcon, MinecraftSound, usePlaySound } from '@xefreh/minecraft-assets-react';
import { diamond, diamond_sword } from '@xefreh/minecraft-assets-react/items';
import { stone, dirt } from '@xefreh/minecraft-assets-react/blocks';
import records_cat from '@xefreh/minecraft-assets-react/sounds/records_cat';
import damage_hit1 from '@xefreh/minecraft-assets-react/sounds/damage_hit1';

// Display an icon
<MinecraftIcon src={diamond} alt="Diamond" size={64} />

// Audio player
<MinecraftSound src={records_cat} />

// Play a sound programmatically
const hitSound = usePlaySound(damage_hit1);
hitSound.play({ volume: 0.8 });
```

**⚠️ Note**: This package is optimized for **Vite**. See the [package README](./packages/ui/README.md) for more details.

## Technologies

- [Bun](https://bun.sh) - JavaScript runtime
- [React](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool (recommended)
- Bun workspaces for monorepo management
