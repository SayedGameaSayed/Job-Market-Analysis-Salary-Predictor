import { Typography } from '@mui/material';
import ComparisonView from '../components/Comparison/ComparisonView';

export default function Comparison() {
  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={3}>Comparison</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Compare salaries across job titles, countries, and experience levels side by side.
      </Typography>
      <ComparisonView />
    </>
  );
}
