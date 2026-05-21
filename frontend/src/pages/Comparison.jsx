import { Typography, Box } from '@mui/material';
import ComparisonView from '../components/Comparison/ComparisonView';

export default function Comparison() {
  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h5" fontWeight={700}>Comparison</Typography>
        <Typography variant="body2" color="text.secondary">
          Compare average salaries across job titles, countries, and experience levels.
        </Typography>
      </Box>
      <ComparisonView />
    </Box>
  );
}
