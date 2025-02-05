import { Box, Button, TextField } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { SubmitHandler, useForm } from 'react-hook-form';
import { registerUser } from '../../services/UserService';
import './RegisterForm.css';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  setMessage: (message: string | null) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

export default function RegisterForm({ setMessage }: RegisterFormProps) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onFormSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const res = await registerUser(formData.email, formData.password);
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
