import { motion } from 'framer-motion';
import { Box, Paper, Grid, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTheme } from '../../context/ThemeContext';

const cards = [
  { label: 'Total Records', icon: <PeopleAltIcon />, value: null, key: 'total_records', color: '#7b8cd1', fmt: (v) => v?.toLocaleString() },
  { label: 'Avg Salary', icon: <AttachMoneyIcon />, value: null, key: 'avg_salary', color: '#00d4aa', fmt: (v) => `$${v?.toLocaleString()}` },
  { label: 'Job Titles', icon: <WorkIcon />, value: null, key: 'unique_job_titles', color: '#f6a85b', fmt: (v) => v },
  { label: 'Countries', icon: <PublicIcon />, value: null, key: 'unique_countries', color: '#c084fc', fmt: (v) => v },
];

function StatCard({ icon, label, value, color, fmt, index }) {
  const { mode } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Paper sx={{
        p: 3, position: 'relative', overflow: 'hidden',
        border: 1, borderColor: 'divider',
        '&::before': {
          content: '""', position: 'absolute', top: 0, left: 0,
          width: '100%', height: '3px',
          background: `linear-gradient(90deg, ${color}, ${color}44)`,
        },
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>{label}</Typography>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              {fmt(value) ?? '—'}
            </Typography>
          </Box>
          <Box sx={{
            p: 1.5, borderRadius: 3,
            bgcolor: mode === 'dark' ? `${color}15` : `${color}10`,
            color: color,
            display: 'flex',
          }}>
            {icon}
          </Box>
        </Box>
        <TrendingUpIcon sx={{ position: 'absolute', bottom: 12, right: 16, fontSize: 48, opacity: 0.06 }} />
      </Paper>
    </motion.div>
  );
}

export default function StatsCards({ stats }) {
  return (
    <Grid container spacing={2.5} mb={4}>
      {cards.map((c, i) => (
        <Grid item xs={12} sm={6} md={3} key={c.key}>
          <StatCard {...c} value={stats?.[c.key]} index={i} />
        </Grid>
      ))}
    </Grid>
  );
}
