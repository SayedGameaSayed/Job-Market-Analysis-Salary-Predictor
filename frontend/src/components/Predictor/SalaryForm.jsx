import { useState, useEffect } from 'react';
import {
  Paper, Typography, TextField, MenuItem, Button, Grid, Alert, CircularProgress, Chip,
} from '@mui/material';
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
    ]).then(([jt, jc, el, cl]) => {
      setOptions({ job_title: jt, job_category: jc, experience_level: el, company_location: cl });
    });
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
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Predict Your Salary</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField select fullWidth label="Job Title" name="job_title" value={form.job_title} onChange={handleChange} required>
                  {options.job_title.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Job Category" name="job_category" value={form.job_category} onChange={handleChange} required>
                  {options.job_category.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Experience Level" name="experience_level" value={form.experience_level} onChange={handleChange} required>
                  {options.experience_level.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Company Location" name="company_location" value={form.company_location} onChange={handleChange} required>
                  {options.company_location.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Work Year" name="work_year" value={form.work_year} onChange={handleChange} inputProps={{ min: 2020, max: 2024 }} required />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Predict Salary'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {result && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="overline" color="text.secondary">Predicted Annual Salary</Typography>
            <Typography variant="h3" fontWeight={700} color="primary" sx={{ my: 2 }}>
              ${result.predicted_salary_usd?.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Model: {result.model_used}
            </Typography>
            {result.confidence_interval && (
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Chip label={`Lower: $${result.confidence_interval.lower?.toLocaleString()}`} variant="outlined" color="warning" />
                </Grid>
                <Grid item>
                  <Chip label={`Upper: $${result.confidence_interval.upper?.toLocaleString()}`} variant="outlined" color="success" />
                </Grid>
              </Grid>
            )}
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
