import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getStats, getTopJobs, getSalaryByExperience, getTopCountries } from '../api/client';

const COLORS = ['#818cf8', '#34d399', '#f59e0b', '#c084fc', '#f472b6', '#60a5fa', '#22d3ee', '#fb923c', '#a78bfa', '#14b8a6'];

function ChartCard({ title, height = 300, children }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [topJobs, setTopJobs] = useState([]);
  const [experience, setExperience] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    Promise.all([getStats(), getTopJobs(8), getSalaryByExperience(), getTopCountries(10)])
      .then(([s, j, e, c]) => { setStats(s); setTopJobs(j); setExperience(e); setCountries(c); });
  }, []);

  const statCards = [
    { label: 'Total Records', value: stats?.total_records?.toLocaleString() },
    { label: 'Average Salary', value: stats?.avg_salary ? `$${stats.avg_salary.toLocaleString()}` : null },
    { label: 'Job Titles', value: stats?.unique_job_titles },
    { label: 'Countries', value: stats?.unique_countries },
  ];

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Data Science Salary Overview</Typography>
      </Box>

      <Grid container spacing={2} mb={3}>
        {statCards.map((c) => (
          <Grid item xs={6} md={3} key={c.label}>
            <Card variant="outlined">
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>{c.label}</Typography>
                {c.value ? (
                  <Typography variant="h5" fontWeight={700}>{c.value}</Typography>
                ) : (
                  <Skeleton width="60%" />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard title="Top Paying Data Roles">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topJobs} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="job_title" width={170} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
                <Bar dataKey="avg_salary" radius={[0, 4, 4, 0]} barSize={14}>
                  {topJobs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Salary by Experience Level">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={experience}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={50} />
                <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
                <Bar dataKey="avg_salary" radius={[4, 4, 0, 0]} barSize={40}>
                  {experience.map((d) => {
                    const colors = { 'Entry-level': '#60a5fa', 'Mid-level': '#818cf8', 'Senior': '#f59e0b', 'Executive': '#c084fc' };
                    return <Cell key={d.level} fill={colors[d.level] || '#818cf8'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12}>
          <ChartCard title="Top 10 Countries by Average Salary" height={320}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={countries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={50} />
                <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
                <Bar dataKey="avg_salary" radius={[4, 4, 0, 0]} barSize={30}>
                  {countries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
