import { useState } from 'react';
import { Button, Stack, MenuItem, TextField, Paper, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
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
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="subtitle1">Export Data</Typography>
      <TextField select size="small" value={format} onChange={(e) => setFormat(e.target.value)} sx={{ minWidth: 120 }}>
        <MenuItem value="csv">CSV</MenuItem>
        <MenuItem value="pdf">PDF</MenuItem>
      </TextField>
      <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport}>
        Download
      </Button>
    </Paper>
  );
}
