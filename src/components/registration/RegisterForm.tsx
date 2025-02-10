import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/UserService';
import styles from './RegisterForm.module.css';

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
    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    if (formData.profilePicture) formDataToSend.append('image', formData.profilePicture);
    try {
      const res = await registerUser(formDataToSend);
      setMessage(res.status === 201 ? `Your account has been created.` : `Account already exists!`);
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.status === 409) {
        setMessage('Account already exists');
      } else {
        setMessage('Registration failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={styles.registerForm}>
      <Box className={styles.profilePictureContainer}>
        <div className={styles.avatarContainer}>
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
            className={styles.editIcon}
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
    </form>
  );
}
