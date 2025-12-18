/// <reference types="vite/client" />

// Allow importing .ogg files with ?url suffix
declare module '*.ogg?url' {
  const src: string;
  export default src;
}
