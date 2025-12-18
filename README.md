# minecraft-assets-react

React library to use Minecraft assets (icons, sounds) in your applications.

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

### Components

```tsx
import { MinecraftIcon, MinecraftSound, usePlaySound } from '@minecraft-assets/ui';
import { diamond, diamond_sword } from '@minecraft-assets/ui/items';
import { stone, dirt } from '@minecraft-assets/ui/blocks';
import { damage_hit1, records_cat } from '@minecraft-assets/ui/sounds';

// Display an icon
<MinecraftIcon src={diamond} alt="Diamond" size={64} />

// Audio player
<MinecraftSound src={records_cat} />

// Play a sound programmatically
const hitSound = usePlaySound(damage_hit1);
hitSound.play({ volume: 0.8 });
```

## Technologies

- [Bun](https://bun.sh) - JavaScript runtime
- [React](https://react.dev) - UI library
- Bun workspaces for monorepo management
