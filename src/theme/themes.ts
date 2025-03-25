import { ThemeOptions } from '@mui/material/styles';

export type ThemeName = 'default' | 'ocean' | 'forest' | 'sunset';

export const lightThemes: Record<ThemeName, ThemeOptions> = {
  default: {
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
    },
  },
  ocean: {
    palette: {
      mode: 'light',
      primary: {
        main: '#0288d1',
        light: '#4fb3ff',
        dark: '#01579b',
      },
      secondary: {
        main: '#00bcd4',
        light: '#62efff',
        dark: '#00838f',
      },
    },
  },
  forest: {
    palette: {
      mode: 'light',
      primary: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
      },
      secondary: {
        main: '#795548',
        light: '#a1887f',
        dark: '#4e342e',
      },
    },
  },
  sunset: {
    palette: {
      mode: 'light',
      primary: {
        main: '#f57c00',
        light: '#ffa726',
        dark: '#ef6c00',
      },
      secondary: {
        main: '#ff5722',
        light: '#ff8a50',
        dark: '#c41c00',
      },
    },
  },
};

export const darkThemes: Record<ThemeName, ThemeOptions> = {
  default: {
    palette: {
      mode: 'dark',
      background: {
        default: '#1E1E1E',
        paper: '#2D2D2D',
      },
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#ce93d8',
        light: '#f3e5f5',
        dark: '#ab47bc',
      },
    },
  },
  ocean: {
    palette: {
      mode: 'dark',
      background: {
        default: '#1E1E1E',
        paper: '#2D2D2D',
      },
      primary: {
        main: '#4fb3ff',
        light: '#e1f5fe',
        dark: '#0288d1',
      },
      secondary: {
        main: '#62efff',
        light: '#e0f7fa',
        dark: '#00bcd4',
      },
    },
  },
  forest: {
    palette: {
      mode: 'dark',
      background: {
        default: '#1E1E1E',
        paper: '#2D2D2D',
      },
      primary: {
        main: '#4caf50',
        light: '#e8f5e9',
        dark: '#2e7d32',
      },
      secondary: {
        main: '#a1887f',
        light: '#efebe9',
        dark: '#795548',
      },
    },
  },
  sunset: {
    palette: {
      mode: 'dark',
      background: {
        default: '#1E1E1E',
        paper: '#2D2D2D',
      },
      primary: {
        main: '#ffa726',
        light: '#fff3e0',
        dark: '#f57c00',
      },
      secondary: {
        main: '#ff8a50',
        light: '#fbe9e7',
        dark: '#ff5722',
      },
    },
  },
};

export const themeIcons: Record<ThemeName, { light: string; dark: string }> = {
  default: {
    light: '🌞',
    dark: '🌙',
  },
  ocean: {
    light: '🌊',
    dark: '🌊',
  },
  forest: {
    light: '🌲',
    dark: '🌲',
  },
  sunset: {
    light: '🌅',
    dark: '🌅',
  },
}; 