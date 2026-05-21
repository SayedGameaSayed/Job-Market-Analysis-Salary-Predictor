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
                primary: { main: '#7b8cd1', light: '#a8b5e0', dark: '#5a6db8' },
                secondary: { main: '#00d4aa', light: '#33dbbd', dark: '#00a888' },
                background: { default: '#0b0f1c', paper: '#13182b' },
                text: { primary: '#e8eaf0', secondary: '#9ca3b8' },
                divider: 'rgba(255,255,255,0.06)',
              }
            : {
                primary: { main: '#5c6bc0', light: '#7986cb', dark: '#3949ab' },
                secondary: { main: '#00bfa5', light: '#33ccb8', dark: '#009688' },
                background: { default: '#f0f2f5', paper: '#ffffff' },
                text: { primary: '#1a1a2e', secondary: '#555770' },
                divider: 'rgba(0,0,0,0.08)',
              }),
        },
        typography: {
          fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
          h3: { fontWeight: 800, letterSpacing: '-0.5px' },
          h4: { fontWeight: 700, letterSpacing: '-0.3px' },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 16 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backdropFilter: mode === 'dark' ? 'blur(20px)' : 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 12,
                padding: '10px 24px',
              },
            },
          },
        },
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
