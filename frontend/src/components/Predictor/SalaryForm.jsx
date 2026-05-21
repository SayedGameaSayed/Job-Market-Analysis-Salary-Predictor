import { useState, useEffect } from 'react';
import {
  Paper, Typography, TextField, MenuItem, Button, Grid, Alert, CircularProgress,
  Chip, Box, Divider,
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { getUniqueValues, predictSalary } from '../../api/client';

export default function SalaryForm() {
  const [form, setForm] = useState({ work_year: 2023, job_title: '', job_category: '', experience_level: '', company_location: '' });
  const [options, setOptions] = useState({ job_title: [], job_category: [], experience_level: [], company_location: [] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getUniqueValues('job_title'),
      getUniqueValues('job_category'),
      getUniqueValues('experience_level'),
      getUniqueValues('company_location'),
    ]).then(([jt, jc, el, cl]) => setOptions({ job_title: jt, job_category: jc, experience_level: el, company_location: cl }));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await predictSalary(form);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
            <AutoGraphIcon color="primary" /> Enter Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField select fullWidth label="Job Title" name="job_title" value={form.job_title} onChange={handleChange} required
                  MenuProps={{ PaperProps: { style: { minWidth: 300 } } }}>
                  <MenuItem value="" disabled>Select a job title</MenuItem>
                  {options.job_title.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Category" name="job_category" value={form.job_category} onChange={handleChange} required
                  MenuProps={{ PaperProps: { style: { minWidth: 300 } } }}>
                  <MenuItem value="" disabled>Select category</MenuItem>
                  {options.job_category.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Experience" name="experience_level" value={form.experience_level} onChange={handleChange} required
                  MenuProps={{ PaperProps: { style: { minWidth: 300 } } }}>
                  <MenuItem value="" disabled>Select level</MenuItem>
                  {options.experience_level.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Location" name="company_location" value={form.company_location} onChange={handleChange} required
                  MenuProps={{ PaperProps: { style: { minWidth: 300 } } }}>
                  <MenuItem value="" disabled>Select country</MenuItem>
                  {options.company_location.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Year" name="work_year" value={form.work_year} onChange={handleChange} inputProps={{ min: 2020, max: 2024 }} required />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.3 }}>
                  {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Predict Salary'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {result ? (
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
              PREDICTED ANNUAL SALARY
            </Typography>
            <Divider sx={{ my: 2, opacity: 0.3 }} />
            <Typography variant="h3" fontWeight={700} color="primary" sx={{ my: 1, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '3rem' } }}>
              ${result.predicted_salary_usd?.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Model: {result.model_used}
            </Typography>
            {result.confidence_interval && (
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Paper variant="outlined" sx={{ p: 1.5, px: 2.5 }}>
                    <Typography variant="caption" color="text.secondary">Lower</Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ${result.confidence_interval.lower?.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper variant="outlined" sx={{ p: 1.5, px: 2.5 }}>
                    <Typography variant="caption" color="text.secondary">Upper</Typography>
                    <Typography variant="h6" fontWeight={600}>
                      ${result.confidence_interval.upper?.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
            <Box mt={2}>
              <Chip label={`${form.job_title} · ${form.experience_level} · ${form.company_location}`} size="small" variant="outlined" />
            </Box>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{
            p: 6, textAlign: 'center', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', minHeight: 300,
          }}>
            <AutoGraphIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No prediction yet</Typography>
            <Typography variant="body2" color="text.secondary">Fill in the form and click Predict Salary.</Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
