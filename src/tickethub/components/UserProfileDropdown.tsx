import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ActivityIcon from '@mui/icons-material/Timeline';
import HelpIcon from '@mui/icons-material/Help';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import CircleIcon from '@mui/icons-material/Circle';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const StyledBadge = styled(Badge)<{ statuscolor: string }>(({ theme, statuscolor }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: statuscolor,
    color: statuscolor,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: '0.7rem',
  '& .MuiChip-label': {
    padding: '0 6px',
  },
}));

// Utility function to generate consistent dummy avatar URLs
export const getDummyAvatarUrl = (name: string): string => {
  const avatars = [
    '/static/images/avatar/1.jpg',
    '/static/images/avatar/2.jpg', 
    '/static/images/avatar/3.jpg',
    '/static/images/avatar/4.jpg',
    '/static/images/avatar/5.jpg',
    '/static/images/avatar/6.jpg',
    '/static/images/avatar/7.jpg'
  ];
  
  // Use the name to consistently pick the same avatar
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return avatars[hash % avatars.length];
};

type UserStatus = 'online' | 'away' | 'busy' | 'dnd';

const userStatuses: { value: UserStatus; label: string; color: string }[] = [
  { value: 'online', label: 'Online', color: '#44b700' },
  { value: 'away', label: 'Away', color: '#ff9800' },
  { value: 'busy', label: 'Busy', color: '#f44336' },
  { value: 'dnd', label: 'Do Not Disturb', color: '#9e9e9e' },
];

export default function UserProfileDropdown() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userStatus, setUserStatus] = React.useState<UserStatus>('online');
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: UserStatus) => {
    setUserStatus(status);
    // In a real app, this would update the user's status on the server
    console.log('Status changed to:', status);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      // In a real app, this would call the logout API
      window.location.reload();
    }
    handleClose();
  };

  const handleMenuItemClick = (action: string) => {
    handleClose();
    
    switch (action) {
      case 'profile':
        navigate('/settings');
        break;
      case 'tickets':
        navigate('/tickets');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'help':
        window.open('https://help.tickethub.com', '_blank');
        break;
      case 'shortcuts':
        // Show keyboard shortcuts modal
        alert('Keyboard shortcuts: Ctrl+K (Search), Ctrl+N (New Ticket), Ctrl+/ (Help)');
        break;
      case 'about':
        alert('TicketHub v2.0.0 - Advanced Customer Support Platform');
        break;
      default:
        break;
    }
  };

  if (!user) return null;

  const currentStatus = userStatuses.find(s => s.value === userStatus) || userStatuses[0];
  const avatarUrl = user.avatar || getDummyAvatarUrl(user.name);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 1 }}
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-label="User profile menu"
      >
        <Avatar
          alt={user.name}
          src={avatarUrl}
          sx={{ width: 32, height: 32 }}
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 280,
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              alt={user.name}
              src={avatarUrl}
              sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <CircleIcon 
                  sx={{ 
                    fontSize: 8, 
                    color: currentStatus.color 
                  }} 
                />
                <StatusChip
                  label={currentStatus.label}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Status Options */}
        <Box sx={{ px: 1, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5, display: 'block' }}>
            Set Status
          </Typography>
          {userStatuses.map((status) => (
            <MenuItem
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              selected={userStatus === status.value}
              sx={{ py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CircleIcon sx={{ fontSize: 8, color: status.color }} />
              </ListItemIcon>
              <ListItemText 
                primary={status.label}
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </MenuItem>
          ))}
        </Box>

        <Divider />

        {/* Profile & Account */}
        <MenuItem onClick={() => handleMenuItemClick('profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('tickets')}>
          <ListItemIcon>
            <ConfirmationNumberIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Tickets" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Account Settings" />
        </MenuItem>

        <Divider />

        {/* Help & Support */}
        <MenuItem onClick={() => handleMenuItemClick('help')}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Help & Support" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('shortcuts')}>
          <ListItemIcon>
            <KeyboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Keyboard Shortcuts" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('about')}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="About TicketHub" />
        </MenuItem>

        <Divider />

        {/* Logout */}
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>
    </>
  );
}
