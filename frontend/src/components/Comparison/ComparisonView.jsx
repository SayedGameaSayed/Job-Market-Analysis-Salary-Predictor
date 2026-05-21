import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Paper, Typography, TextField, MenuItem, Button, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Alert, Box,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { compareData } from '../../api/client';

const JOB_OPTIONS = ['Data Scientist', 'Data Engineer', 'Data Analyst', 'Machine Learning Engineer', 'Analytics Engineer', 'Data Architect', 'Data DevOps Engineer', 'Research Scientist', 'BI Analyst'];
const COUNTRY_OPTIONS = ['United States', 'United Kingdom', 'Germany', 'Canada', 'India', 'France', 'Spain', 'Australia', 'Netherlands', 'Brazil'];
const EXP_OPTIONS = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];

export default function ComparisonView() {
  const [jobTitles, setJobTitles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!jobTitles.length && !countries.length && !experienceLevels.length) {
      setError('Select at least one dimension to compare');
      return;
    }
    setError('');
    try {
      const res = await compareData({ job_titles: jobTitles, countries: countries, experience_levels: experienceLevels });
      setResult(res);
    } catch {
      setError('No matching data found for the selected options.');
    }
  };

  const renderTable = (label, data, icon) => {
    if (!data) return null;
    const rows = Object.entries(data).map(([key, val]) => ({ key, ...val }));

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Paper sx={{ p: 2.5, mt: 2.5, border: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5} display="flex" alignItems="center" gap={1}>
            {icon} {label}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Count</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Mean</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Min</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Max</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Std Dev</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.key} hover>
                    <TableCell><Chip label={r.key} size="small" variant="outlined" /></TableCell>
                    <TableCell align="right">{r.count}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>${r.mean?.toLocaleString()}</TableCell>
                    <TableCell align="right">${r.min?.toLocaleString()}</TableCell>
                    <TableCell align="right">${r.max?.toLocaleString()}</TableCell>
                    <TableCell align="right">${Math.round(r.std)?.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
              <CompareArrowsIcon color="warning" /> Select Categories
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField select fullWidth size="small" label="Job Titles" SelectProps={{ multiple: true, renderValue: (selected) => selected.join(', ') }}
                  value={jobTitles} onChange={(e) => setJobTitles(e.target.value)}>
                  {JOB_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth size="small" label="Countries" SelectProps={{ multiple: true, renderValue: (selected) => selected.join(', ') }}
                  value={countries} onChange={(e) => setCountries(e.target.value)}>
                  {COUNTRY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth size="small" label="Experience Level" SelectProps={{ multiple: true, renderValue: (selected) => selected.join(', ') }}
                  value={experienceLevels} onChange={(e) => setExperienceLevels(e.target.value)}>
                  {EXP_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth size="large" onClick={handleCompare}
                  sx={{ background: 'linear-gradient(135deg, #f6a85b 0%, #e8913a 100%)' }}>
                  Compare Salaries
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Grid>

      <Grid item xs={12} md={8}>
        {error && <Alert severity="warning" sx={{ borderRadius: 3 }}>{error}</Alert>}
        {result && (
          <>
            {renderTable('By Job Title', result.by_job, '💼')}
            {renderTable('By Country', result.by_country, '🌍')}
            {renderTable('By Experience Level', result.by_experience, '📈')}
          </>
        )}
        {!result && !error && (
          <Paper sx={{ p: 6, textAlign: 'center', border: 1, borderColor: 'divider', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <CompareArrowsIcon sx={{ fontSize: 80, opacity: 0.2, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Select options to compare</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 350, mt: 1 }}>
              Choose job titles, countries, or experience levels and click "Compare Salaries" to see side-by-side statistics.
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
