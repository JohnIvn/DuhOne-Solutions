import React, { useState } from 'react';
import { 
  Container, Box, TextField, Button, Typography, Link, Divider, Grid, IconButton, InputAdornment 
} from '@mui/material';
import { Google as GoogleIcon, Visibility, VisibilityOff, Person as PersonIcon } from '@mui/icons-material';import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx'
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
  
      console.log("Response from backend:", response.data);  
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role); 
      console.log(localStorage.getItem('role'));
      console.log('Sign in successful:', response.data);
  
      if (response.data.redirectTo) {
        console.log('Redirecting to:', response.data.redirectTo); 
        navigate(response.data.redirectTo); 
      } else {
        console.log('Redirecting to homepage');
        navigate('/homepage'); 
      }
  
    } catch (error) {
      console.error('Error signing in:', error);
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
            width: '600px',
            textAlign: 'center',
            marginRight: 10,
          }}
        >
          <img
            src="https://cdn.discordapp.com/attachments/1296104834432368797/1311562875893977168/LOGO_PARA_KAY_PJ.png?ex=6753db9d&is=67528a1d&hm=58800d4a5f1f2c1a8719aa89f6c15a794e57795861833988e8e9989cf8d253c3&"
            alt="Logo"
            style={{ width: '450px', height: '170px' , marginBottom: '16px', marginLeft: '10%' }}
          />
          <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold' , ml: 12, mt: -5}}>
            "It's not just the one, It's DuhOne"
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '700px',
            p: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            marginRight: "-30px",
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
          <Divider sx={{ my: 5, borderColor: 'rgba(255, 255, 255, 0.9)', color: "white"}}>or</Divider>
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
}

export default SignIn;
