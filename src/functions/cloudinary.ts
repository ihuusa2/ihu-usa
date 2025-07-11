const cloudinaryImageUploadMethod = async (file: File) => {
  // Check if API key is configured
  if (!process.env.CLOUDINARY_API_KEY) {
    console.error('CLOUDINARY_API_KEY is not configured');
    throw new Error('Cloudinary API key is not configured. Please add CLOUDINARY_API_KEY to your environment variables.');
  }

  const fileFormData = new FormData();
  fileFormData.append("file", file);
  fileFormData.append("upload_preset", "ihuusa");
  fileFormData.append("api_key", process.env.CLOUDINARY_API_KEY);

  console.log('Uploading to Cloudinary:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadPreset: 'ihuusa',
    hasApiKey: !!process.env.CLOUDINARY_API_KEY
  });

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/df2vybyev/auto/upload",
      {
        method: "POST",
        body: fileFormData,
      }
    );

    console.log('Cloudinary response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', {
      secure_url: data.secure_url,
      public_id: data.public_id,
      format: data.format
    });
    
    if (data.error) {
      throw new Error(`Cloudinary error: ${data.error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

const cloudinaryVideoUploadMethod = async (file: File) => {
  const fileFormData = new FormData();
  fileFormData.append("file", file);
  fileFormData.append("upload_preset", "ihuusa");
  fileFormData.append("resource_type", "video");
  fileFormData.append("api_key", process.env.CLOUDINARY_API_KEY as string);

  const data = await fetch(
    "https://api.cloudinary.com/v1_1/df2vybyev/video/upload",
    {
      method: "POST",
      body: fileFormData,
    }
  )
    .then((res) => res.json())
    .catch((error) => error);

  return data;
};

export default cloudinaryImageUploadMethod;
export { cloudinaryVideoUploadMethod };
