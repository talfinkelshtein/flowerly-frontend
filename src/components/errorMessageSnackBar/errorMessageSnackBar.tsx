import { Alert, Snackbar } from '@mui/material';
import React from 'react';

interface errorMessageSnackBarProps {
  open: boolean;
  onClose: () => void;
  errorMessage?: unknown;
  defaultMessage?: string;
}

const ErrorMessageSnackBar: React.FC<errorMessageSnackBarProps> = ({
  open,
  onClose,
  errorMessage,
  defaultMessage = 'An unexpected error occurred.',
}) => {
  let message = defaultMessage;

  if (errorMessage) {
    const statusCode = (errorMessage as { response?: { status?: number } }).response?.status;
    switch (statusCode) {
      case 401:
        message = 'Unauthorized: You are not allowed to perform this action.';
        break;
      case 404:
        message = 'Not Found: The requested resource does not exist.';
        break;
      case 500:
        message = 'Server Error: Something went wrong on our end.';
        break;
      default:
        message = defaultMessage;
    }
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorMessageSnackBar;
