import { useState, useEffect, useMemo } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, MenuItem, Grid, Typography, CircularProgress,
} from '@mui/material';
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

  const paginatedData = useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  return (
    <Paper>
      <Typography variant="h6" sx={{ p: 2, pb: 0 }}>Filter Data</Typography>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} sm={3}>
          <TextField select fullWidth size="small" label="Category" value={filters.job_category}
            onChange={(e) => { setFilters({ ...filters, job_category: e.target.value }); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {filterOptions.job_category.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField select fullWidth size="small" label="Experience" value={filters.experience_level}
            onChange={(e) => { setFilters({ ...filters, experience_level: e.target.value }); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {filterOptions.experience_level.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField select fullWidth size="small" label="Country" value={filters.company_location}
            onChange={(e) => { setFilters({ ...filters, company_location: e.target.value }); setPage(0); }}>
            <MenuItem value="">All</MenuItem>
            {filterOptions.company_location.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField fullWidth size="small" type="number" label="Year" value={filters.work_year}
            onChange={(e) => { setFilters({ ...filters, work_year: e.target.value }); setPage(0); }} />
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Salary (USD)</TableCell>
                  <TableCell align="right">Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{row.job_title}</TableCell>
                    <TableCell>{row.job_category}</TableCell>
                    <TableCell>{row.experience_level}</TableCell>
                    <TableCell>{row.company_location}</TableCell>
                    <TableCell align="right">${row.salary_in_usd?.toLocaleString()}</TableCell>
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
          />
        </>
      )}
    </Paper>
  );
}
