import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  IconButton,
  Divider,
  Card,
  CardContent,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import ClearIcon from "@mui/icons-material/Clear";
import api from "../utils/api";
import logger from "../middleware/logger";

const URLForm = () => {
  const [urls, setUrls] = useState([{ url: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState(() => {
    return JSON.parse(localStorage.getItem("shortenedUrls")) || [];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("shortenedUrls", JSON.stringify(results));
  }, [results]);

  const handleChange = (index, e) => {
    const updated = [...urls];
    updated[index][e.target.name] = e.target.value;
    setUrls(updated);
  };

  const addUrl = () => {
    if (urls.length < 5)
      setUrls([...urls, { url: "", validity: "", shortcode: "" }]);
  };

  const deleteUrl = (index) => {
    const updated = urls.filter((_, i) => i !== index);
    setUrls(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const responseData = [];
      for (let i = 0; i < urls.length; i++) {
        const res = await api.post("/shorturls", urls[i]);
        responseData.push(res.data);
        await logger(
          "frontend",
          "info",
          "api",
          `Short URL created: ${res.data.shortLink}`
        );
      }
      const newResults = [...results, ...responseData];
      setResults(newResults);
      setUrls([{ url: "", validity: "", shortcode: "" }]);
    } catch (err) {
      await logger("frontend", "error", "api", err.message);
      alert("Error creating short URLs");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirect = (shortLink) => {
    window.open(shortLink, "_blank");
  };

  const clearResults = () => {
    setResults([]);
    localStorage.removeItem("shortenedUrls");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction='row' alignItems='center' spacing={2} mb={3}>
            <LinkIcon color='primary' />
            <Typography variant='h4' component='h1' color='primary'>
              URL Shortener
            </Typography>
          </Stack>

          <Typography variant='body1' color='text.secondary' mb={3}>
            Create short links for up to 5 URLs at once with custom expiration
            times
          </Typography>

          <Stack spacing={3}>
            {urls.map((entry, idx) => (
              <Paper
                key={idx}
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "primary.main",
                    elevation: 3,
                  },
                }}
              >
                <Grid container spacing={2} alignItems='center'>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label='Long URL'
                      name='url'
                      value={entry.url}
                      onChange={(e) => handleChange(idx, e)}
                      placeholder='https://example.com/very-long-url'
                      variant='outlined'
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label='Validity (minutes)'
                      name='validity'
                      value={entry.validity}
                      onChange={(e) => handleChange(idx, e)}
                      placeholder='60'
                      variant='outlined'
                      size='small'
                      type='number'
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label='Custom shortcode'
                      name='shortcode'
                      value={entry.shortcode}
                      onChange={(e) => handleChange(idx, e)}
                      placeholder='my-link'
                      variant='outlined'
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      onClick={() => deleteUrl(idx)}
                      color='error'
                      disabled={urls.length === 1}
                      sx={{
                        "&:hover": {
                          bgcolor: "error.light",
                          color: "error.contrastText",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>

          <Stack direction='row' spacing={2} mt={3}>
            <Button
              onClick={addUrl}
              variant='outlined'
              startIcon={<AddIcon />}
              disabled={urls.length >= 5}
              sx={{ borderRadius: 2 }}
            >
              Add URL ({urls.length}/5)
            </Button>
            <Button
              onClick={handleSubmit}
              variant='contained'
              disabled={isSubmitting || urls.some((u) => !u.url)}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {isSubmitting ? "Shortening..." : "Shorten URLs"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card elevation={2}>
          <CardContent>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              mb={3}
            >
              <Typography variant='h5' component='h2'>
                Shortened URLs ({results.length})
              </Typography>
              <Button
                variant='outlined'
                color='error'
                onClick={clearResults}
                startIcon={<ClearIcon />}
                sx={{ borderRadius: 2 }}
              >
                Clear All
              </Button>
            </Stack>

            <Stack spacing={2}>
              {results.map((r, i) => (
                <Paper
                  key={i}
                  elevation={1}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "primary.main",
                      elevation: 2,
                    },
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction='row' alignItems='center' spacing={2}>
                      <Typography variant='subtitle1' fontWeight='bold'>
                        Short Link:
                      </Typography>
                      <Chip
                        label={r.shortLink}
                        variant='outlined'
                        color='primary'
                        size='small'
                        sx={{ fontFamily: "monospace" }}
                      />
                      <IconButton
                        size='small'
                        onClick={() => handleRedirect(r.shortLink)}
                        color='primary'
                        sx={{
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                          },
                        }}
                      >
                        <OpenInNewIcon fontSize='small' />
                      </IconButton>
                    </Stack>

                    <Stack direction='row' alignItems='center' spacing={2}>
                      <Typography variant='subtitle1' fontWeight='bold'>
                        Expires:
                      </Typography>
                      <Chip
                        label={new Date(r.expiry).toLocaleString()}
                        variant='outlined'
                        color='secondary'
                        size='small'
                      />
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default URLForm;
