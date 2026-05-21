import { motion } from 'framer-motion';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const colors = ['#7b8cd1', '#8a9bd8', '#99aae0', '#a8b9e8', '#b7c8f0', '#00d4aa', '#f6a85b', '#c084fc', '#f472b6', '#60a5fa'];

export default function TopJobsChart({ data }) {
  const theme = useTheme();
  if (!data?.length) return null;
  const chartData = data.map(d => ({
    name: d.job_title?.length > 22 ? d.job_title?.slice(0, 22) + '…' : d.job_title,
    salary: Math.round(d.avg_salary),
    count: d.count,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <Paper sx={{ p: 3, height: '100%', border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 4, height: 20, bgcolor: 'primary.main', borderRadius: 2, display: 'inline-block' }} />
          Top Paying Data Roles
        </Typography>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', backgroundColor: theme.palette.mode === 'dark' ? '#1a2040' : '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
              formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']}
              labelFormatter={(l) => chartData.find(d => d.name === l)?.count ? `${l} (${chartData.find(d => d.name === l).count} records)` : l}
            />
            <Bar dataKey="salary" radius={[0, 6, 6, 0]} barSize={20}>
              {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </motion.div>
  );
}
