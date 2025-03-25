import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Download,
  OfflinePin,
  Notifications,
  Speed,
  Security,
  Menu,
  Add,
  Check,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface PWAInstallDialogProps {
  open: boolean;
  onClose: () => void;
  onInstall: () => void;
}

const PWAInstallDialog: React.FC<PWAInstallDialogProps> = ({
  open,
  onClose,
  onInstall,
}) => {
  const { t } = useTranslation();
  // Type assertion for translation function
  const translate = t as (key: string) => string;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <OfflinePin />,
      text: translate('pwa.features.offline'),
    },
    {
      icon: <Speed />,
      text: translate('pwa.features.fast'),
    },
    {
      icon: <Notifications />,
      text: translate('pwa.features.notifications'),
    },
    {
      icon: <Security />,
      text: translate('pwa.features.secure'),
    },
  ];

  const installSteps = [
    {
      icon: <Menu />,
      label: translate('pwa.install.step1'),
    },
    {
      icon: <Add />,
      label: translate('pwa.install.step2'),
    },
    {
      icon: <Check />,
      label: translate('pwa.install.step3'),
    },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          m: 2,
          maxWidth: '90%',
          width: '400px',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {translate('pwa.install.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {translate('pwa.install.subtitle')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {feature.icon}
              </ListItemIcon>
              <ListItemText 
                primary={feature.text}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: { fontWeight: 500 }
                }}
              />
            </ListItem>
          ))}
        </List>
        {isMobile && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {translate('pwa.install.howToInstall')}
            </Typography>
            <Stepper orientation="vertical" activeStep={-1}>
              {installSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel StepIconProps={{ icon: step.icon }}>
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          {translate('pwa.install.notNow')}
        </Button>
        <Button
          variant="contained"
          onClick={onInstall}
          startIcon={<Download />}
          sx={{ ml: 1 }}
        >
          {translate('pwa.install.install')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PWAInstallDialog; 