const cloudinaryImageUploadMethod = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);

  console.log('Uploading image:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('Upload API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload API error response:', errorData);
      throw new Error(`Upload failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log('Upload successful:', data);
    
    if (!data.success || !data.urls || data.urls.length === 0) {
      throw new Error('Upload response is missing URLs');
    }

    return { secure_url: data.urls[0] };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

const cloudinaryVideoUploadMethod = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('resource_type', 'video');

  console.log('Uploading video:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Video upload failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.urls || data.urls.length === 0) {
      throw new Error('Video upload response is missing URLs');
    }

    return { secure_url: data.urls[0] };
  } catch (error) {
    console.error('Video upload error:', error);
    throw error;
  }
};

export default cloudinaryImageUploadMethod;
export { cloudinaryVideoUploadMethod };
