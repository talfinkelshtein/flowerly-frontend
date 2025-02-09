import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../services/UserService';
import './RegisterForm.css';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture?: File;
}

interface RegisterFormProps {
  setMessage: (message: string | null) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

export default function RegisterForm({ setMessage }: RegisterFormProps) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setValue('profilePicture', file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (formData.profilePicture) {
        formDataToSend.append('image', formData.profilePicture);
      }

      const res = await registerUser(formDataToSend);
      setMessage(res.status === 200 ? `Your account has been created.` : `Account already exists!`);
    } catch (err) {
      console.error('Registration error:', err);
      setMessage('Registration failed');
    }
  };

  const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse);

      if (response.status === 200) {
        setMessage('Logged in via Google!');
        navigate('/');
      } else {
        const errorMessage = await response.json();
        setMessage(errorMessage.message || "Couldn't login!");
      }
    } catch (error) {
      console.error('Google login error:', error);
      setMessage('Login via Google failed');
    }
  };

  const googleErrorMessage = () => {
    console.log('Google login error');
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="register-form">
      <Box className="profile-picture-container">
        <div className="avatar-container">
          <Avatar
            src={profilePreview || undefined}
            sx={{
              width: 150, // Increased width
              height: 150, // Increased height
              border: '3px solid #007bff', // Blue border
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
          <IconButton
            className="edit-icon"
            component="label"
            sx={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
              padding: '5px',
            }}
          >
            <EditIcon />
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </IconButton>
        </div>
      </Box>

      <Box mb={2}>
        <TextField
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: EMAIL_PATTERN, message: 'Invalid email format' },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Box>

      <Box mb={2}>
        <TextField
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: PASSWORD_MIN_LENGTH,
              message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </Box>

      <Box mb={2}>
        <TextField
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
      </Box>

      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>

      <div className="google-login-container">
        <GoogleLogin onSuccess={onGoogleSuccess} onError={googleErrorMessage} />
      </div>
    </form>
  );
}
