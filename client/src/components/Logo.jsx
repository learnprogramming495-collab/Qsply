import React from 'react';
import { Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const Logo = () => {
  return (
    <Typography
      variant="h6"
      component={RouterLink}
      to="/"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        color: 'inherit',
        textDecoration: 'none',
        fontWeight: 700,
        letterSpacing: '.5px'
      }}
    >
      <AgricultureIcon sx={{ mr: 1 }} />
      AgriTech
    </Typography>
  );
};

export default Logo;
