import { motion } from 'framer-motion';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const colors = ['#7b8cd1', '#8a9bd8', '#99aae0', '#a8b9e8', '#b7c8f0', '#00d4aa', '#f6a85b', '#c084fc', '#f472b6', '#60a5fa'];

export default function TopJobsChart({ data }) {
  const theme = useTheme();
  if (!data?.length) return null;
  const chartData = data.map(d => ({
    name: d.job_title?.length > 15 ? d.job_title?.slice(0, 15) + '…' : d.job_title,
    salary: Math.round(d.avg_salary),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <Paper sx={{ p: 2.5, height: '100%', border: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={700} mb={1.5} fontSize="0.95rem">
          Top Paying Data Roles
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ bottom: 50, left: 0, right: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={60} interval={0} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} width={40} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', backgroundColor: theme.palette.mode === 'dark' ? '#1a2040' : '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '0.8rem' }}
              formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']}
            />
            <Bar dataKey="salary" radius={[4, 4, 0, 0]} barSize={18}>
              {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </motion.div>
  );
}
