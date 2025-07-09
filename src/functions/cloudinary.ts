const cloudinaryImageUploadMethod = async (file: File) => {
  const fileFormData = new FormData();
  fileFormData.append("file", file);
  fileFormData.append("upload_preset", "ihuusa");
  fileFormData.append("api_key", process.env.CLOUDINARY_API_KEY as string);

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/df2vybyev/auto/upload",
      {
        method: "POST",
        body: fileFormData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
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
