// app/layout.tsx

import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Zenith-CDN</title>
        <meta name="description" content="A simple file explorer built with Next.js" />
      </head>
      <body>
        <div className="layout-container">
          {children}
        </div>
      </body>
    </html>
  );
}
