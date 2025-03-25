import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightThemes, darkThemes, themeIcons, ThemeName } from '../theme/themes';

const isValidTheme = (theme: string): theme is ThemeName => {
  return theme in lightThemes;
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeIcon: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) return 'default';
    return isValidTheme(savedTheme) ? savedTheme : 'default';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (theme: ThemeName) => {
    if (isValidTheme(theme)) {
      setCurrentTheme(theme);
    }
  };

  const theme = createTheme(
    isDarkMode ? darkThemes[currentTheme] : lightThemes[currentTheme]
  );

  const themeIcon = isDarkMode 
    ? themeIcons[currentTheme].dark 
    : themeIcons[currentTheme].light;

  const value = {
    isDarkMode,
    toggleTheme,
    currentTheme,
    setTheme,
    themeIcon,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 