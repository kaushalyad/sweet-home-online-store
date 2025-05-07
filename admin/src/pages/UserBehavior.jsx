/** @jsxImportSource react */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
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
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const UserBehavior = () => {
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
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

      const response = await axios.get(`${backendUrl}/api/analytics/all-behavior?${params}`, {
        headers: {
          Authorization: token
        }
      });
      
      if (response.data.success) {
        setBehaviors(response.data.data.behaviors);
        setTotal(response.data.data.pagination.total);
        setSummary(response.data.data.summary);
      }
    } catch (error) {
      console.error('Error fetching user behavior data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filters]);

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

  const renderDistributionChart = (distribution) => {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    return Object.entries(distribution).map(([key, value]) => (
      <Box key={key} sx={{ mb: 1 }}>
        <Typography variant="body2">{key}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: `${(value / total) * 100}%`,
              height: 20,
              bgcolor: 'primary.main',
              borderRadius: 1
            }}
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {Math.round((value / total) * 100)}%
          </Typography>
        </Box>
      </Box>
    ));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Behavior Analytics
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Sessions</Typography>
                <Typography variant="h4">{summary.totalSessions}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Unique Users</Typography>
                <Typography variant="h4">{summary.uniqueUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Actions</Typography>
                <Typography variant="h4">{summary.totalActions}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Distribution Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Device Distribution</Typography>
                {renderDistributionChart(summary.deviceDistribution)}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Browser Distribution</Typography>
                {renderDistributionChart(summary.browserDistribution)}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">OS Distribution</Typography>
                {renderDistributionChart(summary.osDistribution)}
              </CardContent>
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
      </Box>
    </LocalizationProvider>
  );
};

export default UserBehavior; 