import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, useMediaQuery, useTheme, Avatar, Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import CompareIcon from '@mui/icons-material/CompareArrows';
import ImageIcon from '@mui/icons-material/Image';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useTheme as useAppTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon />, desc: 'Key metrics & charts' },
  { path: '/predictor', label: 'Salary Predictor', icon: <BarChartIcon />, desc: 'AI-powered estimation' },
  { path: '/explorer', label: 'Data Explorer', icon: <TableChartIcon />, desc: 'Browse & filter records' },
  { path: '/comparison', label: 'Comparison', icon: <CompareIcon />, desc: 'Side-by-side analysis' },
  { path: '/image-to-markdown', label: 'Image → Markdown', icon: <ImageIcon />, desc: 'OCR dashboard to markdown' },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleTheme, mode } = useAppTheme();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <AnalyticsIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>SalaryInsight</Typography>
          <Typography variant="caption" color="text.secondary">Data Science Analytics</Typography>
        </Box>
      </Box>
      <List sx={{ flex: 1, px: 1 }}>
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
                borderRadius: 3, mb: 0.5, py: 1.5, px: 2,
                flexDirection: 'column', alignItems: 'flex-start',
                '&.Mui-selected': {
                  bgcolor: mode === 'dark' ? 'rgba(123,140,209,0.15)' : 'rgba(92,107,192,0.1)',
                  '&:hover': { bgcolor: mode === 'dark' ? 'rgba(123,140,209,0.2)' : 'rgba(92,107,192,0.15)' },
                },
                '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                <ListItemIcon sx={{ minWidth: 32, color: selected ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: selected ? 700 : 500, fontSize: '0.9rem' }}
                />
                {selected && <Box sx={{ width: 4, height: 24, bgcolor: 'primary.main', borderRadius: 2 }} />}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 6.5, mt: -0.3 }}>
                {item.desc}
              </Typography>
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Chip label="v1.0.0" size="small" variant="outlined" sx={{ width: '100%' }} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={0} sx={{
        bgcolor: mode === 'dark' ? 'rgba(11,15,28,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: 1, borderColor: 'divider',
      }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1.5, display: { xs: 'none', sm: 'flex' } }}>
            <AnalyticsIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, letterSpacing: '-0.3px' }}>
            SalaryInsight
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit" sx={{ bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: 260,
          '& .MuiDrawer-paper': {
            width: 260, boxSizing: 'border-box',
            bgcolor: mode === 'dark' ? 'rgba(19,24,43,0.95)' : 'rgba(255,255,255,0.95)',
            borderRight: 1, borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1, p: { xs: 2, md: 4 }, mt: 8,
        ml: isMobile ? 0 : 0,
        maxWidth: '100%',
        overflow: 'auto',
      }}>
        <Box className="fade-in" key={location.pathname}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
