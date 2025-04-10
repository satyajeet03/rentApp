// Properties.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Paper,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { Property, PropertyFilters } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';

const propertyTypes = ['flats', 'house', 'pg', 'commercial'];

const defaultFilters: PropertyFilters = {
  type: '',
  minPrice: undefined,
  maxPrice: undefined,
  city: '',
  state: '',
  available: true,
  page: 1,
  limit: 9,
  search: '',
};

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, isMobile }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: isMobile ? '400px' : '600px',
      margin: '0 auto',
      position: isMobile ? 'fixed' : 'sticky',
      top: isMobile ? '110%' : '20px',
      left: isMobile ? '50%' : 'auto',
      transform: isMobile ? 'translate(-50%, -50%)' : 'none',
      zIndex: 1100,
      px: 2,
    }}
  >
    <Paper
      elevation={3}
      sx={{
        borderRadius: '30px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: 6,
        },
      }}
    >
      <TextField
        fullWidth
        placeholder="Search city or state..."
        value={value}
        onChange={onChange}
        name="city"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
          sx: {
            '& fieldset': { border: 'none' },
            padding: '12px 20px',
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            fontSize: '1.1rem',
          },
        }}
      />
    </Paper>
  </Box>
);

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onReset,
}) => (
  <Drawer
    anchor="bottom"
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        maxHeight: '85vh',
        overflow: 'auto',
      },
    }}
  >
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
        }}
      >
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="number"
            label="Min Price"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={onFilterChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="number"
            label="Max Price"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={onFilterChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={filters.state}
            onChange={onFilterChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Availability"
            name="available"
            value={filters.available ? 'true' : 'false'}
            onChange={onFilterChange}
          >
            <MenuItem value="true">Available</MenuItem>
            <MenuItem value="false">Not Available</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          gap: 2,
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'background.paper',
          py: 2,
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  </Drawer>
);

export const Properties: React.FC = () => {
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [activeTab, setActiveTab] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.getAll(filters),
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setFilters(prev => ({
      ...prev,
      type: newValue,
      page: 1,
    }));
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setActiveTab('');
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: 'background.default',
            pt: 2,
            pb: 2,
            zIndex: 1099,
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            borderColor: 'divider',
          }}
        >
          {/* <Typography variant="h4" gutterBottom>
            Explore Properties
          </Typography> */}

          {user?.role === 'owner' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/my-properties')}
              sx={{ mb: 2 }}
            >
              Manage My Properties
            </Button>
          )}

          <Box sx={{display: 'flex',justifyContent:"center"}}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 ,justifyContent:"center"}}
          >
            <Tab label="All" value="" />
            {propertyTypes.map(type => (
              <Tab
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                value={type}
              />
            ))}
          </Tabs>
          </Box>
          <SearchBar
        value={filters.search || ''}
        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
        isMobile={isMobile}
        />
        </Box>

        

        {isMobile ? (
          <Box sx={{ height: '0vh' }} />
        ) : (
          <Box sx={{ height: '20px' }} />
        )}

        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '600px',
            zIndex: 1100,
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => setDrawerOpen(true)}
            startIcon={<FilterListIcon />}
            sx={{
              borderRadius: '30px',
              boxShadow: 3,
            }}
          >
            Filters
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            sx={{
              borderRadius: '30px',
              boxShadow: 3,
            }}
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </Box>

        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <Box sx={{ mt: 4, mb: 10 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error loading properties. Please try again later.
            </Alert>
          ) : data?.properties.length === 0 ? (
            <Alert severity="info">No properties found matching your criteria.</Alert>
          ) : (
            <Grid container spacing={3}>
              {data?.properties.map((property: Property) => (
                <Grid sx={{ marginTop: isMobile ? "0%" : "0",}} item xs={12} sm={6} md={4} key={property._id}>
                  <PropertyCard property={property} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};