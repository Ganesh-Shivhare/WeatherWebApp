import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  TextField,
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Popper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LocationOn, Delete, WaterDrop, Air, Thermostat } from '@mui/icons-material';
import { RootState } from '../store/store';
import { addRecentSearch, removeRecentSearch, setSearchResults } from '../store/weatherSlice';
import { useWeather } from '../hooks/useWeather';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recentSearches, searchResults } = useSelector((state: RootState) => state.weather);
  const { currentWeather, loading, error, fetchWeatherData, searchLocations } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [weatherData, setWeatherData] = useState<{ [key: string]: any }>({});
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
  const { isDarkMode } = useTheme();

  // Fetch weather data for recent searches and popular cities
  useEffect(() => {
    const fetchAllWeatherData = async () => {
      const allLocations = [...recentSearches, ...popularCities];
      const newWeatherData: { [key: string]: any } = {};

      for (const location of allLocations) {
        try {
          const data = await fetchWeatherData(location);
          newWeatherData[location] = data;
        } catch (err) {
          console.error(`Failed to fetch weather for ${location}:`, err);
        }
      }

      setWeatherData(newWeatherData);
    };

    fetchAllWeatherData();
  }, [recentSearches, fetchWeatherData]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setAnchorEl(e.currentTarget);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for search
    if (query.trim()) {
      const timeout = setTimeout(() => {
        searchLocations(query);
      }, 500);
      setSearchTimeout(timeout);
    } else {
      dispatch(setSearchResults([]));
    }
  };

  const handleLocationClick = (location: string, isFromSearch: boolean = false) => {
    if (isFromSearch) {
      dispatch(addRecentSearch(location));
    }
    navigate(`/weather/${location}`);
  };

  const handleRemoveRecentSearch = (location: string) => {
    dispatch(removeRecentSearch(location));
    setWeatherData(prev => {
      const newData = { ...prev };
      delete newData[location];
      return newData;
    });
  };

  const WeatherCard = ({ location, data }: { location: string; data: any }) => {
    if (!data) return null;

    return (
      <Card
        sx={{
          height: '100%',
          transition: 'all 0.2s ease-in-out',
          transform: hoveredLocation === location ? 'scale(1.02)' : 'scale(1)',
          '&:hover': {
            boxShadow: 6,
          },
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                '& .MuiSvgIcon-root': {
                  color: 'primary.main',
                }
              }}>
                <LocationOn />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {data.location.name}, {data.location.country}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'primary.light',
                  p: 1,
                  borderRadius: 1,
                  '& img': {
                    width: 48,
                    height: 48,
                    objectFit: 'contain'
                  }
                }}>
                  <img
                    src={data.current.condition.icon}
                    alt={data.current.condition.text}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2
                    }}
                  >
                    {data.current.temp_c}°C
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}
                  >
                    {data.current.condition.text}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'grey.50',
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main',
                    }
                  }}>
                    <WaterDrop />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Humidity
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                    >
                      {data.current.humidity}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'grey.50',
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main',
                    }
                  }}>
                    <Air />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Wind
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                    >
                      {data.current.wind_kph} km/h
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'grey.50',
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main',
                    }
                  }}>
                    <Thermostat />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Feels
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                    >
                      {data.current.feelslike_c}°C
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Weather App
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 4,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Stay informed with real-time weather updates from around the world. Search for any location to get detailed weather information.
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search location..."
          value={searchQuery}
          onChange={handleSearchInput}
          inputRef={searchInputRef}
          sx={{ mb: 2 }}
        />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Popper
          open={searchResults.length > 0 && Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          style={{ width: anchorEl?.offsetWidth }}
        >
          <Paper
            sx={{
              width: '100%',
              maxHeight: 300,
              overflow: 'auto',
              boxShadow: 3,
              zIndex: 1300,
            }}
          >
            <List>
              {searchResults.map((result) => (
                <ListItem key={result.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setSearchQuery(result.name);
                      handleLocationClick(result.name, true);
                      dispatch(setSearchResults([]));
                    }}
                  >
                    <ListItemText
                      primary={result.name}
                      secondary={`${result.region}, ${result.country}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>

      <Grid container spacing={3}>
        {recentSearches.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Recent Searches
            </Typography>
            <Grid container spacing={4}>
              {recentSearches.map((location) => (
                <Grid item xs={12} sm={6} md={4} key={location}>
                  <Box
                    sx={{
                      position: 'relative',
                      height: '100%',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      }
                    }}
                    onMouseEnter={() => setHoveredLocation(location)}
                    onMouseLeave={() => setHoveredLocation(null)}
                  >
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        zIndex: 1,
                        bgcolor: 'background.paper',
                        '&:hover': {
                          bgcolor: 'background.paper',
                        }
                      }}
                      size="small"
                      onClick={() => handleRemoveRecentSearch(location)}
                    >
                      <Delete />
                    </IconButton>
                    <Box
                      onClick={() => handleLocationClick(location)}
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                      }}
                    >
                      <WeatherCard location={location} data={weatherData[location]} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mt: recentSearches.length > 0 ? 6 : 0,
              mb: 3
            }}
          >
            Popular Cities
          </Typography>
          <Grid container spacing={4}>
            {popularCities.map((city) => (
              <Grid item xs={12} sm={6} md={4} key={city}>
                <Box
                  onClick={() => handleLocationClick(city)}
                  onMouseEnter={() => setHoveredLocation(city)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <WeatherCard location={city} data={weatherData[city]} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 