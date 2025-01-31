import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { Typography, Box } from '@mui/material';
import LoginForm from './LoginForm.tsx';
import Message from './LoginMessage.tsx';

export default function Login() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="gray.100"
    >
      <Card sx={{ width: 400, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Login
          </Typography>
          <Message message={message} />
          <LoginForm setMessage={setMessage} />
        </CardContent>
      </Card>
    </Box>
  );
}
