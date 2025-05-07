import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { backendUrl } from '../App';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authorized. Please login again.');
        return;
      }
      const response = await axios.get(`${backendUrl}/api/user/list`, {
        headers: { Authorization: token }
      });
      if (response.data.success) {
        setUsers(response.data.users);
        setError(null);
      } else {
        setError(response.data.message || 'Error fetching users');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'user'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authorized. Please login again.');
        return;
      }
      if (selectedUser) {
        await axios.put(
          `${backendUrl}/api/user/${selectedUser._id}`,
          formData,
          {
            headers: { Authorization: token }
          }
        );
      } else {
        await axios.post(
          `${backendUrl}/api/user/add`,
          formData,
          {
            headers: { Authorization: token }
          }
        );
      }
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authorized. Please login again.');
          return;
        }
        await axios.delete(`${backendUrl}/api/user/${userId}`, {
          headers: { Authorization: token }
        });
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting user');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !users.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" component="h1" gutterBottom>
        Users Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="role"
              label="Role"
              select
              value={formData.role}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              SelectProps={{
                native: true
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedUser ? 'Update' : 'Add'} User
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Users; 