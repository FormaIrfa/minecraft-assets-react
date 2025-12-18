import type { FC, CSSProperties } from 'react';

export type MinecraftIconProps = {
  size?: number;
  src: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
};

export const MinecraftIcon: FC<MinecraftIconProps> = ({
  size,
  src,
  alt = 'Minecraft icon',
  style,
  className,
}) => {
  const finalSize = size ?? 16;

  return (
    <img
      src={src}
      alt={alt}
      width={finalSize}
      height={finalSize}
      className={className}
      style={{
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
};

export default MinecraftIcon;
