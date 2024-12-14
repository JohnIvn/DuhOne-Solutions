import React, { useState } from 'react';
import { ExitToApp } from '@mui/icons-material';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { validateSignUpField, validateSignUpForm } from '../utilities/SignUpValidation';

const CreateAccountModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCooldown, setIsCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateSignUpField(field, value),
    }));
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Email is required',
      }));
      return;
    }

    if (isCooldown) return;

    try {
      const emailValidationResponse = await axios.post('http://localhost:3000/validateEmail', {
        email: formData.email,
      });
      if (emailValidationResponse.data.exist) {
        setError('This email is already registered.');
        return;
      }

      await axios.post('http://localhost:3000/send-code', { email: formData.email });
      setIsCooldown(true);
      setCountdown(30);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    }
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    const formErrors = validateSignUpForm(formData);
    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error) || !verificationCode) {
      setError('Please complete all fields and verify your email.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/verify-code', {
        email: formData.email,
        code: verificationCode,
      });

      await axios.post('http://localhost:3000/signup', formData);

      // Close the modal on success
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Account creation failed. Please try again.');
    }
  };

  return (
    <Modal open={show} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
<Button variant="secondary" onClick={onClose}>
          <ExitToApp/>
        </Button>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleCreateAccount}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            error={!!errors.firstName}
            helperText={errors.firstName}
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName}
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleSendCode}
                    disabled={isCooldown}
                  >
                    {isCooldown ? `Wait ${countdown}s` : 'Send Code'}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Verification Code"
            fullWidth
            margin="normal"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateAccountModal;
