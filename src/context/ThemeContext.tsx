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
  themeColor: string;
  setCustomThemeColor: (color: string | null) => void;
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
  
  // Store the custom theme color (for handling purple theme)
  const [customThemeColor, setCustomThemeColor] = useState<string | null>(() => {
    return localStorage.getItem('customThemeColor');
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);
  
  useEffect(() => {
    if (customThemeColor) {
      console.log('Setting customThemeColor in localStorage to:', customThemeColor);
      localStorage.setItem('customThemeColor', customThemeColor);
    } else {
      console.log('Removing customThemeColor from localStorage');
      localStorage.removeItem('customThemeColor');
    }
  }, [customThemeColor]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (theme: ThemeName) => {
    console.log('Setting theme to:', theme);
    if (isValidTheme(theme)) {
      setCurrentTheme(theme);
      
      // Do NOT clear customThemeColor when changing to 'default' theme
      // but DO clear it for other themes
      if (theme !== 'default') {
        console.log('Theme is not default, clearing customThemeColor');
        setCustomThemeColor(null);
      }
      // Note: If theme is 'default', we keep the existing customThemeColor (either 'purple' or null)
    }
  };

  // Create theme based on current settings
  const theme = createTheme(
    {
      ...(isDarkMode ? darkThemes[currentTheme] : lightThemes[currentTheme]),
      // Override with purple theme colors if customThemeColor is 'purple'
      palette: {
        ...(isDarkMode ? darkThemes[currentTheme].palette : lightThemes[currentTheme].palette),
        // Apply purple color scheme if customThemeColor is 'purple'
        ...(customThemeColor === 'purple' ? {
          primary: {
            main: isDarkMode ? '#ce93d8' : '#9c27b0',
            light: isDarkMode ? '#f3e5f5' : '#ba68c8',
            dark: isDarkMode ? '#ab47bc' : '#7b1fa2',
          },
          secondary: {
            main: isDarkMode ? '#9575cd' : '#673ab7',
            light: isDarkMode ? '#e8eaf6' : '#9fa8da',
            dark: isDarkMode ? '#5e35b1' : '#4527a0',
          },
        } : {})
      }
    }
  );

  const themeIcon = isDarkMode 
    ? themeIcons[currentTheme].dark 
    : themeIcons[currentTheme].light;

  // Compute the theme color
  const computedThemeColor = customThemeColor === 'purple' ? 'purple' :
              currentTheme === 'default' ? 'blue' : 
              currentTheme === 'ocean' ? 'blue' : 
              currentTheme === 'forest' ? 'green' : 
              currentTheme === 'sunset' ? 'orange' : 'blue';
  
  console.log('Theme state:', { 
    currentTheme, 
    customThemeColor, 
    computedThemeColor 
  });

  const value = {
    isDarkMode,
    toggleTheme,
    currentTheme,
    setTheme,
    themeIcon,
    themeColor: computedThemeColor,
    setCustomThemeColor,
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