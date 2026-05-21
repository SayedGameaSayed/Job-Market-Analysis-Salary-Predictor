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

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleTheme, mode } = useAppTheme();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <List sx={{ mt: 8 }}>
      {navItems.map((item) => (
        <ListItemButton
          key={item.path}
          component={NavLink}
          to={item.path}
          selected={location.pathname === item.path}
          onClick={() => isMobile && setMobileOpen(false)}
          sx={{
            mx: 1, borderRadius: 2, mb: 0.5,
            '&.Mui-selected': { bgcolor: 'primary.dark', color: 'white' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            📊 SalaryInsight
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: 240,
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', bgcolor: 'background.paper' },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: isMobile ? 0 : 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
