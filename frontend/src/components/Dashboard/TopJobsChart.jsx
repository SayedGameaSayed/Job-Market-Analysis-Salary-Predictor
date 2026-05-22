import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopJobsChart({ data }) {
  if (!data?.length) return null;
  const chartData = data.map(d => ({ name: d.job_title?.length > 25 ? d.job_title?.slice(0, 25) + '...' : d.job_title, salary: d.avg_salary }));
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>Top Paying Roles</Typography>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
          <Bar dataKey="salary" fill="#7b8cd1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
