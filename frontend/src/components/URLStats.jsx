import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
} from "@mui/material";
import axios from "axios";
import logger from "../middleware/logger";

const URLStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storedUrls] = useState(() => {
    return JSON.parse(localStorage.getItem("shortenedUrls")) || [];
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const results = [];
      for (const entry of storedUrls) {
        const parts = entry.shortLink.split("/");
        const shortcode = parts[parts.length - 1];
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/shorturls/${shortcode}`
          );
          results.push({ ...res.data, shortLink: entry.shortLink });
          try {
            await logger(
              "frontend",
              "info",
              "api",
              `Fetched stats for: ${shortcode}`
            );
          } catch (logErr) {
            console.warn("Logging failed:", logErr.message);
          }
        } catch (err) {
          results.push({
            shortLink: entry.shortLink,
            error: "Failed to fetch stats",
          });
          try {
            await logger(
              "frontend",
              "error",
              "api",
              `Error fetching stats for ${shortcode}: ${err.message}`
            );
          } catch (logErr) {
            console.warn("Logging failed:", logErr.message);
          }
        }
      }
      setStats(results);
      setLoading(false);
    };
    fetchStats();
  }, []); // ✅ Run only once on mount

  const formatUrl = (url) => {
    if (!url) return "N/A";
    // Truncate long URLs on mobile
    if (isMobile && url.length > 30) {
      return url.substring(0, 30) + "...";
    }
    if (isTablet && url.length > 50) {
      return url.substring(0, 50) + "...";
    }
    return url;
  };

  const StatItem = ({ label, value, fullValue }) => (
    <Box sx={{ mb: isMobile ? 1 : 0.5 }}>
      <Typography
        variant={isMobile ? "body2" : "body1"}
        component='div'
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 0 : 1,
          wordBreak: "break-word",
        }}
      >
        <Typography
          component='span'
          sx={{
            fontWeight: "bold",
            minWidth: isMobile ? "auto" : "120px",
            fontSize: isMobile ? "0.875rem" : "inherit",
          }}
        >
          {label}:
        </Typography>
        <Typography
          component='span'
          sx={{
            fontSize: isMobile ? "0.875rem" : "inherit",
            wordBreak: "break-all",
          }}
          title={fullValue || value}
        >
          {value}
        </Typography>
      </Typography>
    </Box>
  );

  return (
    <Container
      maxWidth='lg'
      sx={{
        mt: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        sx={{
          textAlign: { xs: "center", sm: "left" },
          mb: { xs: 2, sm: 3 },
        }}
      >
        URL Statistics
      </Typography>

      {loading ? (
        <Box
          display='flex'
          justifyContent='center'
          my={{ xs: 2, sm: 3, md: 4 }}
        >
          <CircularProgress size={isMobile ? 32 : 40} />
        </Box>
      ) : stats.length === 0 ? (
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            textAlign: "center",
            backgroundColor: theme.palette.grey[50],
          }}
        >
          <Typography variant={isMobile ? "body2" : "body1"}>
            No URL stats available. Please create some shortened URLs first.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={{ xs: 2, sm: 3 }}>
          {stats.map((stat, index) => (
            <Paper
              key={index}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: { xs: 1, sm: 2 },
                boxShadow: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{
                    mb: 1,
                    wordBreak: "break-all",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  Short Link: {stat.shortLink}
                </Typography>

                {stat.error ? (
                  <Typography
                    color='error'
                    variant={isMobile ? "body2" : "body1"}
                  >
                    {stat.error}
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    <StatItem
                      label='Original URL'
                      value={formatUrl(stat.originalUrl)}
                      fullValue={stat.originalUrl}
                    />

                    <StatItem
                      label='Created At'
                      value={new Date(stat.createdAt).toLocaleString()}
                    />

                    <StatItem
                      label='Expires At'
                      value={new Date(stat.expiresAt).toLocaleString()}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant={isMobile ? "body2" : "body1"}
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Clicks:
                      </Typography>
                      <Chip
                        label={stat.totalClicks}
                        size={isMobile ? "small" : "medium"}
                        color='primary'
                        variant='outlined'
                      />
                    </Box>

                    {stat.clicks && stat.clicks.length > 0 && (
                      <>
                        <Divider sx={{ my: { xs: 1, sm: 2 } }} />
                        <Typography
                          variant={isMobile ? "subtitle2" : "subtitle1"}
                          sx={{ mb: 1 }}
                        >
                          Recent Clicks:
                        </Typography>

                        <Box
                          sx={{
                            maxHeight: { xs: 200, sm: 300 },
                            overflowY: "auto",
                            pr: 1,
                          }}
                        >
                          <Stack spacing={1}>
                            {stat.clicks.map((click, i) => (
                              <Paper
                                key={i}
                                variant='outlined'
                                sx={{
                                  p: { xs: 1, sm: 1.5 },
                                  backgroundColor: theme.palette.grey[50],
                                  borderRadius: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: { xs: 0.5, sm: 2 },
                                    alignItems: {
                                      xs: "flex-start",
                                      sm: "center",
                                    },
                                  }}
                                >
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem",
                                      },
                                      color: theme.palette.text.secondary,
                                    }}
                                  >
                                    🕒{" "}
                                    {new Date(click.timestamp).toLocaleString()}
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                      },
                                      gap: { xs: 0.5, sm: 1 },
                                    }}
                                  >
                                    <Typography
                                      variant='body2'
                                      sx={{
                                        fontSize: {
                                          xs: "0.75rem",
                                          sm: "0.875rem",
                                        },
                                        color: theme.palette.text.secondary,
                                      }}
                                    >
                                      🌐 Source: {click.source || "Unknown"}
                                    </Typography>

                                    <Typography
                                      variant='body2'
                                      sx={{
                                        fontSize: {
                                          xs: "0.75rem",
                                          sm: "0.875rem",
                                        },
                                        color: theme.palette.text.secondary,
                                      }}
                                    >
                                      📍 Location: {click.location || "Unknown"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      </>
                    )}
                  </Stack>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default URLStats;
