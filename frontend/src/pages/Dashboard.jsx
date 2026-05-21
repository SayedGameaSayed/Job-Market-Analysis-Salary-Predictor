import { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Skeleton, Chip,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { getStats, getTopJobs, getSalaryByExperience, getTopCountries } from '../api/client';

const COLORS = ['#7b8cd1', '#00d4aa', '#f6a85b', '#c084fc', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fb923c', '#22d3ee'];

function ChartCard({ title, height = 320, children }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>{title}</Typography>
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
    { label: 'Total Records', value: stats?.total_records?.toLocaleString(), color: '#7b8cd1' },
    { label: 'Avg Salary', value: `$${stats?.avg_salary?.toLocaleString()}`, color: '#00d4aa' },
    { label: 'Job Titles', value: stats?.unique_job_titles, color: '#f6a85b' },
    { label: 'Countries', value: stats?.unique_countries, color: '#c084fc' },
  ];

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={800}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Global Data Science Salary Overview</Typography>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={2} mb={3}>
        {statCards.map((c, i) => (
          <Grid item xs={6} md={3} key={c.label}>
            <Card variant="outlined" sx={{ borderTop: 3, borderTopColor: c.color }}>
              <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>{c.label}</Typography>
                {c.value ? (
                  <Typography variant="h5" fontWeight={800}>{c.value}</Typography>
                ) : (
                  <Skeleton width="60%" />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Top Jobs */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Top Paying Data Roles">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topJobs} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="job_title" width={170} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
                <Bar dataKey="avg_salary" radius={[0, 4, 4, 0]} barSize={16}>
                  {topJobs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Experience */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Salary by Experience Level">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={experience}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={50} />
                <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
                <Bar dataKey="avg_salary" radius={[4, 4, 0, 0]} barSize={60}>
                  {experience.map((d) => {
                    const colors = { 'Entry-level': '#60a5fa', 'Mid-level': '#7b8cd1', 'Senior': '#f6a85b', 'Executive': '#c084fc' };
                    return <Cell key={d.level} fill={colors[d.level] || '#7b8cd1'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Countries */}
        <Grid item xs={12}>
          <ChartCard title="Top 10 Countries by Average Salary" height={360}>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={countries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={50} />
                <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
                <Bar dataKey="avg_salary" radius={[4, 4, 0, 0]} barSize={40}>
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
