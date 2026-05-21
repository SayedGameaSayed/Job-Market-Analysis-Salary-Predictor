import { Typography, Box, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import DataTable from '../components/Explorer/DataTable';

export default function Explorer() {
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
          <Chip label="Interactive" size="small" color="primary" variant="outlined" sx={{ mb: 1.5 }} />
          <Typography variant="h4" gutterBottom>Data Explorer</Typography>
          <Typography variant="body1" color="text.secondary">
            Browse, filter, and explore the global data science salary dataset. Use the filters to narrow down by category, experience level, country, or year.
          </Typography>
        </Paper>
      </motion.div>
      <DataTable />
    </Box>
  );
}
