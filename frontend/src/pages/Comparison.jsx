import { Typography, Box, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ComparisonView from '../components/Comparison/ComparisonView';

export default function Comparison() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper sx={{
          p: 3, mb: 4,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #13182b 0%, #1a2040 50%, #13182b 100%)'
            : 'linear-gradient(135deg, #f0f2ff 0%, #e8ecf8 50%, #f0f2ff 100%)',
          border: 1, borderColor: 'divider',
        }}>
          <Chip label="Side-by-Side" size="small" color="warning" variant="outlined" sx={{ mb: 1.5 }} />
          <Typography variant="h4" gutterBottom>Comparison</Typography>
          <Typography variant="body1" color="text.secondary">
            Compare average salaries across different job titles, countries, and experience levels simultaneously. Select multiple options in each category.
          </Typography>
        </Paper>
      </motion.div>
      <ComparisonView />
    </Box>
  );
}
