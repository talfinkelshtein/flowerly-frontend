import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { Typography, Box } from '@mui/material';
import RegisterForm from './RegisterForm.tsx';
import Message from './Message.tsx';

export default function Register() {
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
            Register
          </Typography>
          <Message message={message} />
          <RegisterForm setMessage={setMessage} />
        </CardContent>
      </Card>
    </Box>
  );
}
