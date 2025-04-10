// components/ImageGallery.tsx
import { Box, Dialog, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowBackIos, ArrowForwardIos, ZoomIn, Close } from '@mui/icons-material';
import { useState, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageGalleryProps {
  images: string[];
}

export const ImageCarousel = ({ images }: ImageGalleryProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const swiperRef = useRef<any>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderSwiper = (height: number) => (
    <Box sx={{ position: 'relative' }}>
      <Swiper
        modules={[Navigation, Pagination]}
        onSwiper={(swiper:any) => (swiperRef.current = swiper)}
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
        style={{ borderRadius: '8px' }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={src}
              alt={`Property ${index}`}
              sx={{
                width: '100%',
                height,
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Prev Button */}
    {images.length > 1 ? <>
        <IconButton
        onClick={() => swiperRef.current?.slidePrev()}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 10,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          p: 0.5,
          zIndex: 10,
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ArrowBackIos fontSize="small" />
      </IconButton>

      {/* Custom Next Button */}
      <IconButton
        onClick={() => swiperRef.current?.slideNext()}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 10,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          p: 0.5,
          zIndex: 10,
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ArrowForwardIos fontSize="small" />
      </IconButton>
    </> : ""}
    </Box>
  );

  return (
    <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
      {renderSwiper(300)}

      {/* Fullscreen Button */}
      <IconButton
        onClick={handleOpen}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ZoomIn fontSize="small" />
      </IconButton>

      {/* Fullscreen Dialog */}
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} maxWidth="md" fullWidth>
        <Box sx={{ p: 1, backgroundColor: 'black', position: 'relative' }}>
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              zIndex: 20,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <Close />
          </IconButton>

          {renderSwiper(500)}
        </Box>
      </Dialog>
    </Box>
  );
};
