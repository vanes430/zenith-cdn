// app/api/files/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const folderPath = url.searchParams.get('folder') || ''; // Mendapatkan parameter folder
  const directoryPath = path.join(process.cwd(), 'public', folderPath); // Menggunakan folder dinamis

  try {
    // Membaca isi folder
    const files = fs.readdirSync(directoryPath);

    // Mengambil detail file: nama, ukuran, tanggal terakhir diubah
    const fileDetails = files.map((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath); // Mendapatkan metadata file

      return {
        name: file,
        size: stats.size,  // Ukuran dalam byte
        lastModified: stats.mtime,  // Tanggal terakhir diubah
      };
    });

    return NextResponse.json(fileDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to read directory or file details' }, { status: 500 });
  }
}
