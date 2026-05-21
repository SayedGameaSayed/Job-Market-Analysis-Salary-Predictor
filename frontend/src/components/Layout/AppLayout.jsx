import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import CompareIcon from '@mui/icons-material/CompareArrows';
import { useTheme as useAppTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/predictor', label: 'Salary Predictor', icon: <BarChartIcon /> },
  { path: '/explorer', label: 'Data Explorer', icon: <TableChartIcon /> },
  { path: '/comparison', label: 'Comparison', icon: <CompareIcon /> },
];

const DRAWER_WIDTH = 220;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleTheme, mode } = useAppTheme();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>SalaryInsight</Typography>
      </Box>
      <List sx={{ px: 1, flex: 1 }}>
        {navItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              selected={selected}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: 2, mb: 0.3, py: 1.2, px: 1.5,
                '&.Mui-selected': {
                  bgcolor: mode === 'dark' ? 'rgba(129,140,248,0.12)' : 'rgba(99,102,241,0.08)',
                  '&:hover': { bgcolor: mode === 'dark' ? 'rgba(129,140,248,0.18)' : 'rgba(99,102,241,0.12)' },
                },
                '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: selected ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: selected ? 600 : 400, fontSize: '0.85rem' }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{
        bgcolor: mode === 'dark' ? 'rgba(15,17,23,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: 1, borderColor: 'divider',
      }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            SalaryInsight
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit" size="small">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH, boxSizing: 'border-box',
            borderRight: 1, borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1, p: { xs: 2, md: 3 }, mt: 8,
        maxWidth: '100%', overflow: 'auto',
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}
