import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Paper, Typography, TextField, MenuItem, Button, Grid, Alert, CircularProgress,
  Chip, Box, Divider,
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { getUniqueValues, predictSalary } from '../../api/client';
import { useTheme } from '../../context/ThemeContext';

export default function SalaryForm() {
  const [form, setForm] = useState({ work_year: 2023, job_title: '', job_category: '', experience_level: '', company_location: '' });
  const [options, setOptions] = useState({ job_title: [], job_category: [], experience_level: [], company_location: [] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { mode } = useTheme();

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
      setError(err.response?.data?.detail || 'Prediction failed. Try different values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Paper sx={{ p: 3.5, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" mb={0.5} display="flex" alignItems="center" gap={1}>
              <AutoGraphIcon color="primary" /> Enter Your Details
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Fill in the fields below to get a salary estimate based on market data.
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField select fullWidth label="Job Title" name="job_title" value={form.job_title} onChange={handleChange} required SelectProps={{ displayEmpty: true }}>
                    <MenuItem value="" disabled>Select a job title</MenuItem>
                    {options.job_title.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select fullWidth label="Job Category" name="job_category" value={form.job_category} onChange={handleChange} required>
                    <MenuItem value="" disabled>Select category</MenuItem>
                    {options.job_category.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select fullWidth label="Experience Level" name="experience_level" value={form.experience_level} onChange={handleChange} required>
                    <MenuItem value="" disabled>Select level</MenuItem>
                    {options.experience_level.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select fullWidth label="Company Location" name="company_location" value={form.company_location} onChange={handleChange} required>
                    <MenuItem value="" disabled>Select country</MenuItem>
                    {options.company_location.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="number" label="Work Year" name="work_year" value={form.work_year} onChange={handleChange} inputProps={{ min: 2020, max: 2024 }} required />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                    sx={{ py: 1.5, fontSize: '1rem', background: 'linear-gradient(135deg, #7b8cd1 0%, #5a6db8 100%)' }}>
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '🎯 Predict My Salary'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Grid>

      <Grid item xs={12} md={6}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}
          {result ? (
            <Paper sx={{
              p: 4, textAlign: 'center', border: 1, borderColor: 'divider',
              background: mode === 'dark'
                ? 'linear-gradient(180deg, rgba(0,212,170,0.05) 0%, transparent 50%)'
                : 'linear-gradient(180deg, rgba(0,191,165,0.05) 0%, transparent 50%)',
            }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                PREDICTED ANNUAL SALARY
              </Typography>
              <Divider sx={{ my: 2, opacity: 0.3 }} />
              <Typography variant="h2" fontWeight={800} color="primary" sx={{ my: 1, letterSpacing: '-1px', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                ${result.predicted_salary_usd?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Model: {result.model_used} · Confidence ±15%
              </Typography>
              {result.confidence_interval && (
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Paper variant="outlined" sx={{ p: 1.5, px: 2.5, borderRadius: 3, borderColor: 'warning.main' }}>
                      <Typography variant="caption" color="text.secondary">Lower Bound</Typography>
                      <Typography variant="h6" color="warning.main" fontWeight={700}>
                        ${result.confidence_interval.lower?.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper variant="outlined" sx={{ p: 1.5, px: 2.5, borderRadius: 3, borderColor: 'success.main' }}>
                      <Typography variant="caption" color="text.secondary">Upper Bound</Typography>
                      <Typography variant="h6" color="success.main" fontWeight={700}>
                        ${result.confidence_interval.upper?.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              <Box sx={{ mt: 2 }}>
                <Chip label={`Based on your inputs: ${form.job_title} · ${form.experience_level} · ${form.company_location}`} size="small" variant="outlined" />
              </Box>
            </Paper>
          ) : (
            <Paper sx={{
              p: 6, textAlign: 'center', border: 1, borderColor: 'divider',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300,
            }}>
              <AutoGraphIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Your prediction will appear here</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mt: 1 }}>
                Fill in the form and click "Predict My Salary" to see your estimated annual compensation.
              </Typography>
            </Paper>
          )}
        </motion.div>
      </Grid>
    </Grid>
  );
}
