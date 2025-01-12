import { useContext } from 'react';
import { ColorThemeContext } from './ColorThemeContext.ts';

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme must be inside a ColorThemeProvider');
  }
  return context;
};
