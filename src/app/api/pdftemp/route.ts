import { NextRequest, NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import File from '@/models/files';
import { cookiesParse } from '@/utils/cookies';
import { parseAndFetchPDFResult } from '../../../../llamaparser';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const user = await cookiesParse(req);
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
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the file.' },
      { status: 500 }
    );
  }
}
