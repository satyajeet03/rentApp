// ImageUploader.tsx
import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { propertyApi, queryClient } from '../services/api';
import { Button, CircularProgress } from '@mui/material';

interface ImageUploaderProps {
  value: (string | File)[];
  onChange: (images: (string | File)[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadImages = useMutation({
    mutationFn: async (files: FileList) => {
      const formData: any = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
      return propertyApi.uploadImages(formData);
    },
    onSuccess: (res) => {
      enqueueSnackbar('Images uploaded successfully!', { variant: 'success' });
      if (Array.isArray(res?.urls)) {
        // Replace the File objects with the uploaded URLs
        const newImages = value.map(img => 
          typeof img === 'string' ? img : null
        ).filter(Boolean);
        console.log(newImages)
        onChange([...newImages, ...res.urls]);
      }
      queryClient.invalidateQueries({ queryKey: ['upload-images'] });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      enqueueSnackbar('Failed to upload images.', { variant: 'error' });
    },
  });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsLoading(true);
      // Create local previews before uploading
      const newFiles = Array.from(files);
      onChange([...value, ...newFiles]); // Add files to the form state immediately
      await uploadImages.mutateAsync(files);
    } catch (error) {
      console.error('Error in handleImageChange:', error);
    } finally {
      if (inputRef.current) inputRef.current.value = '';
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        disabled={isLoading}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      
      <Button
        variant="outlined"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={20} /> : 'Upload Images'}
      </Button>
    </div>
  );
};

export default ImageUploader;