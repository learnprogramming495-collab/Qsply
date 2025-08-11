import { createTheme } from '@mui/material/styles';

// A professional theme for the AgriTech Platform
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // A deep, trustworthy green
      light: '#5a9c5f',
      dark: '#005005',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFA000', // A vibrant orange for calls to action
      light: '#ffd149',
      dark: '#c67100',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5', // A light grey background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      marginBottom: '0.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            }
        }
    }
  },
});

export default theme;
