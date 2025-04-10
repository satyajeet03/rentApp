import { Box, Typography, Avatar, Button, Stack, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface OwnerInfoProps {
  owner: {
    name: string;
    email: string;
    phone?: string;
    profilePic?: string;
  };
}

export const OwnerInfo = ({ owner }: OwnerInfoProps) => {
  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Owner Information
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar
          src={owner.profilePic || ''}
          alt={owner.name}
          sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
        >
          {owner.name?.[0]}
        </Avatar>
        <Box>
          <Typography variant="subtitle1">{owner.name}</Typography>
          <Typography variant="body2" color="text.secondary">{owner.email}</Typography>
          {owner.phone && (
            <Typography variant="body2" color="text.secondary">{owner.phone}</Typography>
          )}
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          fullWidth
          onClick={() => window.location.href = `mailto:${owner.email}`}
        >
          Contact Owner
        </Button>
        <Button
          variant="outlined"
          startIcon={<CalendarMonthIcon />}
          fullWidth
          onClick={() => alert('Booking feature coming soon!')}
        >
          Book Visit
        </Button>
      </Stack>
    </Box>
  );
};
