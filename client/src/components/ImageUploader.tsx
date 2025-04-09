// ImageUploader.tsx
import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { propertyApi, queryClient } from '../services/api';
import { Button, CircularProgress } from '@mui/material';

interface ImageUploaderProps {
  value: (string | File)[];
  onChange: (images: (string | File)[]) => void;
  onUploadStatusChange: (isUploading: boolean) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange,onUploadStatusChange  }) => {
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
    onMutate: () => {
      setIsLoading(true);
      onUploadStatusChange(true);
    },
    onSuccess: (res) => {
      console.log(res?.urls)
      if (Array.isArray(res?.urls)) {
        // Only keep existing URLs and add new ones
        const existingUrls = value.filter((img): img is string => typeof img === 'string');
        onChange([...existingUrls, ...res.urls]);
      }
      onUploadStatusChange(false);
      enqueueSnackbar('Images uploaded successfully!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['upload-images'] });
    },
    onSettled: () => {
      setIsLoading(false);
      onUploadStatusChange(false);
      if (inputRef.current) inputRef.current.value = '';
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