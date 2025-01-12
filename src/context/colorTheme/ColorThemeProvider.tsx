import { ReactNode, useState } from 'react';
import { useOnMount } from '../../hooks/useOnMount.ts';

import { ColorThemeContext } from './ColorThemeContext.ts';

export const ColorThemeProvider = ({ children }: { children: ReactNode }) => {
  // check local storage, then matchMedia
  const localStorageTheme = localStorage.getItem('colorTheme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorageTheme === 'dark' || localStorageTheme === 'light'
      ? localStorageTheme
      : prefersDark
        ? 'dark'
        : 'light',
  );

  const onMount = () => {
    if (theme === 'dark') {
      document.querySelector('html')?.classList?.add('dark');
    }
  };
  useOnMount(onMount);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'light') {
      document.querySelector('html')?.classList?.remove('dark');
    } else {
      document.querySelector('html')?.classList?.add('dark');
    }
    localStorage.setItem('colorTheme', newTheme);
    setTheme(newTheme);
  };
  return (
    <ColorThemeContext
      value={{
        toggleTheme,
        theme,
      }}
    >
      {children}
    </ColorThemeContext>
  );
};
