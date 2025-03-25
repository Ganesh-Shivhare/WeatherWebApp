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
  // LocationOn,
  // Thermostat,
  WaterDrop,
  Air,
  // WbSunny,
  // WbTwilight,
  // Cloud,
  Warning,
  ArrowBack,
  ExpandMore,
  // ExpandLess,
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
  Tooltip,
  ResponsiveContainer,
  Area,
  // CartesianGrid,
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
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentWeather, forecast, loading, error } = useSelector((state: RootState) => state.weather);
  const [tabValue, setTabValue] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedChart, setSelectedChart] = useState<string>('temperature');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Function to prepare chart data from hourly forecast
  const prepareChartData = (hourData: any[]) => {
    if (!hourData || hourData.length === 0) {
      return [];
    }
    
    // Create formatted data with all metrics
    return hourData.map((hour: any) => ({
      time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: parseFloat(hour.temp_c || 0),
      precip: parseFloat(hour.precip_mm || 0),
      wind: parseFloat(hour.wind_kph || 0)
    }));
  };

  // Update the handleDayClick function to load hourly data for the selected day
  const handleDayClick = (index: number) => {
    const newExpandedDay = expandedDay === index ? null : index;
    setExpandedDay(newExpandedDay);
    
    if (newExpandedDay !== null && forecast?.forecast?.forecastday?.[newExpandedDay]?.hour) {
      const hourlyData = forecast.forecast.forecastday[newExpandedDay].hour;
      const processedData = prepareChartData(hourlyData);
      setChartData(processedData);
    } else if (forecast?.forecast?.forecastday?.[0]?.hour) {
      // Reset to today's data when collapsing
      const todayHourlyData = forecast.forecast.forecastday[0].hour;
      const processedData = prepareChartData(todayHourlyData);
      setChartData(processedData);
    }
  };

  // Update the useEffect that loads weather data
  useEffect(() => {
    const location = city || localStorage.getItem('location');

    if (!location) {
      // Redirect to home if no location is provided
      navigate('/');
      return;
    }

    if (location) {
      localStorage.setItem('location', location);
    }

    const loadCachedData = () => {
      const cachedCurrentWeather = localStorage.getItem('currentWeather');
      const cachedForecast = localStorage.getItem('forecast');

      if (cachedCurrentWeather && cachedForecast) {
        const parsedForecast = JSON.parse(cachedForecast);
        dispatch(setCurrentWeather(JSON.parse(cachedCurrentWeather)));
        dispatch(setForecast(parsedForecast));
        
        // Process today's hourly data from cache
        if (parsedForecast?.forecast?.forecastday?.[0]?.hour) {
          const processedData = prepareChartData(parsedForecast.forecast.forecastday[0].hour);
          setChartData(processedData);
        }
      }
    };

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

        // Cache the data
        localStorage.setItem('currentWeather', JSON.stringify(currentData));
        localStorage.setItem('forecast', JSON.stringify(forecastData));

        // Process today's hourly data
        if (forecastData?.forecast?.forecastday?.[0]?.hour) {
          const processedData = prepareChartData(forecastData.forecast.forecastday[0].hour);
          setChartData(processedData);
        }
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch weather data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadCachedData();
    fetchWeatherData();
  }, [city, dispatch, navigate]);

  // Add useEffect to update chart data when selectedChart changes
  useEffect(() => {
    if (forecast?.forecast?.forecastday) {
      let hourlyData;
      if (expandedDay !== null && forecast.forecast.forecastday[expandedDay]?.hour) {
        hourlyData = forecast.forecast.forecastday[expandedDay].hour;
      } else if (forecast.forecast.forecastday[0]?.hour) {
        hourlyData = forecast.forecast.forecastday[0].hour;
      }
      
      if (hourlyData) {
        const processedData = prepareChartData(hourlyData);
        setChartData(processedData);
      }
    }
  }, [selectedChart, forecast, expandedDay]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderChart = (data = chartData) => {
    if (!data || data.length === 0) {
      return (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed gray' }}>
          <Typography color="white">No chart data available</Typography>
        </Box>
      );
    }

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
      return (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed gray' }}>
          <Typography color="white">Invalid chart type selected</Typography>
        </Box>
      );
    }
    
    // Calculate min and max for better domain setting
    const values = data.map(item => Number(item[chartConfig.dataKey] || 0));
    const min = Math.floor(Math.min(...values)) || 0;
    const max = Math.ceil(Math.max(...values)) || 10;
    // Ensure bottom of chart is always -2 or lower
    const yDomain = [Math.min(min - 2, -2), max + 5];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id={`color${selectedChart}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartConfig.color} stopOpacity={0.6}/>
              <stop offset="100%" stopColor={chartConfig.color} stopOpacity={0}/>
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
              <feOffset in="blur" dx="0" dy="4" result="offsetBlur" />
              <feComponentTransfer in="offsetBlur" result="shadow">
                <feFuncA type="linear" slope="0.6" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <XAxis
            dataKey="time"
            stroke="white"
            tick={{ fill: 'white', fontSize: 12 }}
            tickCount={6}
          />
          <YAxis
            stroke="white"
            tick={{ fill: 'white', fontSize: 12 }}
            domain={yDomain}
            tickFormatter={(value) => `${value}${chartConfig.unit}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none', color: 'white' }}
            formatter={(value: number) => [`${value.toFixed(1)}${chartConfig.unit}`, chartConfig.label]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey={chartConfig.dataKey}
            stroke="none"
            fillOpacity={1}
            fill={`url(#color${selectedChart})`}
          />
          <Line
            type="monotone"
            dataKey={chartConfig.dataKey}
            stroke={chartConfig.color}
            strokeWidth={2.5}
            dot={{ fill: chartConfig.color, r: 3 }}
            activeDot={{ r: 6, fill: 'white', stroke: chartConfig.color }}
            filter="url(#shadow)"
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
                    Precipitation: {currentWeather.current.precip_mm}mm
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
                <Box sx={{ height: 300, mb: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                  {renderChart()}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  {forecast.forecast.forecastday.map((day, index) => (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </Typography>
                      <Box sx={{ my: 1 }}>
                        <img 
                          src={day.day.condition.icon} 
                          alt={day.day.condition.text}
                          width={40}
                          height={40}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#FFD700' }}>
                        {Math.round(day.day.maxtemp_c)}°
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'grey' }}>
                        {Math.round(day.day.mintemp_c)}°
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
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', px: 2 }}>
                  <Box sx={{ width: '180px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Date</Typography>
                  </Box>
                  <Box sx={{ width: '100px', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <span role="img" aria-label="temperature">🌡️</span> High/Low
                    </Typography>
                  </Box>
                  <Box sx={{ width: '200px', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <span role="img" aria-label="weather condition">☀️</span> Condition
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100px', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <span role="img" aria-label="precipitation">💧</span> Precip.
                    </Typography>
                  </Box>
                  <Box sx={{ width: '120px', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <span role="img" aria-label="wind">💨</span> Wind
                    </Typography>
                  </Box>
                  <Box sx={{ width: 40 }}></Box>
                </Box>
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
                    {Math.round(day.day.totalprecip_mm)}mm
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
                        <Box sx={{ height: 300, mb: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
                          {renderChart()}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          {forecast.forecast.forecastday.map((forecastDay, idx) => (
                            <Box key={idx} sx={{ textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ color: 'white' }}>
                                {idx === 0 ? 'Today' : new Date(forecastDay.date).toLocaleDateString('en-US', { weekday: 'short' })}
                              </Typography>
                              <Box sx={{ my: 1 }}>
                                <img 
                                  src={forecastDay.day.condition.icon} 
                                  alt={forecastDay.day.condition.text}
                                  width={40}
                                  height={40}
                                />
                              </Box>
                              <Typography variant="body2" sx={{ color: '#FFD700' }}>
                                {Math.round(forecastDay.day.maxtemp_c)}°
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'grey' }}>
                                {Math.round(forecastDay.day.mintemp_c)}°
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