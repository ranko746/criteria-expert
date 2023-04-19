import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0079C1',
      light: '#6EB1D9',
      dark: '#3A4647',
    },
    secondary: {
      main: '#6B7374',
      light: '#B2B2B2',
    },
    tertiary: {
      yellow: '#F2B844',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        margin: '0.3125rem',
        borderRadius: 100,
      },
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
