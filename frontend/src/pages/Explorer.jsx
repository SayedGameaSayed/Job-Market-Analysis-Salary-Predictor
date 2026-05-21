import { Typography } from '@mui/material';
import DataTable from '../components/Explorer/DataTable';

export default function Explorer() {
  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={3}>Data Explorer</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Browse, filter, and explore the global data science salary dataset.
      </Typography>
      <DataTable />
    </>
  );
}
