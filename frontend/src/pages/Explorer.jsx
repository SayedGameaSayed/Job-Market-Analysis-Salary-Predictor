import { Typography, Box } from '@mui/material';
import DataTable from '../components/Explorer/DataTable';

export default function Explorer() {
  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h5" fontWeight={700}>Data Explorer</Typography>
        <Typography variant="body2" color="text.secondary">
          Browse and filter the global data science salary dataset.
        </Typography>
      </Box>
      <DataTable />
    </Box>
  );
}
