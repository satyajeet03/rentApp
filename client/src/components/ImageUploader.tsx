import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { propertyApi, queryClient } from '../services/api';

interface ImageUploaderProps {
  value: (string | File)[];
  onChange: (images: (string | File)[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadImages = useMutation({
    mutationFn: async (data: FormData) => {
      // Log the FormData before sending
      console.log('FormData being sent:', Array.from(data.entries()));
      return propertyApi.uploadImages(data);
    },
    onSuccess: (res) => {
      console.log('Upload response:', res);
      enqueueSnackbar('Images uploaded successfully!', { variant: 'success' });

      // Push uploaded image URLs to Formik state
      if (Array.isArray(res?.images)) { // Changed from res?.images to res?.urls to match backend
        onChange([...value, ...res.images]);
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
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }
    
    try {
      setIsLoading(true);
      const formData:any = new FormData();
      
      // Add each file to FormData
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i}:`, file.name, file.type, file.size);
        formData.append('images', file);
      }

      // Verify FormData contents
      console.log('FormData contents:');
      for (const pair of formData.entries()) {
        console.log('Key:', pair[0], 'Value:', pair[1]);
      }

      // Upload the files
      await uploadImages.mutateAsync(formData);
      
      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Error in handleImageChange:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        multiple 
        onChange={handleImageChange}
        disabled={isLoading}
      />
      {isLoading && <div>Uploading...</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {value.map((img, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              src={typeof img === 'string' ? img : URL.createObjectURL(img)}
              alt={`preview-${index}`}
              style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: '#000000aa',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 6px',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;