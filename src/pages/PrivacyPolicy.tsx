import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const translate = t as (key: string) => string;

  const sections = [
    "introduction",
    "dataCollection",
    "dataUsage",
    "cookies",
    "thirdParty",
    "security",
    "contact",
  ];

  const renderContent = (content: string) => {
    // Replace email addresses with clickable links
    return content.replace(
      /privacy@weatherapp\.com/g,
      (match) =>
        `<a href="mailto:${match}" style="color: #1976d2; text-decoration: none;">${match}</a>`
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {translate("privacy.title")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {translate("privacy.lastUpdated")}
        </Typography>

        <Box sx={{ mt: 4 }}>
          {sections.map((section) => (
            <Box key={section} sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {translate(`privacy.${section}.title`)}
              </Typography>
              <Typography
                variant="body1"
                paragraph
                dangerouslySetInnerHTML={{
                  __html: renderContent(
                    translate(`privacy.${section}.content`)
                  ),
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
