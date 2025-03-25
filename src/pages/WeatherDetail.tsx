import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Thermostat,
  WaterDrop,
  Air,
  WbSunny,
  WbTwilight,
  Cloud,
  Warning,
  ArrowBack,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setCurrentWeather, setForecast, setLoading, setError } from '../store/weatherSlice';
import { weatherService } from '../services/weatherService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`weather-tabpanel-${index}`}
      aria-labelledby={`weather-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface ChartConfig {
  dataKey: string;
  color: string;
  unit: string;
  label: string;
}

const WeatherDetail: React.FC = () => {
  const { location } = useParams<{ location: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentWeather, forecast, loading, error } = useSelector((state: RootState) => state.weather);
  const [tabValue, setTabValue] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isDaytime, setIsDaytime] = useState(true);
  const [selectedChart, setSelectedChart] = useState('temperature');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;

      dispatch(setLoading(true));
      try {
        const [currentData, forecastData] = await Promise.all([
          weatherService.getCurrentWeather(location),
          weatherService.getForecast(location)
        ]);
        dispatch(setCurrentWeather(currentData));
        dispatch(setForecast(forecastData));

        // Prepare chart data
        if (forecastData.forecast.forecastday[0]?.hour) {
          const data = forecastData.forecast.forecastday[0].hour.map((hour: any) => ({
            time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: hour.temp_c,
            precip: hour.precip_mm,
            wind: hour.wind_kph,
            condition: hour.condition.text,
            icon: hour.condition.icon,
          }));
          setChartData(data);
        }

        // Check if it's daytime
        const now = new Date();
        const sunrise = new Date(forecastData.forecast.forecastday[0].astro.sunrise);
        const sunset = new Date(forecastData.forecast.forecastday[0].astro.sunset);
        setIsDaytime(now >= sunrise && now <= sunset);
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch weather data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchWeatherData();
  }, [location, dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDayClick = (index: number) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const renderChart = () => {
    const chartConfigs: Record<string, ChartConfig> = {
      temperature: {
        dataKey: 'temp',
        color: '#FFD700',
        unit: '°C',
        label: 'Temperature'
      },
      precipitation: {
        dataKey: 'precip',
        color: '#4169E1',
        unit: 'mm',
        label: 'Precipitation'
      },
      wind: {
        dataKey: 'wind',
        color: '#32CD32',
        unit: 'km/h',
        label: 'Wind Speed'
      }
    };

    const chartConfig = chartConfigs[selectedChart];

    if (!chartConfig) {
      return null;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <defs>
            <linearGradient id={`color${selectedChart}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartConfig.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartConfig.color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="white"
            tick={{ fill: 'white', fontSize: 12 }}
          />
          <YAxis
            stroke="white"
            tick={{ fill: 'white', fontSize: 12 }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none', color: 'white' }}
            formatter={(value: number) => [`${value}${chartConfig.unit}`, chartConfig.label]}
          />
          <Area
            type="monotone"
            dataKey={chartConfig.dataKey}
            stroke={chartConfig.color}
            fillOpacity={1}
            fill={`url(#color${selectedChart})`}
          />
          <Line
            type="monotone"
            dataKey={chartConfig.dataKey}
            stroke={chartConfig.color}
            strokeWidth={2}
            dot={{ fill: chartConfig.color, r: 4 }}
            activeDot={{ r: 6, fill: 'white', stroke: chartConfig.color }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !currentWeather || !forecast) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{ mt: 4 }}>
          {error || 'Failed to load weather data'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Home
      </Button>

      <Box sx={{ mb: 4 }}>
        <Card sx={{ bgcolor: 'black', color: 'white' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {currentWeather.location.name}, {currentWeather.location.country}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="h2" component="span" sx={{ fontWeight: 'bold' }}>
                        {currentWeather.current.temp_c}
                      </Typography>
                      <Typography variant="h4" component="span">
                        °C
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long' })},
                    </Typography>
                    <Typography variant="body1">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="body1">
                      {currentWeather.current.condition.text}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Precipitation: {currentWeather.current.precip_mm}%
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Humidity: {currentWeather.current.humidity}%
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Wind: {currentWeather.current.wind_kph} km/h
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    variant="text"
                    onClick={() => setSelectedChart('temperature')}
                    sx={{
                      color: selectedChart === 'temperature' ? '#FFD700' : 'white',
                      borderBottom: selectedChart === 'temperature' ? '2px solid #FFD700' : 'none',
                      borderRadius: 0,
                      '&:hover': { borderBottom: '2px solid #FFD700' }
                    }}
                  >
                    Temperature
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => setSelectedChart('precipitation')}
                    sx={{
                      color: selectedChart === 'precipitation' ? '#4169E1' : 'white',
                      borderBottom: selectedChart === 'precipitation' ? '2px solid #4169E1' : 'none',
                      borderRadius: 0,
                      '&:hover': { borderBottom: '2px solid #4169E1' }
                    }}
                  >
                    Precipitation
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => setSelectedChart('wind')}
                    sx={{
                      color: selectedChart === 'wind' ? '#32CD32' : 'white',
                      borderBottom: selectedChart === 'wind' ? '2px solid #32CD32' : 'none',
                      borderRadius: 0,
                      '&:hover': { borderBottom: '2px solid #32CD32' }
                    }}
                  >
                    Wind
                  </Button>
                </Box>
                <Box sx={{ height: 200, position: 'relative' }}>
                  {renderChart()}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  {forecast.forecast.forecastday.slice(0, 8).map((day, index) => (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {index === 0 ? 'Sun' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </Typography>
                      <Box sx={{ my: 1 }}>
                        <WbSunny sx={{ color: '#FFD700', fontSize: 24 }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#FFD700' }}>
                        {day.day.maxtemp_c}°
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'grey' }}>
                        {day.day.mintemp_c}°
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Forecast" />
          <Tab label="Alerts" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  🌡️ High/Low Temperature • ☀️ Weather Condition • 💧 Precipitation • 💨 Wind Speed
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {forecast.forecast.forecastday.map((day, index) => (
            <React.Fragment key={index}>
              <Box
                onClick={() => handleDayClick(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                  },
                  '&:last-child': {
                    borderBottom: expandedDay === index ? '1px solid rgba(0, 0, 0, 0.12)' : 'none'
                  }
                }}
              >
                {/* Date */}
                <Box sx={{ width: '180px' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {new Date(day.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </Typography>
                </Box>

                {/* Rest of the existing row content */}
                <Box sx={{ width: '100px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {Math.round(day.day.maxtemp_c)}°
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    /{Math.round(day.day.mintemp_c)}°
                  </Typography>
                </Box>

                <Box sx={{ width: '200px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img
                      src={day.day.condition.icon}
                      alt={day.day.condition.text}
                      style={{ width: 32, height: 32 }}
                    />
                    <Typography variant="body2">
                      {day.day.condition.text}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ width: '100px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WaterDrop sx={{ fontSize: 16, color: '#4169E1' }} />
                  <Typography variant="body2">
                    {Math.round(day.day.totalprecip_mm)}%
                  </Typography>
                </Box>

                <Box sx={{ width: '120px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Air sx={{ fontSize: 16, color: '#32CD32' }} />
                  <Typography variant="body2">
                    {day.day.maxwind_kph} km/h
                  </Typography>
                </Box>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDayClick(index);
                  }}
                  sx={{ 
                    transform: expandedDay === index ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.3s'
                  }}
                >
                  <ExpandMore />
                </IconButton>
              </Box>

              <Collapse in={expandedDay === index}>
                <Card sx={{ mx: 2, my: 1, bgcolor: 'black', color: 'white' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                              {currentWeather.location.name}, {currentWeather.location.country}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                              <Typography variant="h2" component="span" sx={{ fontWeight: 'bold' }}>
                                {Math.round(day.day.avgtemp_c)}
                              </Typography>
                              <Typography variant="h4" component="span">
                                °C
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body1">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                            </Typography>
                            <Typography variant="body1">
                              {day.day.condition.text}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WaterDrop sx={{ fontSize: 16, color: '#4169E1' }} />
                            Precipitation: {day.day.totalprecip_mm}mm
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WaterDrop sx={{ fontSize: 16, color: '#4169E1' }} />
                            Humidity: {day.day.avghumidity}%
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Air sx={{ fontSize: 16, color: '#32CD32' }} />
                            Wind: {day.day.maxwind_kph} km/h
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Button
                            variant="text"
                            onClick={() => setSelectedChart('temperature')}
                            sx={{
                              color: selectedChart === 'temperature' ? '#FFD700' : 'white',
                              borderBottom: selectedChart === 'temperature' ? '2px solid #FFD700' : 'none',
                              borderRadius: 0,
                              '&:hover': { borderBottom: '2px solid #FFD700' }
                            }}
                          >
                            Temperature
                          </Button>
                          <Button
                            variant="text"
                            onClick={() => setSelectedChart('precipitation')}
                            sx={{
                              color: selectedChart === 'precipitation' ? '#4169E1' : 'white',
                              borderBottom: selectedChart === 'precipitation' ? '2px solid #4169E1' : 'none',
                              borderRadius: 0,
                              '&:hover': { borderBottom: '2px solid #4169E1' }
                            }}
                          >
                            Precipitation
                          </Button>
                          <Button
                            variant="text"
                            onClick={() => setSelectedChart('wind')}
                            sx={{
                              color: selectedChart === 'wind' ? '#32CD32' : 'white',
                              borderBottom: selectedChart === 'wind' ? '2px solid #32CD32' : 'none',
                              borderRadius: 0,
                              '&:hover': { borderBottom: '2px solid #32CD32' }
                            }}
                          >
                            Wind
                          </Button>
                        </Box>
                        <Box sx={{ height: 200, position: 'relative' }}>
                          {renderChart()}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          {forecast.forecast.forecastday.slice(0, 8).map((forecastDay, idx) => (
                            <Box key={idx} sx={{ textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ color: 'white' }}>
                                {idx === 0 ? 'Sun' : new Date(forecastDay.date).toLocaleDateString('en-US', { weekday: 'short' })}
                              </Typography>
                              <Box sx={{ my: 1 }}>
                                <WbSunny sx={{ color: '#FFD700', fontSize: 24 }} />
                              </Box>
                              <Typography variant="body2" sx={{ color: '#FFD700' }}>
                                {forecastDay.day.maxtemp_c}°
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'grey' }}>
                                {forecastDay.day.mintemp_c}°
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Collapse>
            </React.Fragment>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {(forecast.alerts?.alert ?? []).length > 0 ? (
          <List>
            {(forecast.alerts?.alert ?? []).map((alert, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.headline}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {alert.desc}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.effective).toLocaleString()} - {new Date(alert.expires).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < (forecast.alerts?.alert ?? []).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No weather alerts for this location
            </Typography>
          </Paper>
        )}
      </TabPanel>
    </Container>
  );
};

export default WeatherDetail; 