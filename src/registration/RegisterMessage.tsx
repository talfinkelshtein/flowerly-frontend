import { Typography } from '@mui/material';

interface MessageProps {
  message: string | null;
}

export default function Message({ message }: MessageProps) {
  return message ? (
    <Typography color="success.main" textAlign="center" marginBottom={2}>
      {message}
    </Typography>
  ) : null;
}
