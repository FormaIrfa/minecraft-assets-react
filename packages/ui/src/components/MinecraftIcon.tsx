import type { FC, CSSProperties } from 'react';

export type MinecraftIconProps = {
  width?: number;
  height?: number;
  size?: number;
  src: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
};

export const MinecraftIcon: FC<MinecraftIconProps> = ({
  width,
  height,
  size,
  src,
  alt = 'Minecraft icon',
  style,
  className,
}) => {
  const finalWidth = width ?? size ?? 16;
  const finalHeight = height ?? size ?? 16;

  return (
    <img
      src={src}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      className={className}
      style={{
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
};

export default MinecraftIcon;
