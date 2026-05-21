import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExperienceChart({ data }) {
  if (!data?.length) return null;
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>Salary by Experience Level</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="level" />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
          <Bar dataKey="avg_salary" fill="#5c6bc0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
