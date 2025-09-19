import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import EscalationIcon from '@mui/icons-material/PriorityHigh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import { useRealTime } from '../contexts/RealTimeContext';
import { useNavigate } from 'react-router-dom';

const NotificationAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
}));

const UnreadListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderLeft: `3px solid ${theme.palette.primary.main}`,
}));

export default function RealTimeNotifications() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    isConnected,
    connectionState 
  } = useRealTime();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    // Navigate to ticket if available
    if (notification.ticketId) {
      navigate(`/tickets/${notification.ticketId}`);
    }
    
    handleClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ticket_created':
      case 'ticket_updated':
        return <TicketIcon fontSize="small" />;
      case 'escalation':
        return <EscalationIcon fontSize="small" />;
      case 'ticket_assigned':
        return <AssignmentIcon fontSize="small" />;
      case 'message':
        return <MessageIcon fontSize="small" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'escalation':
        return 'error';
      case 'ticket_assigned':
        return 'success';
      case 'ticket_updated':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        size="small"
        sx={{ 
          ml: 1,
          color: connectionState === 'connected' ? 'inherit' : 'error.main'
        }}
        title={`Notifications${!isConnected ? ' (Disconnected)' : ''}`}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Notifications
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            
            <Stack direction="row" spacing={1}>
              {/* Connection status indicator */}
              <Chip
                size="small"
                label={connectionState}
                color={connectionState === 'connected' ? 'success' : 'error'}
                variant="outlined"
              />
              
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
            {notifications.slice(0, 10).map((notification) => {
              const ListItemComponent = notification.read ? ListItem : UnreadListItem;
              
              return (
                <React.Fragment key={notification.id}>
                  <ListItemComponent
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemAvatar>
                      <NotificationAvatar
                        sx={{ 
                          bgcolor: `${getNotificationColor(notification.type)}.main`,
                          color: 'white'
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </NotificationAvatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ fontWeight: notification.read ? 400 : 600 }}
                          >
                            {notification.title}
                          </Typography>
                          {notification.priority && (
                            <Chip
                              label={notification.priority}
                              size="small"
                              color={getPriorityColor(notification.priority)}
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary">
                            {notification.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItemComponent>
                  <Divider />
                </React.Fragment>
              );
            })}
          </List>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button size="small" variant="outlined" onClick={clearNotifications}>
                Clear All
              </Button>
              <Button size="small" variant="text">
                View All Notifications
              </Button>
            </Stack>
          </Box>
        )}
      </Menu>
    </>
  );
}
