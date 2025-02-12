import { Box, Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import RegisterForm from './RegisterForm.tsx';
import Message from './RegisterMessage.tsx';

export default function Register() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="gray.100" mt={2}>
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
