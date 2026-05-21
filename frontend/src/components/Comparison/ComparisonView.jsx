import { useState } from 'react';
import {
  Paper, Typography, Button, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Alert, Box,
  Checkbox,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { compareData } from '../../api/client';

const GROUPS = [
  {
    label: 'Job Titles', key: 'jobTitles',
    options: ['Data Scientist', 'Data Engineer', 'Data Analyst', 'Machine Learning Engineer',
      'Analytics Engineer', 'Data Architect', 'Data DevOps Engineer', 'Research Scientist', 'BI Analyst'],
  },
  {
    label: 'Countries', key: 'countries',
    options: ['United States', 'United Kingdom', 'Germany', 'Canada', 'India',
      'France', 'Spain', 'Australia', 'Netherlands', 'Brazil'],
  },
  {
    label: 'Experience', key: 'experienceLevels',
    options: ['Entry-level', 'Mid-level', 'Senior', 'Executive'],
  },
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
    if (!hasAny) { setError('Check at least one option'); return; }
    setError('');
    try {
      const res = await compareData({
        job_titles: selections.jobTitles,
        countries: selections.countries,
        experience_levels: selections.experienceLevels,
      });
      setResult(res);
    } catch { setError('No matching data found.'); }
  };

  const totalSelected = Object.values(selections).reduce((a, b) => a + b.length, 0);

  const renderTable = (label, data) => {
    if (!data || !data.length) return null;
    return (
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>{label}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Records</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Mean</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Min</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Max</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Std Dev</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.key} hover>
                  <TableCell><Chip label={r.key} size="small" variant="outlined" /></TableCell>
                  <TableCell align="right">{r.count}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    ${r.mean?.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">${r.min?.toLocaleString()}</TableCell>
                  <TableCell align="right">${r.max?.toLocaleString()}</TableCell>
                  <TableCell align="right">${Math.round(r.std)?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600} display="flex" alignItems="center" gap={1}>
              <CompareArrowsIcon color="primary" /> Compare Salaries
            </Typography>
            {totalSelected > 0 && (
              <Chip label={`${totalSelected} selected`} size="small" />
            )}
          </Box>

          <Grid container spacing={2} mb={2}>
            {GROUPS.map((group) => {
              const selected = selections[group.key];
              return (
                <Grid item xs={12} md={4} key={group.key}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={600}>{group.label}</Typography>
                      {selected.length > 0 && (
                        <Chip label={selected.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                      )}
                    </Box>

                    {selected.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3, mb: 0.5 }}>
                        {selected.map(s => (
                          <Chip
                            key={s} label={s} size="small" variant="outlined"
                            onDelete={() => toggle(group.key, s)}
                            deleteIcon={<CheckCircleIcon />}
                            sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                          />
                        ))}
                      </Box>
                    )}

                    <Paper variant="outlined" sx={{ p: 0.5, bgcolor: 'background.default', maxHeight: 180, overflow: 'auto' }}>
                      {group.options.map((opt) => {
                        const isChecked = selected.includes(opt);
                        return (
                          <Box
                            key={opt}
                            onClick={() => toggle(group.key, opt)}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 0.5,
                              py: 0.3, px: 0.8, cursor: 'pointer', borderRadius: 0.5,
                              bgcolor: isChecked ? 'primary.main' + '14' : 'transparent',
                              '&:hover': { bgcolor: isChecked ? 'primary.main' + '20' : 'action.hover' },
                            }}
                          >
                            <Checkbox checked={isChecked} size="small" sx={{ p: 0.2 }} />
                            <Typography variant="body2" fontWeight={isChecked ? 600 : 400}>
                              {opt}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Paper>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Button
            variant="contained" fullWidth size="large" onClick={handleCompare}
            disabled={totalSelected === 0} sx={{ py: 1.3 }}
          >
            {totalSelected === 0 ? 'Select options above' : `Compare ${totalSelected} selection${totalSelected > 1 ? 's' : ''}`}
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        {error && <Alert severity="warning">{error}</Alert>}
        {result && (
          <>
            {renderTable('By Job Title', result.by_job)}
            {renderTable('By Country', result.by_country)}
            {renderTable('By Experience Level', result.by_experience)}
          </>
        )}
        {!result && !error && (
          <Paper variant="outlined" sx={{
            p: 6, textAlign: 'center', minHeight: 160, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <CompareArrowsIcon sx={{ fontSize: 50, opacity: 0.15, mb: 1 }} />
            <Typography variant="h6" color="text.secondary">Select options and click Compare</Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
