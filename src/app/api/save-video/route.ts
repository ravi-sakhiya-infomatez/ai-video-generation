import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import * as fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;

    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Convert the file to buffer
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the file path
    const downloadsDir = path.join(process.cwd(), 'downloads');

    // Ensure downloads directory exists
    try {
      await fs.mkdir(downloadsDir, { recursive: true });
    } catch (err) {
      // Find existing directory is fine, other errors are not
      if ((err as any).code !== 'EEXIST') throw err;
    }

    const filePath = path.join(downloadsDir, video.name);

    // Write the file
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'Video saved successfully',
      path: filePath
    });
  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json(
      { error: 'Failed to save video' },
      { status: 500 }
    );
  }
}