import { useState } from 'react';
import {
  Paper, Typography, TextField, MenuItem, Button, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Alert,
} from '@mui/material';
import { compareData, getUniqueValues } from '../../api/client';

export default function ComparisonView() {
  const [jobTitles, setJobTitles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!jobTitles.length && !countries.length && !experienceLevels.length) {
      setError('Select at least one dimension');
      return;
    }
    setError('');
    try {
      const res = await compareData({ job_titles: jobTitles, countries: countries, experience_levels: experienceLevels });
      setResult(res);
    } catch (err) {
      setError('Comparison failed - no matching data');
    }
  };

  const renderTable = (label, data) => {
    if (!data) return null;
    const rows = Object.entries(data).map(([key, val]) => ({ key, ...val }));
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" mb={1}>{label}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Count</TableCell>
                <TableCell align="right">Mean</TableCell>
                <TableCell align="right">Min</TableCell>
                <TableCell align="right">Max</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.key}>
                  <TableCell><Chip label={r.key} size="small" /></TableCell>
                  <TableCell align="right">{r.count}</TableCell>
                  <TableCell align="right">${r.mean?.toLocaleString()}</TableCell>
                  <TableCell align="right">${r.min?.toLocaleString()}</TableCell>
                  <TableCell align="right">${r.max?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>Compare Salaries</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField select fullWidth size="small" label="Job Titles" SelectProps={{ multiple: true }}
                value={jobTitles} onChange={(e) => setJobTitles(e.target.value)}>
                <MenuItem value="Data Scientist">Data Scientist</MenuItem>
                <MenuItem value="Data Engineer">Data Engineer</MenuItem>
                <MenuItem value="Data Analyst">Data Analyst</MenuItem>
                <MenuItem value="Machine Learning Engineer">ML Engineer</MenuItem>
                <MenuItem value="Analytics Engineer">Analytics Engineer</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth size="small" label="Countries" SelectProps={{ multiple: true }}
                value={countries} onChange={(e) => setCountries(e.target.value)}>
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                <MenuItem value="Germany">Germany</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="India">India</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth size="small" label="Experience" SelectProps={{ multiple: true }}
                value={experienceLevels} onChange={(e) => setExperienceLevels(e.target.value)}>
                <MenuItem value="Entry-level">Entry-level</MenuItem>
                <MenuItem value="Mid-level">Mid-level</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
                <MenuItem value="Executive">Executive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleCompare}>Compare</Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        {error && <Alert severity="warning">{error}</Alert>}
        {result && (
          <>
            {renderTable('By Job Title', result.by_job)}
            {renderTable('By Country', result.by_country)}
            {renderTable('By Experience Level', result.by_experience)}
          </>
        )}
      </Grid>
    </Grid>
  );
}
