// app/api/files/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const folderPath = url.searchParams.get('folder') || ''; // Mendapatkan parameter folder
  const directoryPath = path.join(process.cwd(), 'public', folderPath); // Menggunakan folder dinamis

  try {
    const stats = fs.statSync(directoryPath); // Mendapatkan informasi tentang folder/file

    // Jika directoryPath adalah folder
    if (stats.isDirectory()) {
      const files = fs.readdirSync(directoryPath);

      const fileDetails = files.map((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath); // Mendapatkan metadata file

        return {
          name: file,
          size: stats.size,  // Ukuran dalam byte
          lastModified: stats.mtime,  // Tanggal terakhir diubah
          isDirectory: stats.isDirectory(), // Menandakan apakah ini folder atau file
        };
      });

      return NextResponse.json(fileDetails, { status: 200 });
    } else {
      // Jika file, kembalikan informasi raw URL
      return NextResponse.json(
        { name: path.basename(directoryPath), rawUrl: `/public/${folderPath}` },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: 'Unable to read directory or file details' }, { status: 500 });
  }
}
