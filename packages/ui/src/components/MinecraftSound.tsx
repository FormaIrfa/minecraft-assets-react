import { CSSProperties, FC } from 'react';

export type MinecraftSoundProps = {
  src: string;
  style?: CSSProperties;
  className?: string;
};

export const MinecraftSound: FC<MinecraftSoundProps> = ({
  src,
  style,
  className,
}) => {
  return <audio src={src} style={style} className={className} controls />;
};

export default MinecraftSound;
