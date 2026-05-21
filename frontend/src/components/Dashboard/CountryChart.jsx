import { motion } from 'framer-motion';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const colors = ['#00d4aa', '#7b8cd1', '#f6a85b', '#c084fc', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fb923c', '#22d3ee'];

export default function CountryChart({ data }) {
  const theme = useTheme();
  if (!data?.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
      <Paper sx={{ p: 2.5, height: '100%', border: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={700} mb={1.5} fontSize="0.95rem">
          Top Countries by Salary
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ bottom: 50, left: 0, right: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis dataKey="country" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={60} interval={0} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} width={40} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', backgroundColor: theme.palette.mode === 'dark' ? '#1a2040' : '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '0.8rem' }}
              formatter={(v) => [`$${v?.toLocaleString()}`, 'Avg Salary']}
              labelFormatter={(l) => {
                const d = data.find(x => x.country === l);
                return d ? `${l} — ${d.count?.toLocaleString()} records` : l;
              }}
            />
            <Bar dataKey="avg_salary" radius={[4, 4, 0, 0]} barSize={18}>
              {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </motion.div>
  );
}
