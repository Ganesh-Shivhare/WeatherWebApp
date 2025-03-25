import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import { WeatherData } from '../services/weatherService';
import { useNavigate } from 'react-router-dom';
import { LocationOn, Delete, WaterDrop, Air, Thermostat } from '@mui/icons-material';

interface WeatherCardProps {
  weather: WeatherData;
  onClick?: () => void;
  showDetails?: boolean;
  onDelete?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onClick, showDetails = true, onDelete }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/weather/${weather.location.name}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff',
        borderRadius: 2,
        position: 'relative',
        '&:hover': {
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      }}
      onClick={handleClick}
    >
      {onDelete && (
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            }
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      )}
      
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LocationOn sx={{ 
            color: isDarkMode ? '#2196f3' : '#1976d2',
            fontSize: '1.25rem'
          }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 500,
              color: isDarkMode ? '#fff' : '#000'
            }}
          >
            {weather.location.name}, {weather.location.country}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ 
            width: 56,
            height: 56,
            bgcolor: isDarkMode ? '#1976d2' : '#2196f3',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& img': {
              width: 40,
              height: 40,
              filter: 'brightness(0) invert(1)'
            }
          }}>
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
            />
          </Box>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 500,
                color: isDarkMode ? '#fff' : '#000',
                lineHeight: 1
              }}
            >
              {weather.current.temp_c}°C
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                mt: 0.5
              }}
            >
              {weather.current.condition.text}
            </Typography>
          </Box>
        </Box>

        {showDetails && (
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                py: 1,
              }}>
                <WaterDrop sx={{ 
                  color: isDarkMode ? '#2196f3' : '#1976d2',
                  fontSize: '1.25rem',
                  mb: 0.5
                }} />
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    mb: 0.5
                  }}
                >
                  Humidity
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontWeight: 500,
                    color: isDarkMode ? '#fff' : '#000'
                  }}
                >
                  {weather.current.humidity}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                py: 1,
              }}>
                <Air sx={{ 
                  color: isDarkMode ? '#2196f3' : '#1976d2',
                  fontSize: '1.25rem',
                  mb: 0.5
                }} />
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    mb: 0.5
                  }}
                >
                  Wind
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontWeight: 500,
                    color: isDarkMode ? '#fff' : '#000'
                  }}
                >
                  {weather.current.wind_kph} km/h
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                py: 1,
              }}>
                <Thermostat sx={{ 
                  color: isDarkMode ? '#2196f3' : '#1976d2',
                  fontSize: '1.25rem',
                  mb: 0.5
                }} />
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    mb: 0.5
                  }}
                >
                  Feels
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontWeight: 500,
                    color: isDarkMode ? '#fff' : '#000'
                  }}
                >
                  {weather.current.feelslike_c}°C
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard; 