/** @jsxImportSource react */
import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
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
  const [userSegments, setUserSegments] = useState({
    segments: {
      frequent_buyers: [],
      browsers: [],
      cart_abandoners: [],
      new_users: [],
      loyal_customers: []
    },
    statistics: [],
    totalUsers: 0
  });
  const [liveTraffic, setLiveTraffic] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [purchaseLocations, setPurchaseLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

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
    lat: 20.5937, // Center of India
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
      
      const [behaviorResponse, locationsResponse, segmentsResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/analytics/all-behavior?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendUrl}/api/analytics/purchase-locations`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendUrl}/api/analytics/user-segments`, {
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

      if (segmentsResponse.data.success) {
        setUserSegments(segmentsResponse.data.data);
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

  // Socket.IO for real-time tracking
  useEffect(() => {
    if (token) {
      const socketConnection = io('http://localhost:4000', {
        auth: {
          token: token
        }
      });

      socketConnection.on('connect', () => {
        console.log('Connected to real-time server');
        socketConnection.emit('join-admin-room');
        setIsRealTimeEnabled(true);
      });

      socketConnection.on('live-traffic', (data) => {
        console.log('Live traffic event:', data);
        setLiveTraffic(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 events
      });

      socketConnection.on('disconnect', () => {
        console.log('Disconnected from real-time server');
        setIsRealTimeEnabled(false);
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
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

  const onGoogleLoad = useCallback(() => {
    console.log('Google Maps API loaded');
    setGoogleLoaded(true);
  }, []);

  const getMarkerIcon = (amount) => {
    if (!googleLoaded) return null;
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: getMarkerColor(amount),
      fillOpacity: 0.7,
      strokeWeight: 2,
      strokeColor: '#000',
      scale: 10
    };
  };

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

    console.log('Purchase locations before grouping:', purchaseLocations);

    // Group locations by exact coordinates and user
    const groupedLocations = purchaseLocations.reduce((acc, location) => {
      const key = `${location.latitude}-${location.longitude}-${location.userId}`;
      if (!acc[key]) {
        acc[key] = {
          city: location.city,
          state: location.state,
          latitude: location.latitude,
          longitude: location.longitude,
          hasCoordinates: location.hasCoordinates,
          userId: location.userId,
          userName: location.userName,
          userEmail: location.userEmail,
          totalAmount: 0,
          items: [],
          orderCount: 0,
          lastPurchase: null,
          statuses: new Set()
        };
      }
      
      // Add item to the user's items array
      acc[key].items.push({
        itemId: location.itemId,
        itemName: location.itemName,
        itemQuantity: location.itemQuantity,
        totalAmount: location.totalAmount,
        statuses: location.statuses
      });
      
      // Update user's total amount and other stats
      acc[key].totalAmount += location.totalAmount;
      acc[key].orderCount += location.orderCount;
      if (!acc[key].lastPurchase || new Date(location.lastPurchase) > new Date(acc[key].lastPurchase)) {
        acc[key].lastPurchase = location.lastPurchase;
      }
      // Only add Delivered status if it exists
      if (location.statuses.includes('Delivered')) {
        acc[key].statuses.add('Delivered');
      }
      
      return acc;
    }, {});

    // Convert grouped locations to array and convert statuses Set to Array
    const uniqueLocations = Object.values(groupedLocations).map(location => ({
      ...location,
      statuses: Array.from(location.statuses)
    }));

    console.log('Grouped locations:', groupedLocations);
    console.log('Unique locations:', uniqueLocations);

    return (
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={onGoogleLoad}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
          onLoad={onMapLoad}
        >
          {mapLoaded && googleLoaded && uniqueLocations.map((location) => {
            console.log('Processing location:', location);
            if (!location.hasCoordinates || !location.latitude || !location.longitude) {
              console.log('Skipping location without coordinates:', location);
              return null;
            }

            const lat = parseFloat(location.latitude);
            const lng = parseFloat(location.longitude);

            console.log('Creating marker for user:', {
              user: location,
              position: { lat, lng }
            });

            const icon = getMarkerIcon(location.totalAmount);
            if (!icon) return null;

            return (
              <Marker
                key={`${location.latitude}-${location.longitude}-${location.userId}`}
                position={{ lat, lng }}
                icon={icon}
                onClick={() => setSelectedLocation(location)}
              />
            );
          })}
          {selectedLocation && googleLoaded && (
            <InfoWindow
              position={{ 
                lat: parseFloat(selectedLocation.latitude), 
                lng: parseFloat(selectedLocation.longitude)
              }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <h3>{selectedLocation.city}, {selectedLocation.state}</h3>
                <p>User: {selectedLocation.userName || selectedLocation.userEmail}</p>
                <p>Total Amount: ₹{selectedLocation.totalAmount.toLocaleString()}</p>
                <p>Order Count: {selectedLocation.orderCount}</p>
                <p>Last Purchase: {new Date(selectedLocation.lastPurchase).toLocaleDateString()}</p>
                <p>Status: {selectedLocation.statuses.includes('Delivered') ? 'Delivered' : 'Processing'}</p>
                <h4>Items Purchased:</h4>
                <ul>
                  {selectedLocation.items.map((item, index) => (
                    <li key={index}>
                      {item.itemName} - Quantity: {item.itemQuantity} - Amount: ₹{item.totalAmount.toLocaleString()}
                      {item.statuses.includes('Delivered') && ' ✓'}
                    </li>
                  ))}
                </ul>
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
          <Tab label="User Segments" />
          <Tab label="Real-time Traffic" />
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
        ) : activeTab === 1 ? (
          <>
            {/* User Segments */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Users</Typography>
                    <Typography variant="h4">{userSegments.totalUsers.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Frequent Buyers</Typography>
                    <Typography variant="h4">{userSegments.segments.frequent_buyers.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Browsers</Typography>
                    <Typography variant="h4">{userSegments.segments.browsers.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Cart Abandoners</Typography>
                    <Typography variant="h4">{userSegments.segments.cart_abandoners.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Segments Chart */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>User Segments Distribution</Typography>
                    {renderSegmentsChart(userSegments.statistics)}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Segment Details */}
            <Grid container spacing={3}>
              {Object.entries(userSegments.segments).map(([segment, users]) => (
                <Grid item xs={12} md={6} key={segment}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {segment.replace('_', ' ').toUpperCase()} ({users.length})
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Email</TableCell>
                              {segment === 'frequent_buyers' && <TableCell>Orders</TableCell>}
                              {segment === 'browsers' && <TableCell>Page Views</TableCell>}
                              {segment === 'cart_abandoners' && <TableCell>Cart Actions</TableCell>}
                              {segment === 'loyal_customers' && <TableCell>Account Age</TableCell>}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {users.slice(0, 5).map((user) => (
                              <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                {segment === 'frequent_buyers' && <TableCell>{user.orderCount}</TableCell>}
                                {segment === 'browsers' && <TableCell>{user.pageViews}</TableCell>}
                                {segment === 'cart_abandoners' && <TableCell>{user.cartActionsCount}</TableCell>}
                                {segment === 'loyal_customers' && <TableCell>{user.accountAge} days</TableCell>}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : activeTab === 2 ? (
          <>
            {/* Real-time Traffic */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Real-time Status</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: isRealTimeEnabled ? 'success.main' : 'error.main',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2">
                        {isRealTimeEnabled ? 'Connected' : 'Disconnected'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Active Users</Typography>
                    <Typography variant="h4">{liveTraffic.length}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 10 activities
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Live Traffic Feed
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Path</TableCell>
                      <TableCell>Device</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {liveTraffic.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>
                          {event.userId ? 'Logged In' : 'Anonymous'}
                        </TableCell>
                        <TableCell>{event.path}</TableCell>
                        <TableCell>
                          {event.deviceInfo?.isMobile ? 'Mobile' :
                           event.deviceInfo?.isTablet ? 'Tablet' : 'Desktop'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
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