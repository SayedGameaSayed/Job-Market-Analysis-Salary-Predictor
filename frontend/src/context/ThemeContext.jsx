import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext({ toggleTheme: () => {}, mode: 'dark' });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  const toggleTheme = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: { main: '#7b8cd1' },
                secondary: { main: '#90caf9' },
                background: { default: '#0a0e1a', paper: '#13182b' },
              }
            : {
                primary: { main: '#5c6bc0' },
                secondary: { main: '#1976d2' },
                background: { default: '#f5f5f5', paper: '#ffffff' },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
