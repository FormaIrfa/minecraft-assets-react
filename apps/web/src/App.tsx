import {
  MinecraftIcon,
  MinecraftSound,
  usePlaySound,
} from '@minecraft-assets/ui';
import {
  diamond,
  diamond_sword,
  diamond_pickaxe,
  diamond_chestplate,
  diamond_helmet,
  diamond_leggings,
  iron_ingot,
  gold_ingot,
  emerald,
  golden_apple,
  iron_sword,
  netherite_sword,
} from '@minecraft-assets/ui/items';
import {
  stone,
  dirt,
  grass_block_top,
  oak_planks,
  cobblestone,
  diamond_block,
  gold_block,
  iron_block,
  emerald_block,
} from '@minecraft-assets/ui/blocks';
import records_cat from '@minecraft-assets/ui/sounds/records_cat';
import records_pigstep from '@minecraft-assets/ui/sounds/records_pigstep';
import damage_hit1 from '@minecraft-assets/ui/sounds/damage_hit1';
import ambient_cave_cave1 from '@minecraft-assets/ui/sounds/ambient_cave_cave1';

export default function App() {
  const hitSound = usePlaySound(damage_hit1);
  const caveSound = usePlaySound(ambient_cave_cave1);
  const catMusic = usePlaySound(records_cat);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '2rem' }}>Minecraft Assets Demo</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Ores</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={diamond} alt="Diamond" size={64} />
          <MinecraftIcon src={emerald} alt="Emerald" size={64} />
          <MinecraftIcon src={iron_ingot} alt="Iron Ingot" size={64} />
          <MinecraftIcon src={gold_ingot} alt="Gold Ingot" size={64} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Swords</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={iron_sword} alt="Iron Sword" size={64} />
          <MinecraftIcon src={diamond_sword} alt="Diamond Sword" size={64} />
          <MinecraftIcon
            src={netherite_sword}
            alt="Netherite Sword"
            size={64}
          />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Diamond Armor</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={diamond_helmet} alt="Diamond Helmet" size={64} />
          <MinecraftIcon
            src={diamond_chestplate}
            alt="Diamond Chestplate"
            size={64}
          />
          <MinecraftIcon
            src={diamond_leggings}
            alt="Diamond Leggings"
            size={64}
          />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Tools</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon
            src={diamond_pickaxe}
            alt="Diamond Pickaxe"
            size={64}
          />
          <MinecraftIcon src={golden_apple} alt="Golden Apple" size={64} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Blocks</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={stone} alt="Stone" size={64} />
          <MinecraftIcon src={dirt} alt="Dirt" size={64} />
          <MinecraftIcon src={grass_block_top} alt="Grass Block" size={64} />
          <MinecraftIcon src={cobblestone} alt="Cobblestone" size={64} />
          <MinecraftIcon src={oak_planks} alt="Oak Planks" size={64} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Precious Blocks</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <MinecraftIcon src={diamond_block} alt="Diamond Block" size={64} />
          <MinecraftIcon src={emerald_block} alt="Emerald Block" size={64} />
          <MinecraftIcon src={gold_block} alt="Gold Block" size={64} />
          <MinecraftIcon src={iron_block} alt="Iron Block" size={64} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Sounds</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div>
            <p style={{ margin: '0 0 0.5rem' }}>🎵 Cat Disc</p>
            <MinecraftSound src={records_cat} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem' }}>🎵 Pigstep Disc</p>
            <MinecraftSound src={records_pigstep} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem' }}>💥 Damage</p>
            <MinecraftSound src={damage_hit1} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem' }}>🦇 Cave Ambience</p>
            <MinecraftSound src={ambient_cave_cave1} />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>usePlaySound Hook</h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Play sounds programmatically without visible audio components
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => hitSound.play({ volume: 0.8 })}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: '2px solid #c0392b',
              background: '#e74c3c',
              color: 'white',
            }}
          >
            💥 Damage Sound
          </button>
          <button
            onClick={() => caveSound.play({ volume: 0.6 })}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: '2px solid #2c3e50',
              background: '#34495e',
              color: 'white',
            }}
          >
            🦇 Cave Ambience
          </button>
          <button
            onClick={() => catMusic.play({ volume: 0.5, loop: true })}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: '2px solid #27ae60',
              background: '#2ecc71',
              color: 'white',
            }}
          >
            🎵 Play Cat (loop)
          </button>
          <button
            onClick={() => catMusic.stop()}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: '2px solid #7f8c8d',
              background: '#95a5a6',
              color: 'white',
            }}
          >
            ⏹️ Stop Music
          </button>
        </div>
      </section>
    </div>
  );
}
