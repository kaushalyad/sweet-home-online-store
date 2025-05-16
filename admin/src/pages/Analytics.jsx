import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  TextField
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState({
    userBehavior: null,
    sales: null,
    conversion: null,
    segments: null
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, startDate, endDate, token]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const [userBehavior, sales, conversion, segments] = await Promise.all([
        axios.get(`${backendUrl}/api/analytics/user-behavior`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange, startDate, endDate }
        }),
        axios.get(`${backendUrl}/api/analytics/sales-analytics`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange, startDate, endDate }
        }),
        axios.get(`${backendUrl}/api/analytics/conversion-rates`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange, startDate, endDate }
        }),
        axios.get(`${backendUrl}/api/analytics/customer-segments`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange, startDate, endDate }
        })
      ]);

      setAnalyticsData({
        userBehavior: userBehavior.data.data,
        sales: sales.data.data,
        conversion: conversion.data.data,
        segments: segments.data.data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const renderTimeSeriesChart = (data, dataKey, title) => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );

  const renderBarChart = (data, dataKey, title) => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );

  const renderPieChart = (data, dataKey, title) => {
    const chartData = data || [];
    
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    );
  };

  const renderAreaChart = (data, title, dataKey) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={dataKey} fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Advanced Analytics Dashboard
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
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
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {timeRange === 'custom' && (
              <>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Paper>

        {/* User Behavior */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            {renderTimeSeriesChart(analyticsData.userBehavior?.sessionData, 'sessionId', 'Sessions Over Time')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderPieChart(analyticsData.userBehavior?.deviceDistribution, 'value', 'Device Distribution')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderPieChart(analyticsData.userBehavior?.browserDistribution, 'value', 'Browser Distribution')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderPieChart(analyticsData.userBehavior?.osDistribution, 'value', 'OS Distribution')}
          </Grid>
        </Grid>

        {/* Sales Analytics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            {renderTimeSeriesChart(
              analyticsData.sales?.salesTrend?.map(item => ({
                date: item._id,
                sales: item.sales || 0
              })) || [],
              'sales',
              'Sales Over Time'
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderPieChart(
              analyticsData.sales?.categoryData?.map(item => ({
                name: item.category || 'Uncategorized',
                value: item.totalSales || 0,
                percentage: item.percentage || 0
              })) || [],
              'value',
              'Sales by Category'
            )}
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
              <Grid container spacing={2}>
                {analyticsData.sales?.topSellingProducts?.length > 0 ? (
                  analyticsData.sales.topSellingProducts.map((product) => (
                    <Grid item xs={12} md={4} key={product._id}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1">{product.name || 'Unknown Product'}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Category: {product.category || 'Uncategorized'}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ₹{Number(product.totalSales || 0).toFixed(2)}
                          </Typography>
                          <Typography variant="body2">
                            Quantity Sold: {product.quantity || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary" align="center">
                      No top selling products data available
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">₹{Number(analyticsData.sales?.totalRevenue || 0).toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {analyticsData.sales?.totalOrders || 0} orders
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Average Order Value</Typography>
              <Typography variant="h4">₹{Number(analyticsData.sales?.averageOrderValue || 0).toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">
                Per Order
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Conversion Rate</Typography>
              <Typography variant="h4">{Number(analyticsData.conversion?.overallRate || 0).toFixed(1)}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Sessions</Typography>
              <Typography variant="h4">{analyticsData.userBehavior?.totalSessions || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Payment Methods */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Payment Methods</Typography>
              <Grid container spacing={2}>
                {analyticsData.sales?.paymentMethods?.map((method) => (
                  <Grid item xs={12} md={6} key={method._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1">{method._id || 'Unknown'}</Typography>
                        <Typography variant="h6" color="primary">
                          ₹{Number(method.total || 0).toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          {method.count || 0} orders
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {((method.total / (analyticsData.sales?.totalRevenue || 1)) * 100).toFixed(1)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Conversion Rates */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            {renderPieChart(analyticsData.conversion?.deviceData, 'value', 'Conversion by Device')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderBarChart(analyticsData.conversion?.pageData, 'conversion', 'Conversion by Page')}
          </Grid>
        </Grid>

        {/* Customer Segments */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderPieChart(analyticsData.segments?.demographics, 'value', 'Customer Demographics')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderBarChart(analyticsData.segments?.purchaseFrequency, 'customers', 'Purchase Frequency')}
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Analytics; 