import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Paper, Typography, Button, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Alert, Box,
  FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { compareData } from '../../api/client';

const GROUPS = [
  { label: 'Job Titles', key: 'jobTitles', state: null, icon: '💼',
    options: ['Data Scientist', 'Data Engineer', 'Data Analyst', 'Machine Learning Engineer', 'Analytics Engineer', 'Data Architect', 'Data DevOps Engineer', 'Research Scientist', 'BI Analyst'] },
  { label: 'Countries', key: 'countries', state: null, icon: '🌍',
    options: ['United States', 'United Kingdom', 'Germany', 'Canada', 'India', 'France', 'Spain', 'Australia', 'Netherlands', 'Brazil'] },
  { label: 'Experience Levels', key: 'experienceLevels', state: null, icon: '📈',
    options: ['Entry-level', 'Mid-level', 'Senior', 'Executive'] },
];

export default function ComparisonView() {
  const [selections, setSelections] = useState({ jobTitles: [], countries: [], experienceLevels: [] });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const toggle = (group, value) => {
    setSelections(prev => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter(v => v !== value)
        : [...prev[group], value],
    }));
  };

  const handleCompare = async () => {
    const hasAny = Object.values(selections).some(arr => arr.length > 0);
    if (!hasAny) { setError('Check at least one option to compare'); return; }
    setError('');
    try {
      const res = await compareData({ job_titles: selections.jobTitles, countries: selections.countries, experience_levels: selections.experienceLevels });
      setResult(res);
    } catch { setError('No matching data found.'); }
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
              <CompareArrowsIcon color="warning" /> Select to Compare
            </Typography>

            {GROUPS.map((group) => (
              <FormControl key={group.key} component="fieldset" sx={{ mb: 2.5, width: '100%' }}>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.85rem' }}>
                  {group.icon} {group.label}
                  {selections[group.key].length > 0 && (
                    <Chip label={selections[group.key].length} size="small" color="primary" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                  )}
                </FormLabel>
                <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, maxHeight: 200, overflow: 'auto' }}>
                  <FormGroup>
                    {group.options.map((opt) => (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            size="small"
                            checked={selections[group.key].includes(opt)}
                            onChange={() => toggle(group.key, opt)}
                          />
                        }
                        label={<Typography variant="body2">{opt}</Typography>}
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                      />
                    ))}
                  </FormGroup>
                </Paper>
              </FormControl>
            ))}

            <Box sx={{ mt: 1 }}>
              <Button variant="contained" fullWidth size="large" onClick={handleCompare}
                sx={{ background: 'linear-gradient(135deg, #f6a85b 0%, #e8913a 100%)', py: 1.5 }}>
                Compare Salaries
              </Button>
            </Box>
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
            <Typography variant="h6" color="text.secondary">Check options on the left</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 350, mt: 1 }}>
              Tick the checkboxes for items you want to compare, then click "Compare Salaries".
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
