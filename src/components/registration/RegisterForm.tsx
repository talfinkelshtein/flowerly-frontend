import { Box, Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const registerUser: SubmitHandler<FormData> = async (FormData) => {
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FormData),
      });
      setMessage(response.status === 200 ? `Your account has been created.` : `Account already exists!`);
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  return (
    <form onSubmit={handleSubmit(registerUser)}>
      <Box mb={2}>
        <TextField
          fullWidth
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
          fullWidth
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
          fullWidth
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
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register
      </Button>
    </form>
  );
}
