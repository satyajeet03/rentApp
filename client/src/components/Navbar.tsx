import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Dialog,
  DialogContent,
  Button,
  Popper,
  Paper,
  Fade,
  ClickAwayListener,
  Divider,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  if (loading) return null;

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >
            RentApp
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <> 

                <IconButton
                  color="inherit"
                  onClick={() => setOpen((prev) => !prev)}
                  ref={anchorRef}
                >
                  <AccountCircle fontSize="large" />
                </IconButton>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  placement="bottom-end"
                  disablePortal
                  sx={{ zIndex: 1300 }}
                >
                  <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Paper
                      elevation={6}
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        minWidth: 220,
                        p: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <Box
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: 18,
                            mr: 1.5,
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={handleLogout}
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": {
                            bgcolor: "error.main",
                            color: "white",
                            borderColor: "error.main",
                          },
                        }}
                      >
                        Logout
                      </Button>
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
