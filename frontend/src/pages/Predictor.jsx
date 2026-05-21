import { Typography, Box, Paper } from '@mui/material';
import SalaryForm from '../components/Predictor/SalaryForm';

export default function Predictor() {
  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h5" fontWeight={700}>Salary Predictor</Typography>
        <Typography variant="body2" color="text.secondary">
          Predict expected salary using a Random Forest model trained on data science job listings.
        </Typography>
      </Box>
      <SalaryForm />
    </Box>
  );
}
