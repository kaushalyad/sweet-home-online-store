import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Alert,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { backendUrl, currency } from '../config';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [data, setData] = useState({
    sales: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      salesByTime: [],
      salesByCategory: [],
      topSellingProducts: [],
      paymentMethods: [],
      topCustomers: [],
      paymentStats: {}
    },
    userBehavior: {
      totalSessions: 0,
      uniqueUsers: 0,
      conversionRate: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
      averageTimeOnSite: 0,
      deviceDistribution: {},
      osDistribution: {}
    },
    customerSegments: {
      newVsReturning: { new: 0, returning: 0 },
      averageCustomerValue: 0
    },
    pageVisits: {
      pages: []
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const cleanToken = token.replace(/^Bearer\s+/i, '');
        const authToken = `Bearer ${cleanToken}`;

        const axiosConfig = {
          headers: { 
            Authorization: authToken,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        };

        const [salesRes, behaviorRes, segmentsRes, pageVisitsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/analytics/sales-analytics?timeRange=${timeRange}`, axiosConfig),
          axios.get(`${backendUrl}/api/analytics/user-behavior?timeRange=${timeRange}`, axiosConfig),
          axios.get(`${backendUrl}/api/analytics/customer-segments?timeRange=${timeRange}`, axiosConfig),
          axios.get(`${backendUrl}/api/analytics/page-visits?timeRange=${timeRange}`, axiosConfig)
        ]);

        const salesData = salesRes.data?.data || {};
        const behaviorData = behaviorRes.data?.data || {};
        const segmentsData = segmentsRes.data?.data || {};
        const pageVisitsData = pageVisitsRes.data?.data || {};

        setData({
          sales: {
            totalRevenue: salesData.totalRevenue || 0,
            totalOrders: salesData.totalOrders || 0,
            averageOrderValue: salesData.averageOrderValue || 0,
            salesByTime: salesData.salesTrend || [],
            salesByCategory: salesData.categoryData || [],
            topSellingProducts: salesData.topSellingProducts || [],
            paymentMethods: salesData.paymentMethods || [],
            topCustomers: segmentsData.topCustomers || [],
            paymentStats: salesData.paymentStats || {}
          },
          userBehavior: {
            totalSessions: behaviorData.totalSessions || 0,
            uniqueUsers: behaviorData.uniqueUsers || 0,
            conversionRate: behaviorData.conversionRate || 0,
            averageSessionDuration: behaviorData.averageSessionDuration || 0,
            bounceRate: behaviorData.bounceRate || 0,
            averageTimeOnSite: behaviorData.averageTimeOnSite || 0,
            deviceDistribution: behaviorData.deviceDistribution || {},
            osDistribution: behaviorData.osDistribution || {}
          },
          customerSegments: {
            newVsReturning: segmentsData.newVsReturning || { new: 0, returning: 0 },
            averageCustomerValue: segmentsData.averageCustomerValue || 0
          },
          pageVisits: {
            pages: pageVisitsData.pages || []
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token, timeRange]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const formatCurrency = (amount) => {
    return `${currency} ${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatPercentage = (value) => {
    return `${Number(value).toFixed(1)}%`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard Overview
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="day">Last 24 Hours</MenuItem>
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
            <MenuItem value="year">Last 12 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Sales Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(data.sales.totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders: {data.sales.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Average Order Value
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(data.sales.averageOrderValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Average Customer Value
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(data.customerSegments.averageCustomerValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Method Breakdown */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Method Breakdown
          </Typography>
          <Grid container spacing={2}>
            {data.sales.paymentMethods.map((method) => (
              <Grid item xs={12} sm={6} key={method._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {method._id.toLowerCase() === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      ₹ {method.total.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {method.count} orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {method.percentage.toFixed(1)}% of total payments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* Sales by Category */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Sales by Category
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {data.sales.salesByCategory.map((category) => (
            <Grid item xs={12} md={4} key={category.category}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    {category.category || 'Uncategorized'}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(category.totalSales)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPercentage(category.percentage)} of total sales
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity Sold: {category.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders: {category.orderCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Top Selling Products */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Top Selling Products
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {data.sales.topSellingProducts.map((product, index) => (
            <Grid item xs={12} md={4} key={product._id || index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.primary">
                    {product.name || 'Unnamed Product'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {product.category || 'Uncategorized'}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(product.totalSales)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity Sold: {product.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders: {product.orderCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Price: {formatCurrency(product.averagePrice)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* User Behavior Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Sessions
              </Typography>
              <Typography variant="h4" color="primary">
                {data.userBehavior.totalSessions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Unique Users
              </Typography>
              <Typography variant="h4" color="primary">
                {data.userBehavior.uniqueUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Conversion Rate
              </Typography>
              <Typography variant="h4" color="primary">
                {formatPercentage(data.userBehavior.conversionRate)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Bounce Rate
              </Typography>
              <Typography variant="h4" color="primary">
                {formatPercentage(data.userBehavior.bounceRate)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Device Distribution */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Device Distribution
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {Object.entries(data.userBehavior.deviceDistribution).map(([device, count]) => (
            <Grid item xs={12} md={4} key={device}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    {device.charAt(0).toUpperCase() + device.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {typeof count === 'object' ? count.value || 0 : count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPercentage((typeof count === 'object' ? count.value || 0 : count) / data.userBehavior.totalSessions * 100)} of total sessions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* OS Distribution */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Operating System Distribution
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {Object.entries(data.userBehavior.osDistribution).map(([os, count]) => (
            <Grid item xs={12} md={4} key={os}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    {os}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {typeof count === 'object' ? count.value || 0 : count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPercentage((typeof count === 'object' ? count.value || 0 : count) / data.userBehavior.totalSessions * 100)} of total sessions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Top Customers */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Top Customers
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {data.sales.topCustomers.map((customer) => (
            <Grid item xs={12} md={4} key={customer.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    {customer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.email}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(customer.totalSpent)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.orderCount} orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Most Visited Pages */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Most Visited Pages
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {data.pageVisits?.pages?.map((page) => (
            <Grid item xs={12} md={4} key={page.path}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    {page.path}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {page.visits} visits
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Time: {Math.round(page.averageTimeSpent / 60)} min
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bounce Rate: {formatPercentage(page.bounceRate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unique Views: {page.uniqueViews}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 