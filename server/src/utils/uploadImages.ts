import cloudinary from '../config/cloudinaryConfig';

// export const uploadImagesToCloudinary = async (files: Express.Multer.File[],userId:any) => {
//   const uploadedUrls: string[] = [];

//   for (const file of files) {
//     try {
//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: `${userId}`,
//       });
//       uploadedUrls.push(result.secure_url);
//     } catch (err) {
//       console.error('Upload error:', err);
//     }
//   }

//   return uploadedUrls;
// };
// src/utils/uploadImages.ts 

export const uploadImagesToCloudinary = async (files: Express.Multer.File[], userId: string) => {
  try {
    // Check if files exist and is an array
    if (!files || !Array.isArray(files)) {
      console.log('No files received or files is not an array:', files);
      return [];
    }

    // Map through the files and upload each one
    const uploadPromises = files.map(async (file) => {
      // Convert the file buffer to base64
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      try {
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: `property_images/${userId}`,
          resource_type: 'auto'
        });
        return result.secure_url;
      } catch (error) {
        console.error('Error uploading individual file:', error);
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);
    return urls.filter(url => url !== null); // Remove any failed uploads
  } catch (error) {
    console.error('Error in uploadImagesToCloudinary:', error);
    throw error;
  }
};