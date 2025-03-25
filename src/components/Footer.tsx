import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, useTheme, useMediaQuery } from '@mui/material';
import { GitHub, LinkedIn, Twitter } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const translate = t as (key: string) => string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Don't render footer on mobile/tablet
  if (isMobile) {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Weather App
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay informed about weather conditions worldwide with our comprehensive weather application.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="text.secondary" underline="hover">
                Home
              </Link>
              <Link href="/about" color="text.secondary" underline="hover">
                About
              </Link>
              <Link href="/contact" color="text.secondary" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton color="primary" aria-label="GitHub">
                <GitHub />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <Twitter />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {translate('appName')}. {translate('footer.rights')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: '0.875rem' }}
            >
              {translate('privacy.title')}
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: '0.875rem' }}
            >
              {translate('terms.title')}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 