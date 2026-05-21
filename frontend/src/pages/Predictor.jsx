import { Typography } from '@mui/material';
import SalaryForm from '../components/Predictor/SalaryForm';

export default function Predictor() {
  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={3}>Salary Predictor</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Use our Random Forest model to predict your expected salary based on job role, experience, and location.
      </Typography>
      <SalaryForm />
    </>
  );
}
