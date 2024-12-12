import { NextRequest, NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

let mockDatabase: any[] = []; // Simulated database for uploaded file metadata

export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data.' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileStream = Readable.from(fileBuffer);

    const uploadKey = `uploads/${Date.now()}-${file.name}`;

    // Upload file to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: uploadKey,
        Body: fileStream,
        ContentType: file.type,
      },
    });

    const result = await upload.done();
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadKey}`;

    // Add file metadata to mock database
    const uploadedFile = {
      id: mockDatabase.length + 1,
      fileName: file.name,
      url: fileUrl,
      date: new Date(),
      status: 'Uploaded',
    };
    mockDatabase.push(uploadedFile);

    return NextResponse.json({
      message: 'File uploaded successfully.',
      fileUrl,
    });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the file.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return mock database to simulate fetching uploaded files
    return NextResponse.json({ document: mockDatabase });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching files.' },
      { status: 500 }
    );
  }
}
