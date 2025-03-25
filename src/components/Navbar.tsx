import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LightMode,
  DarkMode,
  Palette,
  Language,
  Home,
  Info,
  Security,
  Gavel,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import i18n from '../i18n/i18n';
import { ThemeName } from '../theme/themes';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  // Type assertion for translation function
  const translate = t as (key: string) => string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isDarkMode, toggleTheme, setTheme, currentTheme, setCustomThemeColor } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for menus
  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Theme options
  const themes = [
    { name: 'default' as ThemeName, label: 'Blue', id: 'blue-theme' },
    { name: 'forest' as ThemeName, label: 'Green', id: 'green-theme' },
    { name: 'default' as ThemeName, label: 'Purple', customColor: 'purple', id: 'purple-theme' },
    { name: 'sunset' as ThemeName, label: 'Orange', id: 'orange-theme' },
  ];

  // Language options
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ];

  // Menu handlers
  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setThemeMenuAnchor(null);
    setLanguageMenuAnchor(null);
  };

  const handleThemeChange = (themeName: ThemeName, customColor?: string, id?: string) => {
    console.log('Theme change:', themeName, customColor, id);
    
    // First, set the base theme
    setTheme(themeName);
    
    // Then handle custom color
    if (customColor === 'purple') {
      console.log('Setting custom theme color to purple');
      // We need to set the customThemeColor after setting the theme
      setTimeout(() => {
        setCustomThemeColor('purple');
      }, 0);
    } else if (id === 'blue-theme') {
      console.log('Blue theme selected, explicitly clearing custom color');
      // For blue theme, we need to explicitly clear any custom theme
      setCustomThemeColor(null);
    } else {
      console.log('Clearing custom theme color');
      // Make sure we explicitly clear the custom theme color for other themes
      setCustomThemeColor(null);
    }
    
    handleMenuClose();
  };

  const handleLanguageChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItemButton 
          onClick={() => handleNavigation('/')}
          selected={location.pathname === '/'}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.light',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary={translate('home')} />
        </ListItemButton>
        <ListItemButton 
          onClick={() => handleNavigation('/about')}
          selected={location.pathname === '/about'}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.light',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary={translate('about')} />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton 
          onClick={handleThemeMenuOpen}
          selected={Boolean(themeMenuAnchor)}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.light',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon>
            <Palette />
          </ListItemIcon>
          <ListItemText primary={translate('themeColor')} />
        </ListItemButton>
        <ListItemButton 
          onClick={toggleTheme}
          sx={{
            '&:hover': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon>
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </ListItemIcon>
          <ListItemText primary={isDarkMode ? translate('lightMode') : translate('darkMode')} />
        </ListItemButton>
        <ListItemButton 
          onClick={handleLanguageMenuOpen}
          selected={Boolean(languageMenuAnchor)}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.light',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <ListItemText primary={translate('changeLanguage')} />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton 
          onClick={() => handleNavigation('/privacy')}
          selected={location.pathname === '/privacy'}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.light',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon>
            <Security />
          </ListItemIcon>
          <ListItemText primary={translate('privacy.title')} />
        </ListItemButton>
        <ListItemButton 
          onClick={() => handleNavigation('/terms')}
          selected={location.pathname === '/terms'}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.light',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon>
            <Gavel />
          </ListItemIcon>
          <ListItemText primary={translate('terms.title')} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={1}
      sx={{
        top: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: isDarkMode ? 'background.paper' : 'background.default',
        backdropFilter: 'blur(8px)',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            component="div"
            onClick={() => handleNavigation('/')}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            {translate('appName')}
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontSize: { sm: '0.75rem', md: '0.875rem' },
              lineHeight: 1.2
            }}
          >
            {translate('subtitle')}
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              color="inherit" 
              onClick={() => handleNavigation('/')} 
              title={translate('home')}
              sx={{
                bgcolor: location.pathname === '/' 
                  ? (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)') 
                  : 'transparent',
                '&:hover': {
                  bgcolor: location.pathname === '/' 
                    ? (isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.3)') 
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)')
                }
              }}
            >
              <Home />
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={() => handleNavigation('/about')} 
              title={translate('about')}
              sx={{
                bgcolor: location.pathname === '/about' 
                  ? (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)') 
                  : 'transparent',
                '&:hover': {
                  bgcolor: location.pathname === '/about'
                    ? (isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.3)')
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)')
                }
              }}
            >
              <Info />
            </IconButton>
            <IconButton color="inherit" onClick={handleThemeMenuOpen} title={translate('themeColor')}>
              <Palette />
            </IconButton>
            <IconButton color="inherit" onClick={toggleTheme} title={isDarkMode ? translate('lightMode') : translate('darkMode')}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton color="inherit" onClick={handleLanguageMenuOpen} title={translate('changeLanguage')}>
              <Language />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      {/* Theme Menu */}
      <Menu
        anchorEl={themeMenuAnchor}
        open={Boolean(themeMenuAnchor)}
        onClose={handleMenuClose}
      >
        {themes.map((theme) => {
          // Determine if this theme is selected
          const isSelected = theme.customColor === 'purple' 
            ? localStorage.getItem('customThemeColor') === 'purple'
            : currentTheme === theme.name && localStorage.getItem('customThemeColor') === null;
          
          return (
            <MenuItem
              key={theme.id}
              onClick={() => handleThemeChange(theme.name, theme.customColor, theme.id)}
              selected={isSelected}
            >
              {theme.label}
            </MenuItem>
          );
        })}
      </Menu>

      {/* Language Menu */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleMenuClose}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            zIndex: theme.zIndex.appBar - 1,
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px'
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 