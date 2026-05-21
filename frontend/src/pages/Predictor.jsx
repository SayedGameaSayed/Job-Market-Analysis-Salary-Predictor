import { Typography, Box, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import SalaryForm from '../components/Predictor/SalaryForm';

export default function Predictor() {
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
          <Chip label="ML-Powered" size="small" color="secondary" variant="outlined" sx={{ mb: 1.5 }} />
          <Typography variant="h4" gutterBottom>Salary Predictor</Typography>
          <Typography variant="body1" color="text.secondary">
            Predict your expected salary using a Random Forest model trained on {new Date().getFullYear() - 1} data science job listings. Enter your details below to get an instant estimate.
          </Typography>
        </Paper>
      </motion.div>
      <SalaryForm />
    </Box>
  );
}
