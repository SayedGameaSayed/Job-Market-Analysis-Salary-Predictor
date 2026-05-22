import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CountryChart({ data }) {
  if (!data?.length) return null;
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>Top Countries by Salary</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="country" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']} />
          <Bar dataKey="avg_salary" fill="#7b8cd1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
