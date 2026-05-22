import { Paper, Grid, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import PublicIcon from '@mui/icons-material/Public';

function StatCard({ icon, label, value }) {
  return (
    <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
      {icon}
      <div>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h5" fontWeight={700}>{value}</Typography>
      </div>
    </Paper>
  );
}

export default function StatsCards({ stats }) {
  if (!stats) return null;
  return (
    <Grid container spacing={2} mb={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard icon={<PeopleIcon color="primary" sx={{ fontSize: 40 }} />} label="Total Records" value={stats.total_records?.toLocaleString()} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard icon={<AttachMoneyIcon color="primary" sx={{ fontSize: 40 }} />} label="Avg Salary (USD)" value={`$${stats.avg_salary?.toLocaleString()}`} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard icon={<WorkIcon color="primary" sx={{ fontSize: 40 }} />} label="Unique Job Titles" value={stats.unique_job_titles} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard icon={<PublicIcon color="primary" sx={{ fontSize: 40 }} />} label="Countries" value={stats.unique_countries} />
      </Grid>
    </Grid>
  );
}
