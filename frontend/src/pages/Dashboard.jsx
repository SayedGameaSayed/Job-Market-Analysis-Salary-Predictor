import { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import StatsCards from '../components/Dashboard/StatsCards';
import TopJobsChart from '../components/Dashboard/TopJobsChart';
import ExperienceChart from '../components/Dashboard/ExperienceChart';
import CountryChart from '../components/Dashboard/CountryChart';
import ExportPanel from '../components/Export/ExportPanel';
import { getStats, getTopJobs, getSalaryByExperience, getTopCountries } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [topJobs, setTopJobs] = useState([]);
  const [experience, setExperience] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    Promise.all([getStats(), getTopJobs(10), getSalaryByExperience(), getTopCountries(10)])
      .then(([s, j, e, c]) => { setStats(s); setTopJobs(j); setExperience(e); setCountries(c); });
  }, []);

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper sx={{
          p: 4, mb: 4,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #13182b 0%, #1a2040 50%, #13182b 100%)'
            : 'linear-gradient(135deg, #f0f2ff 0%, #e8ecf8 50%, #f0f2ff 100%)',
          border: 1, borderColor: 'divider',
          position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,140,209,0.08) 0%, transparent 70%)' }} />
          <Box sx={{ position: 'absolute', bottom: -80, left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.05) 0%, transparent 70%)' }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Chip label="Live Dashboard" size="small" color="primary" variant="outlined" sx={{ mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              Global Data Science<br />Salary Insights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 1 }}>
              Comprehensive analysis of {stats?.total_records?.toLocaleString() || '…'} salary records across {stats?.unique_countries || '…'} countries, {stats?.unique_job_titles || '…'} job roles, and 4 experience levels.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Chip label={`📊 ${stats?.total_records?.toLocaleString() || '…'} records`} size="small" />
              <Chip label={`🌍 ${stats?.unique_countries || '…'} countries`} size="small" />
              <Chip label={`💼 ${stats?.unique_job_titles || '…'} roles`} size="small" />
              <Chip label={`💰 Avg $${stats?.avg_salary?.toLocaleString() || '…'}`} size="small" />
            </Box>
          </Box>
        </Paper>
      </motion.div>

      <StatsCards stats={stats} />
      <ExportPanel />

      <Grid container spacing={2.5} mt={1}>
        <Grid item xs={12} md={4}>
          <TopJobsChart data={topJobs} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ExperienceChart data={experience} />
        </Grid>
        <Grid item xs={12} md={4}>
          <CountryChart data={countries} />
        </Grid>
      </Grid>
    </Box>
  );
}
