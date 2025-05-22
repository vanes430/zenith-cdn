// app/layout.tsx

import './globals.css';

export const metadata = {
  title: 'Simple File Explorer',
  description: 'A simple file explorer built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
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
