import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../services/UserService';
import styles from './RegisterForm.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').regex(EMAIL_PATTERN, 'Invalid email format'),
    password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    profilePicture: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  setMessage: (message: string | null) => void;
}

export default function RegisterForm({ setMessage }: RegisterFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

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
      const response = await login({ email: formData.email, password: formData.password });
      if (response.status === 200) navigate('/');
      else console.error('Error logging in user:', response);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
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
              width: 150,
              height: 150,
              border: '3px solid #007bff',
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
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Box>

      <Box mb={2}>
        <TextField
          label="Password"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </Box>

      <Box mb={2}>
        <TextField
          label="Confirm Password"
          type="password"
          {...register('confirmPassword')}
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
