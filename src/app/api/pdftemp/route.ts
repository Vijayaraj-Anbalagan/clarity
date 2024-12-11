import { NextRequest, NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import File from '@/models/files';
import { cookiesParse } from '@/utils/cookies';

export async function POST(req: NextRequest) {
  try {
    const user = await cookiesParse(req);
    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;
    const s3Client = new S3Client({ region });

    // Ensure the content-type is multipart/form-data
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

    // Validate file type
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
      return NextResponse.json(
        {
          error: `Invalid file type: .${fileExtension}. Allowed types are ${allowedExtensions.join(
            ', '
          )}`,
        },
        { status: 400 }
      );
    }

    // Prepare file for upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileStream = Readable.from(fileBuffer);
    const uploadKey = `uploads/${Date.now()}-${file.name}`;

    // Use the `Upload` utility
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: uploadKey,
        Body: fileStream,
        ContentType: file.type,
      },
    });

    const result = await upload.done();

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uploadKey}`;

    // Assuming you have a File model and a way to save it

    const existingFile = await File.findOne({ user: user._id });

    if (existingFile) {
      existingFile.files.push({
        fileName: file.name,
        url: fileUrl,
        details: 'Uploaded file',
      });
      await existingFile.save();
    } else {
      const newFile = new File({
        user: user._id,
        files: [
          {
            fileName: file.name,
            url: fileUrl,
          },
        ],
      });
      await newFile.save();
    }
    return NextResponse.json({
      message: 'File uploaded successfully.',
      fileUrl,
      result,
    });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the file.' },
      { status: 500 }
    );
  }
}
