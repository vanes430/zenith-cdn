// app/layout.tsx

'use client';

import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Simple File Explorer</title>
        <meta name="description" content="A simple file explorer built with Next.js" />
      </head>
      <body>
        <header>
          <h1>File Explorer</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy; 2025 Simple File Explorer</p>
        </footer>
      </body>
    </html>
  );
}
