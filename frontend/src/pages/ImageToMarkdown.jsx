import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Paper, Typography, Box, Button, Chip, CircularProgress, Alert, Grid,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ImageIcon from '@mui/icons-material/Image';
import client from '../api/client';

export default function ImageToMarkdown() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await client.post('/image-to-markdown', form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.markdown) return;
    navigator.clipboard.writeText(result.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper sx={{
          p: 3, mb: 4,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #13182b 0%, #1a2040 50%, #13182b 100%)'
            : 'linear-gradient(135deg, #f0f2ff 0%, #e8ecf8 50%, #f0f2ff 100%)',
          border: 1, borderColor: 'divider',
        }}>
          <Chip label="Pipeline" size="small" color="secondary" variant="outlined" sx={{ mb: 1.5 }} />
          <Typography variant="h4" gutterBottom>Image → Markdown</Typography>
          <Typography variant="body1" color="text.secondary">
            Upload a dashboard screenshot or UI image. The system preprocesses, detects layout blocks,
            runs OCR per region, and generates structured markdown.
          </Typography>
        </Paper>
      </motion.div>

      <Grid container spacing={3}>
        {/* Upload Side */}
        <Grid item xs={12} md={5}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Paper sx={{ p: 3, border: 1, borderColor: 'divider', textAlign: 'center' }}>
              <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleSelect} />

              {preview ? (
                <Box mb={2}>
                  <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 12, border: '1px solid #333' }} />
                  <Typography variant="caption" display="block" mt={1} color="text.secondary">{file?.name}</Typography>
                </Box>
              ) : (
                <Box
                  onClick={() => inputRef.current?.click()}
                  sx={{
                    border: '2px dashed', borderColor: 'divider', borderRadius: 3,
                    p: 6, mb: 2, cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                  }}
                >
                  <ImageIcon sx={{ fontSize: 60, opacity: 0.3, mb: 1 }} />
                  <Typography>Click to select a screenshot</Typography>
                  <Typography variant="caption" color="text.secondary">PNG, JPG, JPEG</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={() => inputRef.current?.click()} fullWidth>
                  {preview ? 'Change' : 'Browse'}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleUpload}
                  disabled={!file || loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <UploadIcon />}
                  sx={{ background: 'linear-gradient(135deg, #7b8cd1 0%, #5a6db8 100%)' }}
                >
                  {loading ? 'Processing…' : 'Convert'}
                </Button>
              </Box>

              {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

              <Box mt={2} textAlign="left">
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Pipeline steps:</Typography>
                <Box component="ol" sx={{ pl: 2, mt: 0.5, '& li': { fontSize: '0.75rem', color: 'text.secondary', mb: 0.3 } }}>
                  <li>Preprocess (upscale, sharpen, contrast, dark mode)</li>
                  <li>Layout detection (contour analysis)</li>
                  <li>OCR per region</li>
                  <li>Block classification</li>
                  <li>Markdown generation</li>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Results Side */}
        <Grid item xs={12} md={7}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Generated Markdown</Typography>
                {result && (
                  <Button size="small" startIcon={<ContentCopyIcon />} onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </Box>

              {result ? (
                <>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2, borderRadius: 2, maxHeight: 450, overflow: 'auto',
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
                      fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap', lineHeight: 1.6,
                    }}
                  >
                    {result.markdown}
                  </Paper>
                  {result.blocks_detected && (
                    <Chip label={`${result.blocks_detected} blocks detected`} size="small" sx={{ mt: 1 }} />
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.4 }}>
                  <ImageIcon sx={{ fontSize: 60, mb: 1 }} />
                  <Typography>Upload and convert to see markdown output</Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
