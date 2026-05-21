import { motion } from 'framer-motion';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const levelColors = { 'Entry-level': '#60a5fa', 'Mid-level': '#7b8cd1', 'Senior': '#f6a85b', 'Executive': '#c084fc' };

export default function ExperienceChart({ data }) {
  const theme = useTheme();
  if (!data?.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Paper sx={{ p: 3, height: '100%', border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 4, height: 20, bgcolor: '#00d4aa', borderRadius: 2, display: 'inline-block' }} />
          Salary by Experience Level
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="level" tick={{ fontSize: 13 }} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', backgroundColor: theme.palette.mode === 'dark' ? '#1a2040' : '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
              formatter={(v, n) => n === 'avg_salary' ? [`$${v?.toLocaleString()}`, 'Avg Salary'] : [v, 'Count']}
            />
            <Bar dataKey="avg_salary" radius={[6, 6, 0, 0]} barSize={50}>
              {data.map((d, i) => <Cell key={i} fill={levelColors[d.level] || '#7b8cd1'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </motion.div>
  );
}
