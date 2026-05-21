import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Stack, MenuItem, TextField, Paper, Typography, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { exportCsv, exportPdf } from '../../api/client';

export default function ExportPanel() {
  const [format, setFormat] = useState('csv');

  const handleExport = async () => {
    try {
      const blob = format === 'csv' ? await exportCsv() : await exportPdf();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `salary_report.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
      <Paper sx={{
        p: 2, mb: 3, border: 1, borderColor: 'divider',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {format === 'csv' ? <TableChartIcon color="primary" /> : <PictureAsPdfIcon color="error" />}
          <Typography variant="subtitle2">Export Report</Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <TextField select size="small" value={format} onChange={(e) => setFormat(e.target.value)} sx={{ minWidth: 120 }}>
            <MenuItem value="csv">📄 CSV</MenuItem>
            <MenuItem value="pdf">📑 PDF</MenuItem>
          </TextField>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport} sx={{ borderRadius: 10 }}>
            Download {format.toUpperCase()}
          </Button>
        </Stack>
      </Paper>
    </motion.div>
  );
}
