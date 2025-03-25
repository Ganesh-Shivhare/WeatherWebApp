import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import {
  WbSunny,
  Search,
  Language,
  Update,
  Speed,
  DeviceHub,
  Favorite,
  Security,
  Brightness4,
  Translate,
} from '@mui/icons-material';

const About: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const features = [
    {
      icon: <Search />,
      title: 'Location Search',
      description: 'Search for weather information for any location worldwide',
    },
    {
      icon: <Update />,
      title: 'Real-time Updates',
      description: 'Get the latest weather data with automatic updates',
    },
    {
      icon: <Language />,
      title: 'Global Coverage',
      description: 'Access weather data for cities across the globe',
    },
    {
      icon: <Speed />,
      title: 'Detailed Metrics',
      description: 'View comprehensive weather metrics including temperature, humidity, and wind speed',
    },
    {
      icon: <Brightness4 />,
      title: 'Dark Mode',
      description: 'Toggle between light and dark themes for comfortable viewing',
    },
    {
      icon: <Translate />,
      title: 'Multi-language Support',
      description: 'Access the app in multiple languages',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: isDarkMode ? 'primary.light' : 'primary.main',
          }}
        >
          About Weather App
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
            mb: 4,
          }}
        >
          Your comprehensive weather companion providing real-time weather information
          with a beautiful and intuitive interface.
        </Typography>
      </Box>

      {/* Main Features Grid */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      mr: 2,
                      color: 'primary.main',
                      '& .MuiSvgIcon-root': {
                        fontSize: '2rem',
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h2">
                    {feature.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Technology Stack Section */}
      <Paper 
        sx={{ 
          p: 4,
          mb: 8,
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            color: isDarkMode ? 'primary.light' : 'primary.main',
            mb: 3,
          }}
        >
          Technology Stack
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DeviceHub sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="React.js & TypeScript"
                  secondary="Modern frontend framework for robust web applications"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <Favorite sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Material-UI (MUI)"
                  secondary="Beautiful and responsive UI components"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <Security sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Weather API Integration"
                  secondary="Real-time weather data from reliable sources"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WbSunny sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dynamic Theming"
                  secondary="Light and dark mode support for better user experience"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <Language sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="i18n Integration"
                  secondary="Internationalization support for multiple languages"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <Speed sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Redux State Management"
                  secondary="Efficient state management for better performance"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Section */}
      <Box 
        sx={{ 
          textAlign: 'center',
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            color: isDarkMode ? 'primary.light' : 'primary.main',
          }}
        >
          Get in Touch
        </Typography>
        <Typography 
          variant="body1"
          sx={{ 
            maxWidth: '600px',
            mx: 'auto',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
          }}
        >
          Have questions or suggestions? We'd love to hear from you. Feel free to reach out
          to our team for any inquiries about the Weather App.
        </Typography>
      </Box>
    </Container>
  );
};

export default About; 