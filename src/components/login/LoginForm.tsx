import { Box, Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginFormProps {
  setMessage: (message: string | null) => void;
}

export default function LoginForm({ setMessage }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginUser: SubmitHandler<FormData> = async (FormData) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FormData),
      });
      const data = await response.json();      
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userId", data._id);
      setMessage(response.status === 200 ? `Successfully logged in!.` : `Wrong username or password!`);
    } catch (error) {
      console.error('Error logining user:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  return (
    <form onSubmit={handleSubmit(loginUser)}>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email is required',
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
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
    </form>
  );
}
