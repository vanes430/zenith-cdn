// app/api/files/route.ts

export async function GET() {
  const files = [
    'file1.txt',
    'file2.jpg',
    'file3.pdf',
    'file4.png',
    'file5.docx'
  ];

  return new Response(JSON.stringify(files), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
