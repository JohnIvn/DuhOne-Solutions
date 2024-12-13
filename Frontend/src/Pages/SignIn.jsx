import React, { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography, Link, Divider, IconButton, InputAdornment
} from '@mui/material';
import { Google as GoogleIcon, Visibility, VisibilityOff, Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/signin', formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      if (response.data.redirectTo) {
        navigate(response.data.redirectTo);
      } else {
        navigate('/homepage');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens, row on medium and up
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '100vh',
          background: "linear-gradient(to bottom right, #051b36, #000000)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          px: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            mb: { xs: 4, md: 0 }, // Add margin on smaller screens
          }}
        >
          <img
            src="https://cdn.discordapp.com/attachments/1296104834432368797/1311562875893977168/LOGO_PARA_KAY_PJ.png?ex=675d161d&is=675bc49d&hm=adbb543948b87f44ff78d72870ec0601a48bf859d1feba3583cbd384b24d3ac5&"
            alt="Logo"
            style={{
              width: '100%',
              maxWidth: '300px', // Restrict size for smaller screens
              height: 'auto',
              marginBottom: '16px',
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: '#ffffff',
              fontWeight: 'bold',
              px: 2, // Add padding for better alignment
            }}
          >
            "It's not just the one, It's DuhOne"
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            p: { xs: 3, sm: 5, md: 10 }, // Adjust padding based on screen size
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <PersonIcon
              sx={{
                fontSize: 64,
                color: '#ffffff',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '50%',
                p: 2,
              }}
            />
          </Box>
          <Typography variant="h4" align="center" sx={{ mb: 2, color: '#ffffff', fontWeight: 'bold' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 4, color: '#e0e0e0' }}>
            Please sign in to continue.
          </Typography>
          {error && (
            <Typography variant="body2" sx={{ color: '#ff4d4f', textAlign: 'center', mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSignIn}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: '#bdbdbd' } }}
              InputProps={{ style: { color: '#ffffff' } }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: '#bdbdbd' } }}
              InputProps={{
                style: { color: '#ffffff' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: '#ffffff' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
                color: '#ffffff',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': { background: 'linear-gradient(to right, #ff4b2b, #ff416c)' },
              }}
            >
              Sign In
            </Button>
            <Typography variant="body2" align="center" sx={{ color: '#ffffff', mb: 2 }}>
              Don't have an account?{' '}
              <Link href="/signup" sx={{ color: '#ff4b2b' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
          <Divider sx={{ my: 5, borderColor: 'rgba(255, 255, 255, 0.9)' }}>or</Divider>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            sx={{
              color: '#ffffff',
              borderColor: '#ffffff',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              borderRadius: '8px',
            }}
          >
            Sign in with Google
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 3, color: '#e0e0e0' }}>
            <Link href="/forgot-password" sx={{ color: '#e0e0e0' }}>
              Forgot Password?
            </Link>
          </Typography>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default SignIn;
