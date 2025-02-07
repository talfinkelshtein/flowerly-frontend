import { Box, Button, TextField } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginForm.css';

interface FormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  setMessage: (message: string | null) => void;
}

export default function LoginForm({ setMessage }: LoginFormProps) {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onFormSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await login(formData);

      if (response.status === 200) {
        setMessage('Successfully logged in!');
        navigate('/');
      } else {
        setMessage('Wrong username or password!');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      setMessage('Login failed');
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
    setMessage('Login via Google failed');
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="login-form">
      <Box mb={2}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register('email', { required: 'Email is required' })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Box>

      <Box mb={2}>
        <TextField
          label="Password"
          type="password"
          fullWidth
          {...register('password', { required: 'Password is required' })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </Box>

      <Button type="submit" variant="contained" color="primary">
        Login
      </Button>

      <div className="google-login-container">
        <GoogleLogin onSuccess={onGoogleSuccess} onError={googleErrorMessage} />
      </div>
    </form>
  );
}
