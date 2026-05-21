import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, MenuItem, Grid, Typography, CircularProgress,
  Box, Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getFilteredData, getUniqueValues } from '../../api/client';

export default function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState({ work_year: '', job_category: '', experience_level: '', company_location: '' });
  const [filterOptions, setFilterOptions] = useState({ job_category: [], experience_level: [], company_location: [] });

  useEffect(() => {
    Promise.all([
      getUniqueValues('job_category'),
      getUniqueValues('experience_level'),
      getUniqueValues('company_location'),
    ]).then(([jc, el, cl]) => setFilterOptions({ job_category: jc, experience_level: el, company_location: cl }));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    params.limit = 500;
    getFilteredData(params)
      .then(setData)
      .finally(() => setLoading(false));
  }, [filters]);

  const activeFilters = Object.values(filters).filter(Boolean).length;

  const paginatedData = useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Paper sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, pb: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <SearchIcon color="primary" /> Explore Salary Data
            </Typography>
            {activeFilters > 0 && (
              <Chip label={`${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`} size="small" color="primary" variant="outlined" />
            )}
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ px: 2.5, pb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField select fullWidth size="small" label="Category" value={filters.job_category}
              onChange={(e) => { setFilters({ ...filters, job_category: e.target.value }); setPage(0); }}>
              <MenuItem value="">All Categories</MenuItem>
              {filterOptions.job_category.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField select fullWidth size="small" label="Experience" value={filters.experience_level}
              onChange={(e) => { setFilters({ ...filters, experience_level: e.target.value }); setPage(0); }}>
              <MenuItem value="">All Levels</MenuItem>
              {filterOptions.experience_level.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField select fullWidth size="small" label="Country" value={filters.company_location}
              onChange={(e) => { setFilters({ ...filters, company_location: e.target.value }); setPage(0); }}>
              <MenuItem value="">All Countries</MenuItem>
              {filterOptions.company_location.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth size="small" type="number" label="Year" value={filters.work_year}
              onChange={(e) => { setFilters({ ...filters, work_year: e.target.value }); setPage(0); }}
              placeholder="e.g. 2023" />
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Job Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Experience</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Salary (USD)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Year</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row, i) => (
                    <TableRow key={i} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell><Typography variant="body2" fontWeight={500}>{row.job_title}</Typography></TableCell>
                      <TableCell><Chip label={row.job_category} size="small" variant="outlined" /></TableCell>
                      <TableCell>{row.experience_level}</TableCell>
                      <TableCell>{row.company_location}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="primary.main">
                          ${row.salary_in_usd?.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{row.work_year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data.length}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </>
        )}
      </Paper>
    </motion.div>
  );
}
