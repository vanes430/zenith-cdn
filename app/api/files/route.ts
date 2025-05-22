// app/api/files/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const folderPath = url.searchParams.get('folder') || ''; // Mendapatkan parameter folder
  const filePath = url.searchParams.get('file'); // Mendapatkan file yang diminta

  if (filePath) {
    const fullPath = path.join(process.cwd(), 'public', folderPath, filePath);
    try {
      const fileContent = fs.readFileSync(fullPath, 'utf-8'); // Membaca konten file dalam bentuk text
      return NextResponse.json({ content: fileContent }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Unable to read the file' }, { status: 500 });
    }
  } else {
    const directoryPath = path.join(process.cwd(), 'public', folderPath); // Untuk folder

    try {
      const stats = fs.statSync(directoryPath); // Mendapatkan informasi tentang folder/file

      if (stats.isDirectory()) {
        const files = fs.readdirSync(directoryPath);

        const fileDetails = files.map((file) => {
          const filePath = path.join(directoryPath, file);
          const stats = fs.statSync(filePath);

          return {
            name: file,
            size: stats.size,
            lastModified: stats.mtime,
            isDirectory: stats.isDirectory(),
          };
        });

        return NextResponse.json(fileDetails, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unable to read directory or file details' }, { status: 500 });
    }
  }
}
