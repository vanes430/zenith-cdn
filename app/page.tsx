// app/page.tsx

import { useState, useEffect } from 'react';

const FileExplorer = () => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('/api/files');
      const data = await res.json();
      setFiles(data);
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Simple File Explorer</h1>
      <div>
        <h2>Files:</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileExplorer;
