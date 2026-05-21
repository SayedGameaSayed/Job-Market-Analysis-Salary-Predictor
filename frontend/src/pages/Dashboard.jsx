import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
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
    <>
      <Typography variant="h4" fontWeight={700} mb={3}>Dashboard</Typography>
      <StatsCards stats={stats} />
      <ExportPanel />
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <TopJobsChart data={topJobs} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExperienceChart data={experience} />
        </Grid>
        <Grid item xs={12}>
          <CountryChart data={countries} />
        </Grid>
      </Grid>
    </>
  );
}
