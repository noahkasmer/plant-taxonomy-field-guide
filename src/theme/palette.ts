export const palettes = {
  light: {
    background: '#F3F0E8',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF2E8',
    surfaceAccent: '#DCE8D8',
    border: '#D7DED0',
    text: '#1F3D2F',
    textMuted: '#4A5B4D',
    textSubtle: '#5E6F60',
    primary: '#2F6B43',
    warning: '#C58E2D',
  },
  dark: {
    background: '#102019',
    surface: '#173325',
    surfaceMuted: '#1C3E2E',
    surfaceAccent: '#234735',
    border: '#305742',
    text: '#F5F2E9',
    textMuted: '#D4E2D5',
    textSubtle: '#9FB7A4',
    primary: '#79B37E',
    warning: '#E2B85C',
  },
} as const;

export type PaletteName = keyof typeof palettes;
