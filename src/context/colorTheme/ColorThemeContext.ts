import { createContext } from 'react';

export const ColorThemeContext = createContext<null | {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}>(null);
