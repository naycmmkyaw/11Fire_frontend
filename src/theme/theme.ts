import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
 palette: {
   primary: {
     main: '#EB6464', // 11Fire primary red from design system
     dark: '#D54545',
     light: '#F9D4D4',
     contrastText: '#FFFFFF',
   },
   secondary: {
     main: '#FFFAF4',
     dark: '#FFF4E7',
     contrastText: '#000000',
   },
   background: {
     default: '#FFFFFF',
     paper: '#FAFAFA',
   },
   text: {
     primary: '#000000',
     secondary: '#3F3F3F',
   },
   grey: {
     100: '#F5F5F5',
     200: '#E0E0E0',
     300: '#CCCCCC',
     400: '#999999',
     500: '#666666',
     600: '#4D4D4D',
     700: '#333333',
     800: '#2C2C2C',
     900: '#1A1A1A',
   },
   success: {
     main: '#4CAF50',
   },
   warning: {
     main: '#FF9800',
   },
   error: {
     main: '#F44336',
   },
 },
 typography: {
   fontFamily: [
     'Inter',
     'sans-serif',
     '-apple-system',
     'BlinkMacSystemFont',
     '"Segoe UI"',
     'Roboto',
     '"Helvetica Neue"',
     'Arial',
   ].join(','),
   h1: {
     fontSize: '2rem',
     fontWeight: 700,
     letterSpacing: '-0.5px',
   },
   h2: {
     fontSize: '1.5rem',
     fontWeight: 600,
   },
   h3: {
     fontSize: '1.25rem',
     fontWeight: 600,
   },
   body1: {
     fontSize: '1rem',
     lineHeight: 1.5,
   },
   body2: {
     fontSize: '0.875rem',
     lineHeight: 1.5,
   },
   button: {
     fontSize: '0.875rem',
     fontWeight: 600,
     textTransform: 'none',
   },
 },
 shape: {
   borderRadius: 8,
 },
 components: {
   MuiButton: {
     styleOverrides: {
       root: {
         borderRadius: 8,
         padding: '12px 24px',
         fontSize: '0.875rem',
         fontWeight: 600,
         textTransform: 'none',
         boxShadow: 'none',
         '&:hover': {
           boxShadow: '0 4px 12px rgba(235, 100, 100, 0.3)',
         },
       },
       contained: {
         '&:hover': {
           boxShadow: '0 4px 12px rgba(235, 100, 100, 0.3)',
         },
       },
     },
   },
   MuiCard: {
     styleOverrides: {
       root: {
         borderRadius: 16,
         boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
       },
     },
   },
   MuiTextField: {
     styleOverrides: {
       root: {
         '& .MuiOutlinedInput-root': {
           borderRadius: 8,
         },
        },
      },
    },
  },
});