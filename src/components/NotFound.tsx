import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      p={3}
    >
      <Typography variant="h1" fontSize="4rem" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom mb={4}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/')}
        sx={{ borderRadius: 2 }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFound;