/** @jsxImportSource react */
import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const UserBehavior = () => {
  console.log('UserBehavior component mounted');
  const { token } = useContext(AuthContext);
  const [behaviors, setBehaviors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    action: '',
    device: '',
    browser: '',
    os: '',
    startDate: null,
    endDate: null
  });
  const [summary, setSummary] = useState({
    totalSessions: 0,
    uniqueUsers: 0,
    totalActions: 0,
    deviceDistribution: {},
    browserDistribution: {},
    osDistribution: {}
  });
  const [purchaseLocations, setPurchaseLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  console.log('Current state:', {
    token: !!token,
    loading,
    purchaseLocations,
    mapLoaded,
    activeTab
  });

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  const center = {
    lat: 20.5937, // Default to India's center
    lng: 78.9629
  };

  const fetchData = async () => {
    console.log('Fetching data...');
    try {
      setLoading(true);
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString()
      });

      console.log('Making API requests...');
      
      const [behaviorResponse, locationsResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/analytics/all-behavior?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendUrl}/api/analytics/purchase-locations`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      console.log('API Responses:', {
        behavior: behaviorResponse.data,
        locations: locationsResponse.data
      });
      
      if (behaviorResponse.data.success) {
        setBehaviors(behaviorResponse.data.data.behaviors);
        setTotal(behaviorResponse.data.data.pagination.total);
        setSummary(behaviorResponse.data.data.summary);
      }

      if (locationsResponse.data.success) {
        console.log('Setting purchase locations:', locationsResponse.data.data);
        setPurchaseLocations(locationsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');
    fetchData();
  }, [token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderDistributionChart = (distribution, title) => {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    const sortedData = Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Show top 5 items

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        {sortedData.map(([key, value]) => (
          <Box key={key} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{key}</Typography>
              <Typography variant="body2">
                {Math.round((value / total) * 100)}% ({value})
              </Typography>
            </Box>
            <Box sx={{ 
              width: '100%', 
              height: 8, 
              bgcolor: 'grey.200', 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Box
                sx={{
                  width: `${(value / total) * 100}%`,
                  height: '100%',
                  bgcolor: 'primary.main',
                  transition: 'width 0.3s ease-in-out'
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const renderTimeSeriesChart = (data, title) => {
    if (!data || data.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Box sx={{ height: 300, position: 'relative' }}>
          {data.map((item, index) => (
            <Box
              key={item.date}
              sx={{
                position: 'absolute',
                left: `${(index / (data.length - 1)) * 100}%`,
                bottom: 0,
                width: '2px',
                height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                bgcolor: 'primary.main',
                transform: 'translateX(-50%)'
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const getMarkerColor = (amount) => {
    if (amount > 10000) return 'red';
    if (amount > 5000) return 'orange';
    if (amount > 1000) return 'yellow';
    return 'green';
  };

  const onMapLoad = useCallback(() => {
    console.log('Map loaded');
    setMapLoaded(true);
  }, []);

  const renderMap = () => {
    console.log('Rendering map...');
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      console.error('No Google Maps API key found');
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">
            Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
          </Typography>
        </Box>
      );
    }

    // Group locations by city and state to handle duplicates
    const groupedLocations = purchaseLocations.reduce((acc, location) => {
      const key = `${location.city}-${location.state}`;
      if (!acc[key]) {
        acc[key] = {
          ...location,
          orderCount: 0,
          totalAmount: 0,
          statuses: new Set()
        };
      }
      acc[key].orderCount += location.orderCount;
      acc[key].totalAmount += location.totalAmount;
      location.statuses.forEach(status => acc[key].statuses.add(status));
      return acc;
    }, {});

    // Convert grouped locations to array and format statuses
    const uniqueLocations = Object.values(groupedLocations).map(location => ({
      ...location,
      statuses: Array.from(location.statuses),
      id: `${location.city}-${location.state}-${location.latitude}-${location.longitude}`
    }));

    console.log('Map state:', {
      locations: uniqueLocations,
      mapLoaded,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    return (
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={onMapLoad}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
        >
          {mapLoaded && uniqueLocations.map((location) => {
            console.log('Rendering marker for location:', location);
            if (!location.hasCoordinates) {
              return null; // Skip locations without coordinates
            }
            return (
              <Marker
                key={location.id}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: getMarkerColor(location.totalAmount),
                  fillOpacity: 0.7,
                  strokeWeight: 2,
                  strokeColor: '#000',
                  scale: 10
                }}
                onClick={() => setSelectedLocation(location)}
              />
            );
          })}
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <h3>{selectedLocation.city}, {selectedLocation.state}</h3>
                <p>Total Orders: {selectedLocation.orderCount}</p>
                <p>Total Amount: ₹{selectedLocation.totalAmount.toLocaleString()}</p>
                <p>Last Purchase: {new Date(selectedLocation.lastPurchase).toLocaleDateString()}</p>
                <p>Order Statuses: {selectedLocation.statuses.join(', ')}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Advanced Analytics Dashboard
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Analytics" />
          <Tab label="Purchase Locations" />
        </Tabs>

        {activeTab === 0 ? (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Sessions</Typography>
                    <Typography variant="h4">{summary.totalSessions.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Unique Users</Typography>
                    <Typography variant="h4">{summary.uniqueUsers.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Actions</Typography>
                    <Typography variant="h4">{summary.totalActions.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Conversion Rate</Typography>
                    <Typography variant="h4">
                      {((summary.totalActions / summary.totalSessions) * 100).toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Distribution Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  {renderDistributionChart(summary.deviceDistribution, 'Device Distribution')}
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  {renderDistributionChart(summary.browserDistribution, 'Browser Distribution')}
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  {renderDistributionChart(summary.osDistribution, 'OS Distribution')}
                </Card>
              </Grid>
            </Grid>

            {/* Time Series Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  {renderTimeSeriesChart(
                    behaviors.map(b => ({
                      date: new Date(b.timestamp).toISOString().split('T')[0],
                      value: b.sessionDuration || 0
                    })),
                    'Sessions Over Time'
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  {renderTimeSeriesChart(
                    behaviors.map(b => ({
                      date: new Date(b.timestamp).toISOString().split('T')[0],
                      value: b.interactions?.length || 0
                    })),
                    'User Interactions Over Time'
                  )}
                </Card>
              </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Action</InputLabel>
                    <Select
                      value={filters.action}
                      label="Action"
                      onChange={(e) => handleFilterChange('action', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="view">View</MenuItem>
                      <MenuItem value="add_to_cart">Add to Cart</MenuItem>
                      <MenuItem value="remove_from_cart">Remove from Cart</MenuItem>
                      <MenuItem value="checkout">Checkout</MenuItem>
                      <MenuItem value="purchase">Purchase</MenuItem>
                      <MenuItem value="search">Search</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Device</InputLabel>
                    <Select
                      value={filters.device}
                      label="Device"
                      onChange={(e) => handleFilterChange('device', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="desktop">Desktop</MenuItem>
                      <MenuItem value="mobile">Mobile</MenuItem>
                      <MenuItem value="tablet">Tablet</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Browser</InputLabel>
                    <Select
                      value={filters.browser}
                      label="Browser"
                      onChange={(e) => handleFilterChange('browser', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Chrome">Chrome</MenuItem>
                      <MenuItem value="Firefox">Firefox</MenuItem>
                      <MenuItem value="Safari">Safari</MenuItem>
                      <MenuItem value="Edge">Edge</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>OS</InputLabel>
                    <Select
                      value={filters.os}
                      label="OS"
                      onChange={(e) => handleFilterChange('os', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Windows">Windows</MenuItem>
                      <MenuItem value="MacOS">MacOS</MenuItem>
                      <MenuItem value="Linux">Linux</MenuItem>
                      <MenuItem value="iOS">iOS</MenuItem>
                      <MenuItem value="Android">Android</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(date) => handleFilterChange('startDate', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(date) => handleFilterChange('endDate', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Data Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Page</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Device</TableCell>
                    <TableCell>Browser</TableCell>
                    <TableCell>OS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    behaviors.map((behavior) => (
                      <TableRow key={behavior._id}>
                        <TableCell>
                          {new Date(behavior.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {behavior.userId ? behavior.userId.email : 'Anonymous'}
                        </TableCell>
                        <TableCell>{behavior.action}</TableCell>
                        <TableCell>{behavior.page}</TableCell>
                        <TableCell>
                          {behavior.productId ? behavior.productId.name : '-'}
                        </TableCell>
                        <TableCell>{behavior.device}</TableCell>
                        <TableCell>{behavior.browser}</TableCell>
                        <TableCell>{behavior.os}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </>
        ) : (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Purchase Locations
            </Typography>
            <Box sx={{ height: '500px', width: '100%' }}>
              {renderMap()}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Legend:
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'red', borderRadius: '50%', mr: 1 }} />
                    <Typography>₹10,000+</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'orange', borderRadius: '50%', mr: 1 }} />
                    <Typography>₹5,000 - ₹10,000</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'yellow', borderRadius: '50%', mr: 1 }} />
                    <Typography>₹1,000 - ₹5,000</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'green', borderRadius: '50%', mr: 1 }} />
                    <Typography>Below ₹1,000</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default UserBehavior; 