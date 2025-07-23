import { NextRequest, NextResponse } from 'next/server';

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

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/df2vybyev/video/upload",
      {
        method: "POST",
        body: fileFormData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary video error response:', errorText);
      throw new Error(`Cloudinary video upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Cloudinary error: ${data.error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const resourceType = formData.get('resource_type') as string || 'image';
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(file => 
      resourceType === 'video' ? cloudinaryVideoUploadMethod(file) : cloudinaryImageUploadMethod(file)
    );
    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      urls: results.map(result => result.secure_url)
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 