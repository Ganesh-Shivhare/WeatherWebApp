import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();
  const translate = t as (key: string) => string;

  const sections = [
    'introduction',
    'usage',
    'accuracy',
    'liability',
    'modifications',
    'contact'
  ];

  const renderContent = (content: string) => {
    // Replace email addresses with clickable links
    return content.replace(
      /terms@weatherapp\.com/g,
      (match) => `<a href="mailto:${match}" style="color: #1976d2; text-decoration: none;">${match}</a>`
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {translate('terms.title')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {translate('terms.lastUpdated')}
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          {sections.map((section) => (
            <Box key={section} sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {translate(`terms.${section}.title`)}
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                dangerouslySetInnerHTML={{ 
                  __html: renderContent(translate(`terms.${section}.content`))
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsOfService; 