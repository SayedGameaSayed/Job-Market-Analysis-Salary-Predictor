import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext({ toggleTheme: () => {}, mode: 'dark' });

export const useTheme = () => useContext(ThemeContext);

const darkPalette = {
  primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1' },
  secondary: { main: '#34d399', light: '#6ee7b7', dark: '#10b981' },
  background: { default: '#0f1117', paper: '#1a1b23' },
  text: { primary: '#e2e8f0', secondary: '#94a3b8' },
  divider: 'rgba(255,255,255,0.06)',
};

const lightPalette = {
  primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
  secondary: { main: '#10b981', light: '#34d399', dark: '#059669' },
  background: { default: '#f1f5f9', paper: '#ffffff' },
  text: { primary: '#0f172a', secondary: '#64748b' },
  divider: 'rgba(0,0,0,0.08)',
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');
  const toggleTheme = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode, ...(mode === 'dark' ? darkPalette : lightPalette) },
        typography: {
          fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
          h4: { fontWeight: 700, letterSpacing: '-0.3px' },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
          MuiButton: {
            styleOverrides: {
              root: { textTransform: 'none', fontWeight: 600, borderRadius: 10, padding: '8px 20px' },
            },
          },
          MuiCard: {
            styleOverrides: { root: { backgroundImage: 'none' } },
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
